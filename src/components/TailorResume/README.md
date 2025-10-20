# Tailor Resume 预览功能

## 功能概述

在 Tailor Resume 生成流程中集成了预览功能，用户可以：
1. 查看关键词对齐后的简历预览
2. 看到缺失必要条件的提示
3. 确认后再生成最终的 PDF

## 实现特点

### 1. 关键词对齐
- **Summary**: 用 `met[]` 中的关键词替换简历对应的短语
- **Skills**: 先渲染匹配的技能，再渲染其他技能
- **Work Experience**: 前两条 bullet 应用关键词对齐

### 2. 顶部提示
- **绿色勾**: 所有要求都已满足
- **黄色警告**: 显示缺失的必要条件，提醒 ATS 可能拒绝

### 3. 数据来源
- 直接使用 Job List 中的 `keyRequirements`、`requirements`、`skills`
- 应用现有的标准化逻辑（`formatTag`、`filterKeyRequirements`）
- 与用户 Profile 进行智能比对

## 组件结构

```
TailorPreview.tsx          # 主要预览组件
├── 顶部提示区域           # 显示 met/missing 状态
├── 职位信息区域           # 显示 Job 基本信息
├── 简历预览区域           # 关键词对齐后的内容
│   ├── Professional Summary
│   ├── Skills (匹配技能优先)
│   ├── Work Experience (前两条 bullet 对齐)
│   └── Education
└── 操作按钮区域           # Cancel/Generate
```

## 使用流程

1. 用户点击 "Tailor Resume" 按钮
2. 系统检查 Working Rights
3. 显示预览界面，包含：
   - 关键词对齐后的简历内容
   - 匹配/缺失状态提示
4. 用户确认后点击 "Generate Tailor Resume"
5. 调用 API 生成 PDF 文件

## 技术实现

### 状态管理
```typescript
const [showTailorPreview, setShowTailorPreview] = useState(false);
const [tailorJob, setTailorJob] = useState<Job | null>(null);
```

### 关键词对齐逻辑
```typescript
const alignKeywords = (text: string, keywords: string[]): string => {
  // 用 JD 原词替换简历对应的短语
  // 只替换存在的短语
};
```

### 比对结果
```typescript
const { met, missing } = diffWithProfile(job, userProfile);
// met: 匹配的关键词
// missing: 缺失的关键词
```

## 样式设计

- **匹配技能**: 绿色背景 + 绿色边框 + ✓ 标记
- **其他技能**: 灰色背景 + 灰色边框
- **成功提示**: 绿色背景 + 绿色边框
- **警告提示**: 黄色背景 + 黄色边框

## 优势

1. **用户体验**: 生成前预览，避免意外结果
2. **关键词对齐**: 确保简历与 JD 要求一致
3. **智能提示**: 清晰显示匹配状态和缺失要求
4. **技术一致**: 复用现有的 Tag 系统逻辑
5. **英文界面**: 符合国际化要求

## 注意事项

- 所有 UI 文本都使用英文
- 不改动用户 Profile 数据
- 不添加额外的交互面板
- 保持与现有系统的兼容性
