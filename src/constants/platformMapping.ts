/**
 * 平台分发配置
 * 统一管理所有平台的API路由映射
 */

import { HOT_JOBS_CONFIG, isHotJob, getHotJobsQuery } from './hotJobs';

// 平台API路由映射
export const PLATFORM_API_MAPPING = {
  'linkedin': '/api/job-fetch-router/linkedin',
  'seek': '/api/job-fetch-router/seek',
  'jora': '/api/job-fetch-router/jora',
  'adzuna': '/api/job-fetch-router/adzuna',
  'hatch': '/api/job-fetch-router/hatch',
  'hotjobs': '/api/mirror-jobs', // 统一命名为 hotjobs
} as const;

// 为了兼容性，添加PLATFORM_MAPPING别名
export const PLATFORM_MAPPING = PLATFORM_API_MAPPING;

// 平台类型定义
export type PlatformType = keyof typeof PLATFORM_API_MAPPING;

// 重新导出 Hot Jobs 配置和函数
export { HOT_JOBS_CONFIG, isHotJob, getHotJobsQuery };

// 获取平台API路由
export function getPlatformApiRoute(platform: string): string {
  const normalizedPlatform = platform.toLowerCase() as PlatformType;
  return PLATFORM_API_MAPPING[normalizedPlatform] || PLATFORM_API_MAPPING.hotjobs;
}

// 获取所有可用平台
export function getAvailablePlatforms(): PlatformType[] {
  return Object.keys(PLATFORM_API_MAPPING) as PlatformType[];
}

// 检查平台是否有效
export function isValidPlatform(platform: string): boolean {
  return platform.toLowerCase() in PLATFORM_API_MAPPING;
}

// 平台优先级配置（用于多平台并发时的顺序）
export const PLATFORM_PRIORITY = [
  'linkedin',
  'seek', 
  'jora',
  'adzuna',
  'hatch',
  'hotjobs'
] as const;

// 获取按优先级排序的平台列表
export function getPlatformsByPriority(): PlatformType[] {
  return PLATFORM_PRIORITY.filter(platform => 
    platform in PLATFORM_API_MAPPING
  ) as PlatformType[];
}

// 获取Hot Jobs API路由
export function getHotJobsApiRoute(): string {
  return PLATFORM_API_MAPPING.hotjobs;
} 