# Cover Letter 功能说明

## 功能概述

在 Tailor Resume 弹窗中新增了 Generate Cover Letter 功能，用户可以：
1. 基于已定制的简历生成个性化的求职信
2. 实时编辑和预览Cover Letter内容
3. 下载Cover Letter为文本文件

## 功能特点

### 1. 智能生成
- **AI驱动**: 使用GPT-4生成专业的Cover Letter
- **个性化**: 基于用户的简历内容和职位要求
- **澳大利亚市场**: 针对澳大利亚求职市场优化

### 2. 交互体验
- **默认编辑模式**: 生成后直接进入编辑状态
- **实时预览**: 支持Edit/Preview模式切换
- **内容编辑**: 点击任何文本即可开始编辑

### 3. 功能按钮
- **Preview**: 切换到预览模式
- **Edit**: 切换到编辑模式
- **Download**: 下载为.txt文件

## 实现架构

### 1. API接口
```
POST /api/generate-cover-letter
```
**请求参数:**
- `resumeData`: 简历数据（包含summary、skills、experience等）
- `jobTitle`: 职位标题
- `company`: 公司名称
- `jobDescription`: 职位描述

**响应数据:**
- `coverLetter`: 生成的Cover Letter内容

### 2. 组件状态
```typescript
// Cover Letter 相关状态
const [showCoverLetter, setShowCoverLetter] = useState(false);
const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
const [coverLetterContent, setCoverLetterContent] = useState('');
const [isCoverLetterEditing, setIsCoverLetterEditing] = useState(true);
const [coverLetterPreviewKey, setCoverLetterPreviewKey] = useState(0);
```

### 3. 核心函数
- `generateCoverLetter()`: 调用API生成Cover Letter
- `downloadCoverLetter()`: 下载Cover Letter文件

## 使用流程

1. 用户在Tailor Resume弹窗中完成简历定制
2. 点击"Generate Cover Letter"按钮
3. 系统调用API生成个性化的Cover Letter
4. 显示Cover Letter编辑区域（默认Edit模式）
5. 用户可以编辑、预览或下载Cover Letter

## UI布局

```
Tailor Resume (标题)
[Preview] [Edit] [Download]

(Resume 内容 ...)

-------------------------------------
[ Generate Cover Letter ]  ← 按钮（和上面同级，独立一栏）

(点击后出现 Cover Letter 区域)

Cover Letter
[Preview] [Edit] [Download]

(Edit Mode: 默认可直接修改内容)
```

## 技术特点

### 1. 响应式设计
- 支持不同屏幕尺寸
- 移动端友好的交互

### 2. 状态管理
- 独立的Cover Letter状态
- 与Resume编辑状态分离

### 3. 错误处理
- API调用失败时的用户提示
- 加载状态的视觉反馈

### 4. 性能优化
- 按需生成Cover Letter
- 避免不必要的重复请求

## 注意事项

1. **依赖关系**: Cover Letter功能依赖于Tailor Resume弹窗
2. **数据来源**: 使用已定制的简历数据，确保内容一致性
3. **文件格式**: 目前支持.txt格式下载，后续可扩展为PDF
4. **内容长度**: 生成的Cover Letter控制在200-300字左右

## 后续扩展

1. **模板选择**: 支持多种Cover Letter模板
2. **PDF导出**: 支持Cover Letter的PDF格式导出
3. **历史记录**: 保存用户生成的Cover Letter历史
4. **多语言支持**: 支持中英文Cover Letter生成


