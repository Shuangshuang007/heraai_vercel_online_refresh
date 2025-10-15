# Hera AI MCP - Integrated Implementation Plan (Phase 0 + Optimization)

> **策略：** 直接实施"优化版 Phase 0"，一次性完成基础功能 + 推荐权重优化，避免重复工作

> **目标：** 
> 1. 让 Hera AI 在 ChatGPT Apps 中可用（基础功能）
> 2. 确保在 "find jobs in Australia" 等查询时优先被推荐（优化目标）

> **原则：** 最小改动，不影响现有代码，代码全英文，分步验收

---

## 📋 实施概览

| 步骤 | 内容 | 时间 | 验收标准 |
|------|------|------|---------|
| **Step 1** | 环境变量配置 | 5 分钟 | 本地和 Vercel 配置完成 |
| **Step 2** | 创建优化版 MCP 适配层 | 1-1.5 小时 | 文件创建，代码全英文 |
| **Step 3** | 本地测试 | 30 分钟 | 3 个工具调用成功 |
| **Step 4** | 部署到 Vercel | 15 分钟 | 生产环境可用 |
| **Step 5** | ChatGPT Apps 接入 | 15 分钟 | 推荐权重验证 |

**总时间：** 约 2-2.5 小时

---

## 🎯 本次实施包含的优化（vs 基础版）

### **核心优化点（已融入 Phase 0）**

| 优化项 | 基础版 Phase 0 | 优化版 Phase 0（本次实施） |
|--------|---------------|------------------------|
| **App 名称** | `Hera AI Job Assistant` | `Hera Jobs - Multi-Source Aggregator` ✅ |
| **工具描述** | 平淡的功能描述 | `[MULTI-SOURCE]` 标签 + 优势列表 ✅ |
| **country_code** | ❌ 无 | ✅ 支持，触发地区优化 |
| **sources 参数** | `platform: string` | `sources: array` ✅ 多选支持 |
| **来源徽章** | ❌ 无 | ✅ 每条 job 带 `source` 标识 |
| **去重逻辑** | ❌ 无 | ✅ 智能去重 + 统计 |
| **策略路由** | ❌ 无 | ✅ AU → SEEK 优先 |

---

## 📝 Step-by-Step 实施步骤

### **Step 1: 环境变量配置（5 分钟）**

#### 1.1 更新本地 `.env.local`

在 `heraai_rebuild_public_v1/.env.local` 中添加：

```bash
# MCP Integration (新增)
MCP_SHARED_SECRET=hera_mcp_secret_2025_min_32_characters_long_random_string

# 确认以下环境变量已存在
NEXT_PUBLIC_BASE_URL=http://localhost:3002
MONGODB_URI=mongodb://localhost:27017
OPENAI_API_KEY=sk-...
```

#### 1.2 Vercel 环境变量配置

1. 登录 Vercel Dashboard
2. 进入项目 → Settings → Environment Variables
3. 添加 `MCP_SHARED_SECRET` (所有环境)

✅ **验收：** `.env.local` 已更新，Vercel 环境变量已配置

---

### **Step 2: 创建优化版 MCP 适配层（1-1.5 小时）**

#### 2.1 创建目录

```bash
cd heraai_rebuild_public_v1
mkdir -p src/app/api/mcp
```

#### 2.2 创建文件结构

我们将创建以下文件：
```
src/app/api/mcp/
├── route.ts              # 主文件（GET + POST handlers）
└── helpers.ts            # 辅助函数（去重、策略路由）
```

#### 2.3 核心优化说明

**本次实施的 route.ts 包含以下优化：**

1. **工具描述优化**
   ```typescript
   description: '[MULTI-SOURCE JOB SEARCH] Aggregate jobs from LinkedIn, SEEK, Jora, and Adzuna...'
   ```

2. **Schema 参数优化**
   - ✅ `country_code: string` (ISO-2, 默认 'AU')
   - ✅ `sources: array` (支持多选，默认 ['all'])
   - ✅ `enable_deduplication: boolean` (默认 true)
   - ✅ `min_match_score: integer` (0-100, 默认 0)

3. **策略路由**
   - 澳洲 (`country_code: 'AU'`) → 自动优先 SEEK
   - 美国 (`country_code: 'US'`) → LinkedIn + ZipRecruiter
   - 其他国家 → LinkedIn

4. **返回格式优化**
   - 每条 job 添加 `source` 和 `source_label`
   - 添加 `total_before_dedup` (去重效果展示)
   - 添加 `sources_used` (使用的平台)
   - 添加 `search_strategy` (策略透明化)

