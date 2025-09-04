# Zamzar API 设置指南

## 概述
Zamzar API 用于将各种文档格式转换为PDF，以支持简历解析功能。

## 支持的格式
Zamzar支持**1200+种格式**，包括：
- **DOC** → PDF
- **DOCX** → PDF  
- **Pages** → PDF
- **RTF** → PDF
- **TXT** → PDF
- **ODT** → PDF
- **WPS** → PDF
- **WPD** → PDF
- **ABW** → PDF
- **FODT** → PDF
- **SXW** → PDF
- **UOT** → PDF
- **XML** → PDF
- **HTML** → PDF
- **HTM** → PDF
- **MHT** → PDF
- **MHTML** → PDF

## 设置步骤

### 1. 注册Zamzar账户
1. 访问 [Zamzar官网](https://www.zamzar.com/)
2. 注册免费账户
3. 登录后进入API设置页面

### 2. 获取API密钥
1. 在Zamzar账户中找到API设置
2. 生成新的API密钥
3. 复制API密钥

### 3. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```env
# 现有配置
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MONGODB_URI=your_mongodb_uri_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3002

# 新增Zamzar配置
ZAMZAR_API_KEY=your_zamzar_api_key_here
```

### 4. 验证配置
重启开发服务器后，系统会自动检测Zamzar API是否可用：
- 如果配置正确，会显示 "Zamzar API available"
- 如果未配置，会显示 "Zamzar API not available"

## 定价
- **免费计划**: 100次转换/月
- **付费计划**: $15/月 = 2500次转换
- **按需付费**: $0.05/次转换

## 使用建议
1. **开发环境**: 使用免费计划即可
2. **生产环境**: 根据预期使用量选择合适的付费计划
3. **监控使用量**: 定期检查API使用情况

## 故障排除

### API密钥无效
```
Error: Upload failed: 401 - Unauthorized
```
**解决方案**: 检查API密钥是否正确配置

### 格式不支持
```
Error: Format doc is not supported for conversion to PDF
```
**解决方案**: 检查文件格式是否在支持列表中

### 转换超时
```
Error: Conversion timeout
```
**解决方案**: 检查网络连接，稍后重试

## 技术细节

### API调用流程
1. **上传文件** → Zamzar服务器
2. **创建转换任务** → 指定源格式和目标格式
3. **轮询转换状态** → 等待转换完成
4. **下载转换结果** → 获取PDF文件

### 错误处理
- 网络错误自动重试
- 转换失败提供详细错误信息
- API不可用时回退到本地解析

### 性能优化
- 转换状态轮询间隔: 2秒
- 最大等待时间: 60秒
- 文件大小限制: 100MB 