# AgentKit v2 部署和测试指南

## 🎯 你要做的具体步骤

### **步骤 1: 本地测试验证**

```bash
# 1. 启动开发服务器
cd heraai_rebuild_public_v1
npm run dev

# 2. 在另一个终端运行快速测试
./scripts/agentkit/quick_test_setup.sh
```

### **步骤 2: 生产部署配置**

在部署平台（如 Vercel/Railway）设置环境变量：

```bash
FEATURE_AGENTKIT_V2=true
AGENTKIT_TOKEN=your_secure_production_token_here
```

### **步骤 3: ChatGPT App 集成**

修改你的 ChatGPT App 的工具定义文件，将：

**原来的工具调用**：
```json
{
  "method": "agentkit/plan"
}
```

**改为**：
```json
{
  "method": "agentkit-v2/plan",
  "headers": {
    "Authorization": "Bearer your_secure_production_token_here"
  }
}
```

同样，将 `agentkit/execute` 改为 `agentkit-v2/execute`。

### **步骤 4: 验证部署**

部署后，你可以：

1. **直接测试 API 端点**（如果知道URL）:
```bash
curl -X POST "https://your-app.vercel.app/api/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{
    "jsonrpc": "2.0",
    "method": "agentkit-v2/plan",
    "params": {
      "userId": "test",
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

2. **在 ChatGPT 中测试**：
   - 打开你的 ChatGPT App
   - 尝试使用 AgentKit 功能
   - 如果配置正确，应该会调用新的 v2 端点

## 🚨 重要注意事项

### **环境变量必须设置**
- `FEATURE_AGENTKIT_V2=true` - 启用 v2 功能
- `AGENTKIT_TOKEN=xxx` - API 认证令牌

### **ChatGPT App 工具定义**
- 必须添加 `Authorization` 头
- 方法名改为 `agentkit-v2/plan` 和 `agentkit-v2/execute`

### **回滚机制**
如果出问题，设置 `FEATURE_AGENTKIT_V2=false` 即可禁用 v2，回到 v1。

## 🔍 故障排除

**如果看到 "AgentKit v2 is currently disabled"**：
- 检查 `FEATURE_AGENTKIT_V2` 环境变量是否设置为 `true`

**如果看到 "Unauthorized"**：
- 检查 `AGENTKIT_TOKEN` 环境变量是否设置
- 检查 ChatGPT App 是否正确发送 Authorization 头

**如果想测试但不部署**：
- 本地运行 `./scripts/agentkit/quick_test_setup.sh`
- 或者直接修改代码中的环境变量检查逻辑