5. **去重逻辑**
   - 按 `company + title + location` 指纹去重
   - 保留第一条出现的 job

✅ **验收：** 文件已创建，代码全英文，包含所有优化点

---

### **Step 3: 本地测试（30 分钟）**

#### 3.1 启动开发服务器

```bash
npm run dev
```

#### 3.2 测试 GET（工具清单）

```bash
curl -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  http://localhost:3002/api/mcp
```

**验收点：**
- [ ] 返回 3 个工具
- [ ] `search_jobs` 描述包含 `[MULTI-SOURCE]` 标签
- [ ] `search_jobs` schema 包含 `country_code`, `sources`, `enable_deduplication`

#### 3.3 测试 POST（search_jobs - 基础查询）

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

**验收点：**
- [ ] 返回职位列表
- [ ] 自动使用 `country_code: 'AU'` (默认)
- [ ] 每条 job 包含 `source` 字段
- [ ] 返回体包含 `total_before_dedup`, `sources_used`, `search_strategy`
- [ ] 日志显示策略：`multi_source_with_seek_priority`

#### 3.4 测试 POST（search_jobs - 指定来源）

```bash
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_jobs",
    "arguments": {
      "job_title": "data analyst",
      "city": "Sydney",
      "sources": ["seek"],
      "limit": 5
    }
  }'
```

**验收点：**
- [ ] 只返回 SEEK 来源的职位
- [ ] `sources_used: ["seek"]`
- [ ] `search_strategy: "user_specified_sources"`

#### 3.5 测试其他工具

```bash
# Test build_search_links
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "build_search_links",
    "arguments": {
      "job_title": "marketing manager",
      "city": "Brisbane"
    }
  }'

# Test get_user_applications
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_user_applications",
    "arguments": {
      "user_email": "test@example.com"
    }
  }'
```

✅ **验收：** 所有测试通过，优化功能生效

---

### **Step 4: 部署到 Vercel（15 分钟）**

#### 4.1 提交代码

```bash
git add .
git commit -m "feat: Add optimized MCP integration layer with multi-source aggregation"
git push origin main
```

#### 4.2 确认部署成功

1. 在 Vercel Dashboard 查看部署状态
2. 等待部署完成（通常 2-5 分钟）

#### 4.3 测试生产环境

```bash
curl -H "Authorization: Bearer hera_mcp_secret_2025_min_32_characters_long_random_string" \
  https://your-domain.vercel.app/api/mcp
```

✅ **验收：** 生产环境可用，工具清单正确

---

### **Step 5: ChatGPT Apps 接入与推荐权重验证（15 分钟）**

#### 5.1 创建/更新 ChatGPT App

1. 打开 ChatGPT → Settings → Apps
2. 如果已有 Hera App，点击编辑；否则点击 "Connect app"
3. 填写信息：
   - **Name:** `Hera Jobs - Multi-Source Aggregator`
   - **Description:** `Search jobs across LinkedIn, SEEK, Jora, and Adzuna with intelligent deduplication and AI match scoring`
   - **Endpoint:** `https://your-domain.vercel.app/api/mcp`
   - **Auth:** Bearer Token = `hera_mcp_secret_...`
4. 点击 Save/Connect

#### 5.2 测试推荐权重（关键！）

**测试 1：模糊查询（测试推荐权重）**
```
Find jobs in Australia
```

**预期：**
- ✅ ChatGPT 选择 Hera Jobs（而非其他单一来源 App）
- ✅ 返回多源聚合结果
- ✅ 每条 job 显示来源徽章（如 "SEEK", "LinkedIn"）

**测试 2：地区优化**
```
Show me software engineer jobs in Melbourne
```

**预期：**
- ✅ 自动使用 `country_code: 'AU'`
- ✅ 日志显示策略：`multi_source_with_seek_priority`
- ✅ SEEK 来源的 job 优先出现

**测试 3：指定平台**
```
Search for data analyst jobs in Sydney, SEEK only
```

**预期：**
- ✅ ChatGPT 理解意图，传递 `sources: ["seek"]`
- ✅ 只返回 SEEK 来源的结果

**测试 4：去重效果**
```
Find marketing jobs in Brisbane with comprehensive search
```

**预期：**
- ✅ 返回多源结果
- ✅ ChatGPT 展示去重统计（如 "Found 38 jobs, deduplicated to 25"）

**测试 5：深链生成**
```
Give me search links for HR manager jobs in Perth
```

