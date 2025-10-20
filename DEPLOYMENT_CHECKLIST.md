# 🚀 AgentKit v2 部署检查清单

## ✅ 当前状态确认
- [x] AgentKit v2 代码已完成
- [x] 认证机制已验证 (`AGENTKIT_TOKEN`)
- [x] 构建成功 (`npm run build` 通过)
- [x] 本地测试通过

## 📋 部署前准备

### 1. 代码提交
```bash
# 查看更改
git status

# 提交所有更改
git add .
git commit -m "feat: Add AgentKit v2 with production security and monitoring

- 添加 agentkit-v2/plan 和 agentkit-v2/execute 端点
- 实现 AGENTKIT_TOKEN 认证机制
- 添加 FEATURE_AGENTKIT_V2 功能开关
- 实现生产级监控埋点 (time_to_first_recs_ms, tool_failure_rate, exec_retry_count)
- 添加参数校验和白名单控制
- 完善错误处理和回滚机制"

# 推送到远程
git push origin main
```

### 2. 生产环境配置
在 Vercel/Railway 等部署平台设置环境变量：
```
FEATURE_AGENTKIT_V2=true
AGENTKIT_TOKEN=6b161a1ed2e8d4a8c461489a00138134ec31a82ba9e90d27ae3abe4fa2602785
```

### 3. ChatGPT App 工具配置更新

**找到你的 ChatGPT App 配置文件**，将以下方法调用更新：

**原配置（v1）**:
```json
{
  "method": "agentkit/plan"
}
```

**新配置（v2）**:
```json
{
  "method": "agentkit-v2/plan",
  "headers": {
    "Authorization": "Bearer 6b161a1ed2e8d4a8c461489a00138134ec31a82ba9e90d27ae3abe4fa2602785",
    "Content-Type": "application/json"
  }
}
```

同样更新 `agentkit-v2/execute` 方法。

## 🧪 部署后验证

### 1. API 端点测试
```bash
curl -X POST "https://your-production-url/api/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 6b161a1ed2e8d4a8c461489a00138134ec31a82ba9e90d27ae3abe4fa2602785" \
  -d '{
    "jsonrpc": "2.0",
    "method": "agentkit-v2/plan",
    "params": {
      "userId": "test_user",
      "intent": {
        "primary": "find_jobs",
        "readiness": "ready",
        "blockers": [],
        "confidence": 0.9
      }
    },
    "id": 1
  }'
```

### 2. ChatGPT App 功能测试
- 打开 ChatGPT App
- 测试 AgentKit 相关功能
- 确认调用的是 v2 端点

## 🔄 回滚准备（紧急情况）

如果部署后出现问题，立即设置：
```
FEATURE_AGENTKIT_V2=false
```

这将禁用所有 v2 功能，系统会自动回退到 v1。

## 📊 监控指标

部署后关注这些日志指标：
- `[AgentKit V2] [METRICS]` - 执行性能指标
- `time_to_first_recs_ms` - 响应时间
- `tool_failure_rate` - 失败率
- `exec_retry_count` - 重试次数

## 🎯 后续优化计划

### Phase 2 功能（可选实施）
1. **数据库持久化**: 保存执行记录到 MongoDB
2. **自动重试机制**: 失败请求自动重试
3. **用户限流**: 防止 API 滥用
4. **A/B 测试**: 对比 v1 和 v2 性能
