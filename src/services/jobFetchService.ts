import { isHotJob } from '../constants/hotJobs';
import { PLATFORM_MAPPING } from '../constants/platformMapping';
import { queryHotJobsFromDatabase, queryJobsFromDatabase, transformMongoDBJobToFrontendFormat } from './jobDatabaseService';

// 直接调用 mirror-jobs 的分析函数
const analyzeJobsWithMirrorJobs = async (jobs: any[], params: any) => {
  // 直接调用 mirror-jobs 的分析逻辑，而不是通过 HTTP
  // 这里我们暂时返回原始数据，实际的 GPT 分析将在 mirror-jobs 中处理
  return {
    jobs,
    total: jobs.length,
    page: params.page || 1,
    totalPages: Math.ceil(jobs.length / 15), // 使用前端的 jobsPerPage
    source: params.isHotJob ? 'hot_jobs_database' : 'realtime',
    isHotJob: params.isHotJob || false,
    analysis: {
      message: 'Jobs ready for analysis by mirror-jobs'
    }
  };
};

// HotJobs部分：获取数据库数据并传给 mirror-jobs 进行 GPT 分析
const fetchJobsForHotJob = async (jobTitle: string, city: string, limit: number, page: number) => {
  console.log(`[JobFetchService] Getting Hot Jobs from database for ${jobTitle} in ${city}`);
  
  // MongoDB数据使用600作为上限
  const mongoDBLimit = Math.min(limit, 600);
  
  // 获取数据库中的职位数据
  const dbJobs = await queryHotJobsFromDatabase(jobTitle, city, mongoDBLimit);
  const transformedJobs = dbJobs
    .map(transformMongoDBJobToFrontendFormat)
    .filter(job => job !== null);
  
  console.log(`[JobFetchService] Found ${transformedJobs.length} Hot Jobs, sending to mirror-jobs`);
  
  // 传递职位数据到 mirror-jobs 进行 GPT 分析
  return await analyzeJobsWithMirrorJobs(transformedJobs, {
    jobTitle,
    city,
    limit: mongoDBLimit,
    page,
    isHotJob: true
  });
};

// 非HotJobs部分：获取平台数据并传给 mirror-jobs 进行分析
const fetchJobsForNonHotJob = async (jobTitle: string, city: string, limit: number, page: number, platform?: string) => {
  console.log(`[JobFetchService] Getting jobs from platforms for ${jobTitle} in ${city}`);
  
  // 平台数据使用100作为上限
  const platformLimit = Math.min(limit, 100);
  
  // 从平台获取职位数据
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  
  const apiUrl = `${baseUrl}/api/job-fetch-router?jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(city)}&limit=${platformLimit}&platform=${platform || ''}`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Job-fetch-router API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  console.log(`[JobFetchService] Found ${data.jobs.length} platform jobs, sending to mirror-jobs`);
  
  // 传递职位数据到 mirror-jobs 进行 GPT 分析
  return await analyzeJobsWithMirrorJobs(data.jobs, {
    jobTitle,
    city,
    limit: platformLimit,
    page,
    isHotJob: false,
    platform
  });
};

// 统一的job获取函数
export async function fetchJobs(params: {
  jobTitle: string;
  city: string;
  limit?: number;
  page?: number;
  platform?: string;
  userEmail?: string; // 新增用户邮箱参数
}): Promise<{
  jobs: any[];
  total: number;
  page: number;
  totalPages: number;
  source: string;
  isHotJob: boolean;
  analysis?: any;
  error?: string;
}> {
  const { jobTitle, city, limit = 600, page = 1, platform, userEmail } = params;
  
  try {
    // 记录Job Search到MongoDB（如果提供了用户邮箱）
    if (userEmail) {
      try {
        await fetch('/api/profile/record-job-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            jobTitle,
            location: city
          })
        });
        console.log(`[JobFetchService] Job search recorded for ${userEmail}: ${jobTitle} in ${city}`);
      } catch (recordError) {
        console.warn('[JobFetchService] Failed to record job search:', recordError);
        // 不影响主要功能，只记录警告
      }
    }
    // 判断是否为Hot Job
    const isHotJobRequest = isHotJob(jobTitle, city);
    console.log(`[JobFetchService] Job: ${jobTitle}, City: ${city}, IsHotJob: ${isHotJobRequest}`);
    
    if (isHotJobRequest) {
      // 如果是 HotJob，从数据库获取数据并传递给 mirror-jobs 进行 GPT 分析
      return await fetchJobsForHotJob(jobTitle, city, limit, page);
    } else {
      // 如果是非 HotJob，从平台抓取数据并传递给 mirror-jobs 进行 GPT 分析
      return await fetchJobsForNonHotJob(jobTitle, city, limit, page, platform);
    }
    
  } catch (error: any) {
    console.error('[JobFetchService] Error:', error);
    return {
      jobs: [],
      total: 0,
      page,
      totalPages: 0,
      source: 'error',
      isHotJob: false,
      error: error.message || 'Unknown error'
    };
  }
}

// 从MongoDB获取所有可用职位（用于调试或管理）
export async function getAllJobsFromDatabase(limit: number = 100): Promise<any[]> {
  try {
    const dbJobs = await queryJobsFromDatabase('', '', limit);
    return dbJobs.map(transformMongoDBJobToFrontendFormat).filter(job => job !== null);
  } catch (error: any) {
    console.error('[JobFetchService] Error getting all jobs:', error);
    return [];
  }
} 