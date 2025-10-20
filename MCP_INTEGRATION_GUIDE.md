# Hera AI - ChatGPT Apps MCP Integration Guide

> **目标：** 将 Hera AI 现有功能通过 MCP 协议接入 ChatGPT Apps，让用户可以在 ChatGPT 对话中使用 Hera 的智能求职功能。

> **原则：** 最小改动，不影响现有代码，分阶段实施，每步验收后再进行下一步。

> **⚠️ 重要：所有代码使用纯英文** - 包括注释、变量名、错误消息、日志等，已在本文档中全部实现。

---

## 📋 总体规划

| Phase | 功能 | 工具数量 | 预计时间 | 风险等级 |
|-------|------|---------|---------|---------|
| **Phase 0** | 最小可行版本（MVP） | 3 个工具 | 0.5-1 天 | 低 |
| **Phase 1** | 安全与优化 | 3 个工具（优化） | 0.5-1 天 | 低 |
| **Phase 2** | 完整功能 | 7 个工具 | 2-3 天 | 中 |

---

## 🎯 Phase 0: 最小可行版本（MVP）

### **目标**
- 创建 MCP 适配层（不改动任何现有业务代码）
- 实现 3 个核心工具：`search_jobs`, `build_search_links`, `get_user_applications`
- 在 ChatGPT Apps 中成功调用

### **新增文件清单**
```
heraai_rebuild_public_v1/
├── MCP_INTEGRATION_GUIDE.md          # 本文档（新增）
├── MCP_ROUTE_TEMPLATE.ts             # 新增：纯英文代码模板（可直接复制）
├── src/
│   └── app/
│       └── api/
│           └── mcp/
│               └── route.ts          # 新增：MCP 适配层主文件
└── .env.local                        # 更新：添加 MCP_SHARED_SECRET
```

### **改动的现有文件**
- **无** - Phase 0 完全不改动现有代码

---

## ⚠️ **重要：代码规范**

**所有代码必须使用纯英文：**
- ✅ 注释使用英文
- ✅ 变量名使用英文
- ✅ 错误消息使用英文
- ✅ 日志消息使用英文
- ✅ 字符串常量使用英文

**原因：**
1. 与现有 Hera 代码库保持一致
2. 便于国际化和团队协作
3. 避免编码问题和兼容性问题

**示例对比：**

❌ **错误写法（包含中文）：**
```typescript
// 鉴权中间件
function validateAuth(request: NextRequest): boolean {
  // 调用现有 API
  console.log('开始验证');
  return true;
}
```

✅ **正确写法（纯英文）：**
```typescript
// Authentication Middleware
function validateAuth(request: NextRequest): boolean {
  // Call existing API
  console.log('Starting validation');
  return true;
}
```

**✅ 本文档中的所有代码已遵循此规范，可直接使用。**

### **快速检查清单（代码规范）**

在创建 `/src/app/api/mcp/route.ts` 后，请检查以下内容：

- [ ] 所有注释使用英文（如 `// Authentication Middleware`）
- [ ] 所有函数名使用英文（如 `validateAuth`, `handleSearchJobs`）
- [ ] 所有变量名使用英文（如 `expectedToken`, `baseUrl`）
- [ ] 所有错误消息使用英文（如 `'job_title and city are required'`）
- [ ] 所有日志使用英文（如 `console.log('[MCP] Tool invoked: ...')`）
- [ ] 无任何中文字符出现在代码中（文档说明除外）

---

## 📝 Phase 0: 实施步骤

### **Step 1: 环境变量配置（5 分钟）**

#### 1.1 在本地创建/更新 `.env.local`

在项目根目录 `heraai_rebuild_public_v1/.env.local` 添加：

```bash
# MCP 鉴权密钥（新增）
MCP_SHARED_SECRET=hera_mcp_secret_2025_min_32_characters_long_random_string

# 确认以下环境变量已存在
NEXT_PUBLIC_BASE_URL=http://localhost:3002
MONGODB_URI=mongodb://localhost:27017  # 或您的 MongoDB URI
OPENAI_API_KEY=sk-...
```

> **重要：** `MCP_SHARED_SECRET` 必须至少 32 个字符，建议使用随机生成的字符串。

#### 1.2 在 Vercel 配置环境变量

