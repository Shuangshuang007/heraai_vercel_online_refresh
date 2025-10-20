# AgentKit Integration - 测试和验证指南

## 概述
AgentKit已成功集成到Hera AI的MCP系统中，提供智能规划、内存管理和工具执行能力。

## 集成组件

### 1. 核心模块
- **Planner** (`planner.ts`) - 基于现有`parseMessageWithGPT`的意图识别和计划生成
- **Memory** (`memory.ts`) - 会话上下文和状态管理
- **Executor** (`executor.ts`) - 计划执行和工具编排
- **Database** (`database.ts`) - 数据库操作和索引管理
- **MCPToolExecutor** (`mcp-tool-executor.ts`) - 调用现有MCP工具

### 2. 数据库支持
- **数据库**: `hera_jobs`
- **集合**: 
  - `agentkit_plans` - 执行计划存储
  - `agentkit_memory` - 会话内存存储

### 3. MCP API扩展
新增两个AgentKit方法：
- `agentkit/plan` - 生成执行计划
- `agentkit/execute` - 执行计划步骤

## 测试验证

### 1. 基础功能测试

#### 测试AgentKit Planning
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-1",
    "method": "agentkit/plan",
    "params": {
      "userMessage": "I want to find software engineer jobs in Sydney",
      "sessionId": "test-session-1",
      "userContext": {
        "history": [],
        "jobContext": null
      }
    }
  }'
```

#### 测试AgentKit Execution
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-2", 
    "method": "agentkit/execute",
    "params": {
      "planId": "PLAN_ID_FROM_PREVIOUS_RESPONSE",
      "stepId": "STEP_ID_FROM_PREVIOUS_RESPONSE"
    }
  }'
```

### 2. 集成验证点

#### ✅ MCP方法注册
- `agentkit/plan` 方法已添加到MCP路由
- `agentkit/execute` 方法已添加到MCP路由
- 使用正确的JSON-RPC 2.0格式

#### ✅ 数据库连接
- 使用现有`connectToMongoDB()`函数
- 在`hera_jobs`数据库中创建AgentKit集合
- 包含必要的索引优化

#### ✅ 工具执行
- `recommend_jobs`工具集成完成
- `search_jobs`工具集成完成
- 调用现有MCP工具逻辑

#### ✅ 错误处理
- 完整的try-catch错误处理
- 结构化错误响应
- 日志记录和跟踪

### 3. 预期响应格式

#### Planning响应
```json
{
  "jsonrpc": "2.0",
  "id": "test-1",
  "result": {
    "content": [{
      "type": "json",
      "data": {
        "content": {
          "planId": "uuid",
          "sessionId": "test-session-1",
          "steps": [
            {
              "stepId": "uuid",
              "toolName": "recommend_jobs",
              "args": {...},
              "priority": 1,
              "status": "pending"
            }
          ],
          "intent": {...},
          "createdAt": "2024-...",
          "status": "draft"
        }
      }
    }],
    "isError": false
  }
}
```

#### Execution响应
```json
{
  "jsonrpc": "2.0", 
  "id": "test-2",
  "result": {
    "content": [{
      "type": "json",
      "data": {
        "content": {
          "success": true,
          "stepId": "uuid",
          "toolName": "recommend_jobs",
          "result": {
            "recommendations": [...],
            "totalFound": 15,
            "searchCriteria": {...}
          }
        }
      }
    }],
    "isError": false
  }
}
```

## 使用流程

1. **Client** 发送 `agentkit/plan` 请求到 `/api/mcp`
2. **AgentKit Planner** 解析用户消息，生成执行计划
3. **Plan** 存储到 `agentkit_plans` 集合
4. **Client** 发送 `agentkit/execute` 请求执行计划步骤
5. **AgentKit Executor** 调用现有MCP工具执行任务
6. **Results** 返回给Client

## 监控和日志

所有AgentKit操作都有详细日志：
- `[AgentKit] Planning request:` - 规划请求日志
- `[AgentKitExecutor] Executing step:` - 步骤执行日志
- `[MCPToolExecutor]` - MCP工具执行日志

## 注意事项

1. 确保MongoDB连接正常
2. 验证环境变量`MONGODB_URI`设置
3. 检查现有MCP工具API可用性
4. 监控数据库索引性能

