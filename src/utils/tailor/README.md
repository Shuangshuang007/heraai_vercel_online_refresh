# Tailor Resume Requirements Analysis

## 功能概述

`diffWithProfile` 函数用于在 Tailor Resume 流程中静默比对 JD 必要条件和用户 Profile，生成匹配和缺失的关键词列表。

## 设计理念

**直接利用 Job List 中已有的 requirements 数据**，而不是重新从 Profile 中提取关键词。这样更准确、更高效，与现有的 Tag 系统保持一致。

## 数据优先级

1. **`job.keyRequirements`** - 主要数据源（已经过标准化处理）
2. **`job.requirements`** - 备选数据源
3. **`job.skills`** - 技能数据

## 函数签名

```typescript
export function diffWithProfile(job: Job, profile: PersonalInfo) {
  // 返回 { met: string[], missing: string[] }
}
```

## 使用方式

```typescript
import { diffWithProfile } from '@/utils/tailor/diffWithProfile';

// 在 Tailor Resume handler 中
const { met, missing } = diffWithProfile(job, userProfile);

console.log('匹配的要求:', met);
console.log('缺失的要求:', missing);
```

## 比对逻辑

1. **完全匹配**: 检查 Profile 中是否包含完全相同的关键词
2. **部分匹配**: 检查 Profile 中是否包含部分匹配的关键词（包含关系）
3. **大小写不敏感**: 自动转换为小写进行比对

## 从 Profile 中提取的关键词来源

- 技能 (skills)
- 工作经验 (employment)
- 教育背景 (education)
- 个人简介 (about)
- 职业头衔 (jobTitle)
- 专业简介 (shortBio)

## 优势

1. **利用现有数据**: 直接使用 Job 中已经提取和标准化的 requirements
2. **与 Tag 系统一致**: 使用相同的数据源和优先级逻辑
3. **高效比对**: 不需要重新处理 Job 数据
4. **准确结果**: 基于已经过滤和标准化的 requirements

## 测试

运行测试文件验证功能：

```bash
npm test src/utils/tailor/diffWithProfile.test.ts
```

## 示例输出

```typescript
// 控制台输出示例
JD Requirements Analysis: {
  met: ['JavaScript', 'React', 'Python'],
  missing: ['AWS', 'Docker'],
  total: 5,
  jobRequirements: {
    keyRequirements: ['JavaScript', 'React', 'Python', 'AWS'],
    requirements: [],
    skills: ['Docker', 'Kubernetes']
  }
}
```