1. 登录 Vercel Dashboard
2. 进入项目 → Settings → Environment Variables
3. 添加：
   - Key: `MCP_SHARED_SECRET`
   - Value: `hera_mcp_secret_2025_min_32_characters_long_random_string`
   - Environments: Production, Preview, Development

---

### **Step 2: 创建 MCP 适配层（30-60 分钟）**

#### 2.1 创建目录结构

```bash
cd heraai_rebuild_public_v1
mkdir -p src/app/api/mcp
```

#### 2.2 创建 `/src/app/api/mcp/route.ts`

**方式 1：复制完整代码文件（推荐）**

项目根目录已包含纯英文代码模板 `MCP_ROUTE_TEMPLATE.ts`，可直接复制：

```bash
# 复制模板到目标位置
cp MCP_ROUTE_TEMPLATE.ts src/app/api/mcp/route.ts
```

**方式 2：手动创建文件**

创建 `src/app/api/mcp/route.ts` 并粘贴以下代码：

**完整代码如下（所有代码均为纯英文）：**

```typescript
// src/app/api/mcp/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ============================================
// Authentication Middleware
// ============================================
function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.MCP_SHARED_SECRET}`;
  
  if (!expectedToken || expectedToken === 'Bearer undefined') {
    console.error('[MCP Auth] MCP_SHARED_SECRET not configured');
    return false;
  }
  
  return authHeader === expectedToken;
}

