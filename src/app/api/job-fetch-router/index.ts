import { NextRequest, NextResponse } from 'next/server';
import { PLATFORM_MAPPING } from '../../../constants/platformMapping';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle') || '';
  const city = searchParams.get('city') || '';
  const platform = searchParams.get('platform') || '';
  const limit = searchParams.get('limit') || '600';
  
  console.log(`[JobFetchRouter] Received request: jobTitle=${jobTitle}, city=${city}, platform=${platform}`);
  
  try {
    // 如果没有指定平台，查询所有平台
    if (!platform) {
      console.log('[JobFetchRouter] No platform specified, querying all platforms');
      return await queryAllPlatforms(jobTitle, city, limit);
    }
    
    // 检查平台是否支持
    if (!PLATFORM_MAPPING[platform as keyof typeof PLATFORM_MAPPING]) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      );
    }
    
    // 查询指定平台
    console.log(`[JobFetchRouter] Querying specific platform: ${platform}`);
    return await querySpecificPlatform(platform, jobTitle, city, limit);
    
  } catch (error: any) {
    console.error('[JobFetchRouter] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}

// 查询所有平台
async function queryAllPlatforms(jobTitle: string, city: string, limit: string) {
  const allJobs: any[] = [];
  const platformResults: Record<string, any[]> = {};
  
  // 并行查询所有平台
  const platformPromises = Object.keys(PLATFORM_MAPPING).map(async (platformKey) => {
    try {
      const result = await querySpecificPlatform(platformKey, jobTitle, city, limit);
      const data = await result.json();
      const jobs = data.jobs || [];
      
      console.log(`[JobFetchRouter] ${platformKey} returned ${jobs.length} jobs`);
      
      platformResults[platformKey] = jobs;
      allJobs.push(...jobs);
      
      return { platform: platformKey, jobs, error: null };
    } catch (error: any) {
      console.error(`[JobFetchRouter] Error fetching from ${platformKey}:`, error);
      return { platform: platformKey, jobs: [], error: error.message };
    }
  });
  
  await Promise.all(platformPromises);
  
  // 去重处理
  const jobMap = new Map();
  allJobs.forEach(job => {
    if (job.id && !jobMap.has(job.id)) {
      jobMap.set(job.id, job);
    }
  });
  
  const uniqueJobs = Array.from(jobMap.values());
  
  return NextResponse.json({
    jobs: uniqueJobs,
    analysis: {
      totalJobs: uniqueJobs.length,
      platformDistribution: Object.keys(platformResults).reduce((acc, platform) => {
        acc[platform] = platformResults[platform].length;
        return acc;
      }, {} as Record<string, number>),
      dataSource: 'realtime'
    }
  });
}

// 查询指定平台
async function querySpecificPlatform(platform: string, jobTitle: string, city: string, limit: string) {
  const platformUrl = `/api/job-fetch-router/${platform}?jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(city)}&limit=${limit}`;
  
  const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.VERCEL_URL : 'http://localhost:3002'}${platformUrl}`);
  
  if (!response.ok) {
    throw new Error(`${platform} API error: ${response.statusText}`);
  }
  
  return response;
} 