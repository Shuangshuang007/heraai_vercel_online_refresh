# AgentKit v2 部署后续步骤

## 🚀 立即执行（生产部署）

### 1. 推送代码并部署
```bash
# 提交当前更改
git add .
git commit -m "feat: Add AgentKit v2 with production-ready features"
git push origin main
```

### 2. 生产环境变量配置
在 Vercel/Railway/部署平台设置：
```
FEATURE_AGENTKIT_V2=true
AGENTKIT_TOKEN=6b161a1ed2e8d4a8c461489a00138134ec31a82ba9e90d27ae3abe4fa2602785
```

### 3. ChatGPT App 工具配置更新
将现有的工具定义从：
```json
{
  "method": "agentkit/plan"
}
```

更新为：
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

## 📊 验证步骤

### 1. 部署后验证
```bash
# 测试生产环境
curl -X POST "https://your-app.vercel.app/api/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jsonrpc":"2.0","method":"agentkit-v2/plan",...}'
```

### 2. ChatGPT App 测试
- 在 ChatGPT 中测试新的 AgentKit 功能
- 验证是否调用 v2 端点
- 检查响应时间和成功率

## 🔄 回滚准备
如果出现问题，立即设置：
```
FEATURE_AGENTKIT_V2=false
```

## 📈 监控和优化

### 1. 日志监控
关注以下指标：
- `time_to_first_recs_ms`: 响应时间
- `tool_failure_rate`: 失败率
- `exec_retry_count`: 重试次数

### 2. 性能对比
收集 v1 vs v2 的性能数据，包括：
- 平均响应时间
- 成功率
- 用户满意度

## 🎯 后续计划

### Phase 2 功能（可选）
1. **数据库持久化**: 保存执行记录到 MongoDB
2. **重试机制**: 自动重试失败的请求
3. **限流控制**: 防止API滥用
4. **A/B测试**: 正式对比 v1 和 v2 性能