// ============================================
// Deep Link Generator Utility
// ============================================
function buildSearchLinks(args: {
  job_title: string;
  city: string;
  platforms?: string[];
  posted_within_days?: number;
}) {
  const {
    job_title,
    city,
    platforms = ['linkedin', 'seek', 'jora', 'adzuna'],
    posted_within_days = 7,
  } = args;

  const links: Array<{ platform: string; url: string; label: string }> = [];

  // LinkedIn
  if (platforms.includes('linkedin')) {
    const daysInSeconds = posted_within_days * 86400;
    links.push({
      platform: 'linkedin',
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
        job_title
      )}&location=${encodeURIComponent(
        city + ', Australia'
      )}&f_TPR=r${daysInSeconds}`,
      label: 'Open on LinkedIn',
    });
  }

  // SEEK
  if (platforms.includes('seek')) {
    const slugify = (str: string) =>
      str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    links.push({
      platform: 'seek',
      url: `https://www.seek.com.au/${slugify(job_title)}-jobs/in-${slugify(
        city
      )}?daterange=${posted_within_days}`,
      label: 'Open on SEEK',
    });
  }

  // Jora
  if (platforms.includes('jora')) {
    links.push({
      platform: 'jora',
      url: `https://au.jora.com/j?sp=search&q=${encodeURIComponent(
        job_title
      )}&l=${encodeURIComponent(city + ' VIC')}`,
      label: 'Open on Jora',
    });
  }

  // Adzuna
  if (platforms.includes('adzuna')) {
    links.push({
      platform: 'adzuna',
      url: `https://www.adzuna.com.au/search?q=${encodeURIComponent(
        job_title
      )}&w=${encodeURIComponent(city)}`,
      label: 'Open on Adzuna',
    });
  }

  return links;
}

// ============================================
// GET /api/mcp - Return Tools Manifest
// ============================================
export async function GET(request: NextRequest) {
  // Validate authentication
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  // Tools manifest
  const tools = [
    // Tool 1: Search Jobs
    {
      name: 'search_jobs',
      description:
        'Search for jobs using Hera\'s intelligent job aggregation system. Automatically determines whether to use Hot Jobs database (pre-analyzed, high-quality matches) or real-time platform scraping (LinkedIn, SEEK, Jora, Adzuna). Returns jobs with AI-powered match scores and detailed analysis.',
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description:
              "Target job title or role (e.g., 'Software Engineer', 'HR Manager', 'Data Analyst', 'xmas casual')",
          },
          city: {
            type: 'string',
            description:
              "City name for job location (e.g., 'Melbourne', 'Sydney', 'Brisbane')",
          },
          platform: {
            type: 'string',
            enum: ['all', 'linkedin', 'seek', 'jora', 'adzuna'],
            description:
              "Specific job platform to search. Use 'all' for multi-source aggregation (recommended). Default: 'all'",
            default: 'all',
          },
          limit: {
            type: 'integer',
            description:
              'Maximum number of jobs to return (1-100). Default: 25',
            minimum: 1,
            maximum: 100,
            default: 25,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 2: Build Search Links
    {
      name: 'build_search_links',
      description:
        'Generate direct search URLs for major job platforms (LinkedIn, SEEK, Jora, Adzuna) with pre-filled search parameters. Useful for expanding job search beyond Hera\'s aggregation. Returns clickable links.',
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: "Job title or keywords (e.g., 'data analyst')",
          },
          city: {
            type: 'string',
            description: "City name (e.g., 'Sydney')",
          },
          platforms: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['linkedin', 'seek', 'jora', 'adzuna'],
            },
            description:
              "Which platforms to generate links for. Default: ['linkedin', 'seek', 'jora', 'adzuna']",
            default: ['linkedin', 'seek', 'jora', 'adzuna'],
          },
          posted_within_days: {
            type: 'integer',
            description:
              'Filter by posting date (e.g., 7 for last week). Default: 7',
            minimum: 1,
            maximum: 365,
            default: 7,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 3: Get User Applications
    {
      name: 'get_user_applications',
      description:
        "Retrieve user's job application history including saved jobs, tailored resumes, cover letters, and application status. Helps track job search progress and manage applications. Read-only; no data will be modified.",
      input_schema: {
        type: 'object',
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description:
              "User's email address to fetch application history. Email used only for lookups; never stored from this call.",
          },
          status_filter: {
            type: 'string',
            enum: ['all', 'saved', 'applied', 'interviewing', 'offered', 'rejected'],
            description: "Filter by application status. Default: 'all'",
            default: 'all',
          },
        },
        required: ['user_email'],
        additionalProperties: false,
      },
    },
  ];

  return NextResponse.json({ tools });
}

// ============================================
// POST /api/mcp - Tool Invocation Handler
// ============================================
export async function POST(request: NextRequest) {
  // Validate authentication
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, arguments: args } = body;

    console.log(`[MCP] Tool invoked: ${name}`, {
      args: JSON.stringify(args).substring(0, 200),
    });

    // Route to appropriate tool handler
    switch (name) {
      case 'search_jobs':
        return await handleSearchJobs(args);

      case 'build_search_links':
        return await handleBuildSearchLinks(args);

      case 'get_user_applications':
        return await handleGetApplications(args);

      default:
        return NextResponse.json(
          {
            error: `Unknown tool: ${name}`,
            code: 'INVALID_TOOL',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[MCP] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}

// ============================================
// Tool Handler Functions
// ============================================

// Tool 1: Search Jobs
async function handleSearchJobs(args: any) {
  const { job_title, city, platform = 'all', limit = 25 } = args;

  if (!job_title || !city) {
    throw new Error('job_title and city are required');
  }

  // Call existing API (no changes to business logic)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  const apiUrl = `${baseUrl}/api/job-fetch-service?jobTitle=${encodeURIComponent(
    job_title
  )}&city=${encodeURIComponent(city)}&platform=${platform}&limit=${Math.min(
    limit,
    100
  )}`;

  console.log(`[MCP search_jobs] Calling: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Job search failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Return result (preserve existing API format)
  return NextResponse.json({
    content: {
      jobs: data.jobs.slice(0, limit),
      total: data.jobs.length,
      source: data.source,
      isHotJob: data.isHotJob,
    },
  });
}

// Tool 2: Build Search Links
async function handleBuildSearchLinks(args: any) {
  const { job_title, city, platforms, posted_within_days } = args;

  if (!job_title || !city) {
    throw new Error('job_title and city are required');
  }

  const links = buildSearchLinks({
    job_title,
    city,
    platforms,
    posted_within_days,
  });

  return NextResponse.json({
    content: {
      links,
      total: links.length,
    },
  });
}