**预期：**
- ✅ 返回 LinkedIn, SEEK, Jora, Adzuna 的链接
- ✅ 链接可点击并正确跳转

✅ **验收：** 推荐权重验证通过，所有测试场景正常

---

## ✅ 总验收标准（Double Check）

### **功能完整性**
- [ ] 3 个工具都可调用（search_jobs, build_search_links, get_user_applications）
- [ ] `search_jobs` 包含优化参数（country_code, sources, enable_deduplication）
- [ ] 返回格式包含优化字段（source, total_before_dedup, sources_used）

### **推荐权重优化**
- [ ] 说 "Find jobs in Australia" 时，Hera 被 ChatGPT 优先选择
- [ ] 工具描述包含 `[MULTI-SOURCE]` 标签和优势列表
- [ ] App 名称清晰体现 "Multi-Source Aggregator" 定位

### **地区优化策略**
- [ ] 澳洲查询自动优先 SEEK（日志可验证）
- [ ] 用户可以通过 `sources` 参数筛选特定平台
- [ ] 每条 job 显示来源标识

### **代码质量**
- [ ] 所有代码使用纯英文（注释、变量名、日志）
- [ ] 零改动现有业务代码
- [ ] 代码结构清晰，注释完整

### **安全性**
- [ ] Bearer Token 鉴权生效（无 token → 401）
- [ ] 环境变量正确配置（本地 + Vercel）

---

## 📂 文件清单（本次实施将创建）

```
heraai_rebuild_public_v1/
├── src/app/api/mcp/
│   ├── route.ts          # 新增：优化版 MCP 适配层（~500 行）
│   └── helpers.ts        # 新增：辅助函数（~100 行）
├── .env.local            # 更新：添加 MCP_SHARED_SECRET
└── MCP_IMPLEMENTATION_PLAN.md  # 本文档
```

**改动的现有文件：** 无（零改动业务代码）

---

## 🎯 与基础版 Phase 0 的对比

| 项目 | 基础版 Phase 0 | 优化版 Phase 0（本次） |
|------|---------------|---------------------|
| **工具数量** | 3 个 | 3 个 ✅ |
| **实施时间** | 1-1.5 小时 | 2-2.5 小时 ✅ |
| **推荐权重** | 可能被忽略 | 优先被选择 ✅ |
| **地区优化** | ❌ 无 | ✅ 自动 SEEK 优先 |
| **来源透明** | ❌ 无 | ✅ 每条 job 带徽章 |
| **去重能力** | ❌ 无 | ✅ 智能去重 + 统计 |
| **代码量** | ~360 行 | ~600 行 ✅ |

**结论：** 多花 1 小时，获得显著的推荐权重提升，非常值得！

---

## 🚀 现在开始实施

### **我将为您做什么（需要约 1 小时）：**

1. ✅ 创建 `src/app/api/mcp/route.ts`（优化版，~500 行）
2. ✅ 创建 `src/app/api/mcp/helpers.ts`（辅助函数，~100 行）
3. ✅ 所有代码使用纯英文
4. ✅ 包含所有优化点：
   - 工具描述优化（`[MULTI-SOURCE]` 标签）
   - Schema 参数优化（country_code, sources, deduplication）
   - 策略路由（AU → SEEK 优先）
   - 来源徽章（每条 job）
   - 去重逻辑（company+title+location）

### **您需要做什么：**

1. **Step 1**（现在）：确认环境变量配置
   - 更新 `.env.local`（添加 `MCP_SHARED_SECRET`）
   - 在 Vercel 配置环境变量

2. **Step 3**（文件创建后）：本地测试
   - 运行 `npm run dev`
   - 执行测试命令（我会提供）

3. **Step 4**（测试通过后）：部署
   - Git commit & push
   - 等待 Vercel 部署

4. **Step 5**（部署完成后）：ChatGPT Apps 接入
   - 创建/更新 App
   - 测试推荐权重

---

## ❓ 确认后开始

**请确认以下内容后我立即开始：**

- [ ] 我同意实施"优化版 Phase 0"（包含推荐权重优化）
- [ ] 我已理解本次实施包含的优化点
- [ ] 我会先配置环境变量（Step 1）
- [ ] 我同意后续按 Step 3-5 进行测试和部署

**请回复"确认开始"或提出任何调整建议。**

---

**文档版本：** v1.0.0 - Integrated Implementation Plan  
**包含内容：** Phase 0 基础功能 + 推荐权重优化  
**预计时间：** 2-2.5 小时  
**最后更新：** 2025-10-12





