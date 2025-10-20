# AgentKit 缺失依赖分析报告

## 🔍 分析目标
判断是否需要恢复 `helpers.ts` 和 `profileDatabaseService.ts` 两个缺失文件

## 📋 搜索结果

### 1. helpers.ts 引用情况

**引用位置：**
- `src/app/api/mcp/route.ts:36` - 导入语句：
  ```typescript
  import {
    deduplicateJobs,
    enhanceJobsWithSources,
    generateSearchLinks,
    getSourceStrategy,
    validateSearchParams,
    formatSearchResponse,
    type Job,
    type SearchResponse,
    type SearchLink,
    type LinkGenerationArgs,
  } from './helpers';
  ```

**实际使用情况：**
- ✅ `enhanceJobsWithSources` - 第628行：`let processedJobs = enhanceJobsWithSources(jobs);`
- ✅ `deduplicateJobs` - 第629行：`processedJobs = deduplicateJobs(processedJobs);`
- ✅ `generateSearchLinks` - 第1801行：`const links: SearchLink[] = generateSearchLinks(linkArgs);`

**结论：helpers.ts 被积极使用，必须恢复**

### 2. profileDatabaseService.ts 引用情况

**引用位置：**
1. `src/app/api/mcp/route.ts:19` - 导入语句：
   ```typescript
   import { getUserProfile } from '../../../services/profileDatabaseService';
   ```

2. `src/lib/agentkit/mcp-tool-executor.ts:6` - 导入语句：
   ```typescript
   import { getUserProfile } from '../../services/profileDatabaseService';
   ```

**实际使用情况：**

1. **在 route.ts 中：**
   - ✅ 第1849行：`const profile = await withTimeout(getUserProfile(userEmail), 5000).catch(() => null);`
   - 这是真实调用，用于获取用户档案

2. **在 mcp-tool-executor.ts 中：**
   - ❌ 只有导入，没有实际调用 `getUserProfile()`
   - 这是一个**冗余导入**，可以安全移除

**结论：profileDatabaseService.ts 被部分使用，需要恢复**

## 🎯 恢复优先级

| 文件 | 优先级 | 原因 | 影响范围 |
|------|--------|------|----------|
| `src/app/api/mcp/helpers.ts` | 🔴 **必须恢复** | 被 MCP 路由直接调用，影响现有功能 | MCP 工具调用失败 |
| `src/services/profileDatabaseService.ts` | 🟡 **需要恢复** | 被 MCP 路由调用，但 AgentKit 中未使用 | 用户档案获取失败 |

## 🚨 当前状态
- AgentKit v2 方法**完全独立**，不使用这两个文件
- 现有 MCP 功能**依赖**这两个文件，导致服务器启动失败
- 这不是 AgentKit v2 的问题，是遗留依赖问题

## 💡 建议恢复的最小函数集

### helpers.ts 需要恢复的函数：
```typescript
export function deduplicateJobs(jobs: Job[]): Job[]
export function enhanceJobsWithSources(jobs: Job[]): Job[]
export function generateSearchLinks(args: LinkGenerationArgs): SearchLink[]
```

### profileDatabaseService.ts 需要恢复的函数：
```typescript
export async function getUserProfile(email: string): Promise<UserProfile | null>
```

## ✅ 最终结论
**这两个文件必须恢复**，因为它们被现有的 MCP 功能积极使用，不是废弃文件。恢复后：
1. 现有 MCP 功能将正常工作
2. AgentKit v2 功能保持独立运行
3. 服务器启动问题将解决