// Tool 3: Get User Applications
async function handleGetApplications(args: any) {
  const { user_email, status_filter = 'all' } = args;

  if (!user_email) {
    throw new Error('user_email is required');
  }

  // Call existing API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  const apiUrl = `${baseUrl}/api/applications?email=${encodeURIComponent(
    user_email
  )}`;

  console.log(`[MCP get_user_applications] Calling: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to retrieve applications');
  }

  // Optional: filter by status
  let applications = data.applications || [];

  if (status_filter !== 'all') {
    applications = applications.filter(
      (app: any) => app.applicationStatus === status_filter
    );
  }

  return NextResponse.json({
    content: {
      applications,
      total: applications.length,
      userProfile: data.userProfile,
    },
  });
}
```

---

### **Step 3: 本地测试（15-30 分钟）**

#### 3.1 启动开发服务器

```bash
cd heraai_rebuild_public_v1
npm run dev
```

#### 3.2 测试 GET 请求（获取工具清单）

在终端运行：

```bash
curl -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  http://localhost:3002/api/mcp
```

**预期结果：**
```json
{
  "tools": [
    {
      "name": "search_jobs",
      "description": "Search for jobs...",
      "input_schema": { ... }
    },
    {
      "name": "build_search_links",
      ...
    },
    {
      "name": "get_user_applications",
      ...
    }
  ]
}
```

#### 3.3 测试 POST 请求（调用 search_jobs）

```bash
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_jobs",
    "arguments": {
      "job_title": "software engineer",
      "city": "Melbourne",
      "limit": 10
    }
  }'
```

**预期结果：**
```json
{
  "content": {
    "jobs": [
      {
        "id": "...",
        "title": "Senior Software Engineer",
        "company": "...",
        "location": "Melbourne, VIC",
        ...
      }
    ],
    "total": 10,
    "source": "hot_jobs_database",
    "isHotJob": true
  }
}
```

#### 3.4 测试无鉴权请求（应返回 401）

```bash
curl http://localhost:3002/api/mcp
```

**预期结果：**
```json
{
  "error": "Unauthorized - Invalid or missing Bearer token"
}
```

---

### **Step 4: 部署到 Vercel（10-15 分钟）**

#### 4.1 提交代码

```bash
git add .
git commit -m "feat: Add MCP integration layer (Phase 0 - MVP)"
git push origin main
```

#### 4.2 等待 Vercel 自动部署

1. 登录 Vercel Dashboard
2. 确认部署成功
3. 记录生产环境 URL（如 `https://heraai.vercel.app`）

#### 4.3 测试生产环境

```bash
curl -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  https://your-domain.vercel.app/api/mcp
```

---

### **Step 5: 接入 ChatGPT Apps（10-15 分钟）**

#### 5.1 在 ChatGPT 中创建 App

1. 打开 ChatGPT（确保使用 Plus/Pro 账户）
2. 进入 **Settings** → **Apps** → **Connect app**
3. 填写信息：
   - **App Name:** `Hera AI Job Assistant`
   - **Endpoint URL:** `https://your-domain.vercel.app/api/mcp`
   - **Authentication:** 
     - Type: `Bearer Token`
     - Token: `hera_mcp_secret_2025_min_32_characters_long_random_string`
4. 点击 **Connect**

#### 5.2 测试工具调用

在 ChatGPT 对话中输入：

**测试 1: Search Jobs**
```
Find software engineer jobs in Melbourne, limit to 10 results
```

**预期：** ChatGPT 应自动调用 `search_jobs` 工具，返回职位列表

**测试 2: Build Search Links**
```
Generate job search links for data analyst positions in Sydney
```

**预期：** 返回 LinkedIn、SEEK、Jora、Adzuna 的搜索链接

**测试 3: Get Applications**
```
Show my job applications for email: test@example.com
```

**预期：** 返回该用户的申请历史

---

## ✅ Phase 0 验收标准（Double Check）

在进入 Phase 1 之前，请确认以下所有项目：

### **功能验收**
- [ ] GET `/api/mcp` 返回 3 个工具的完整清单
- [ ] POST `/api/mcp` + `search_jobs` 成功返回职位数据
- [ ] POST `/api/mcp` + `build_search_links` 返回 1-4 条平台链接
- [ ] POST `/api/mcp` + `get_user_applications` 返回用户申请历史
- [ ] 无 Bearer Token 请求返回 401 错误
- [ ] 错误的工具名返回 400 错误

### **安全验收**
- [ ] `MCP_SHARED_SECRET` 已配置在 Vercel 环境变量
- [ ] 本地 `.env.local` 文件未提交到 Git（确认在 `.gitignore` 中）
- [ ] 所有 API 调用都经过 Bearer Token 鉴权

### **集成验收**
- [ ] ChatGPT Apps 成功连接到 Hera AI
- [ ] 在 ChatGPT 对话中可以成功调用 3 个工具
- [ ] 工具返回结果在 ChatGPT 中正确渲染

### **代码质量**
- [ ] 新增代码仅在 `src/app/api/mcp/route.ts`
- [ ] **零改动**现有业务代码（job-fetch-service, applications 等）
- [ ] **所有代码使用纯英文**（注释、变量名、错误消息、日志）
- [ ] 代码包含清晰的注释和日志
- [ ] Console 日志可见工具调用记录

### **文档验收**
- [ ] `MCP_INTEGRATION_GUIDE.md` 已创建
- [ ] 团队成员可以按照文档独立完成部署

---

## 🎉 Phase 0 完成标志

当上述所有验收标准通过后，您可以：

1. ✅ 在团队会议上演示 ChatGPT Apps 调用 Hera AI
2. ✅ 向早期用户开放测试（提供 ChatGPT App 连接方式）
3. ✅ 准备进入 Phase 1（安全与优化）

---

## 🔄 Phase 0 回滚方案

如果遇到问题需要回滚：

```bash
# 删除 MCP 适配层
rm -rf src/app/api/mcp

# 恢复到上一次提交
git reset --hard HEAD~1

# 重新部署
git push origin main --force
```

> **注意：** Phase 0 完全独立，回滚不会影响任何现有功能。

---

## 📞 Phase 0 故障排查

### **问题 1: 401 Unauthorized**
**原因：** Bearer Token 不匹配
**解决：**
1. 确认 Vercel 环境变量 `MCP_SHARED_SECRET` 已设置
2. 确认 ChatGPT Apps 中的 Token 与环境变量一致
3. 重新部署 Vercel 项目

### **问题 2: 500 Internal Server Error**
**原因：** 现有 API 调用失败
**解决：**
1. 检查 Vercel 日志：`vercel logs`
2. 确认 `NEXT_PUBLIC_BASE_URL` 正确
3. 确认 MongoDB 连接正常

### **问题 3: ChatGPT 无法连接**
**原因：** 端点 URL 错误或 CORS 问题
**解决：**
1. 确认 URL 格式：`https://your-domain.vercel.app/api/mcp`（无尾部斜杠）
2. 测试端点：`curl -H "Authorization: Bearer <token>" <endpoint>`
3. 确认 Vercel 部署成功

---

## 🚀 准备进入 Phase 1

Phase 0 完成后，下一步将进行：

- **Phase 1 目标：** 安全增强、错误处理优化、返回体标准化
- **Phase 1 改动：** 仅优化 `/api/mcp/route.ts`，仍然不改现有业务代码
- **Phase 1 时间：** 0.5-1 天

**Phase 1 详细内容将在 Phase 0 验收通过后补充到本文档。**

---

## 📝 团队协作建议

1. **指定负责人：** 一人负责完整实施 Phase 0
2. **结对复查：** 另一人按照本文档验收
3. **记录问题：** 遇到问题记录在文档末尾（见下方）
4. **更新文档：** 实施过程中发现的改进点及时更新

---

## 📋 实施记录（请在此记录）

| 日期 | 步骤 | 执行人 | 状态 | 备注 |
|------|------|--------|------|------|
| YYYY-MM-DD | Step 1: 环境变量 | - | ⏳ 待开始 | - |
| YYYY-MM-DD | Step 2: 创建 MCP 层 | - | ⏳ 待开始 | - |
| YYYY-MM-DD | Step 3: 本地测试 | - | ⏳ 待开始 | - |
| YYYY-MM-DD | Step 4: 部署 Vercel | - | ⏳ 待开始 | - |
| YYYY-MM-DD | Step 5: ChatGPT 接入 | - | ⏳ 待开始 | - |
| YYYY-MM-DD | 验收 Double Check | - | ⏳ 待开始 | - |

---

## ❓ 问题与解决记录

### 问题 1
- **问题描述：**
- **出现步骤：**
- **解决方案：**
- **解决时间：**

### 问题 2
- **问题描述：**
- **出现步骤：**
- **解决方案：**
- **解决时间：**

---

## 📚 参考资料

- [ChatGPT Apps SDK 官方文档](https://openai.com/index/introducing-apps-in-chatgpt/)
- [MCP 协议规范](https://spec.modelcontextprotocol.io/)
- [Next.js API Routes 文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Hera AI 现有 API：
  - `/api/job-fetch-service` - 职位搜索
  - `/api/applications` - 申请管理

---

**文档版本：** v0.1.0 - Phase 0  
**最后更新：** 2025-10-12  
**维护者：** Hera AI Team

