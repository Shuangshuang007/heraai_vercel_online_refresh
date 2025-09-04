import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchJobs } from '../../../services/jobFetchService';
import { getLocationWeight } from '../../../utils/greaterAreaMap';

// 内存防抖存储
const debounceStore = new Map<string, { data: any; timestamp: number }>();
const DEBOUNCE_EXPIRY = 60 * 1000; // 1分钟防抖

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
});

// 防抖工具函数
function getDebounceKey(jobTitle: string, city: string): string {
  return `${jobTitle}:${city}`.toLowerCase();
}

function getDebouncedData(jobTitle: string, city: string): any | null {
  const key = getDebounceKey(jobTitle, city);
  const cached = debounceStore.get(key);
  
  if (cached) {
    const now = Date.now();
    if (now - cached.timestamp < DEBOUNCE_EXPIRY) {
      console.log(`[MirrorJobs] ✓ Using debounced data for ${jobTitle} in ${city} (within 1 minute)`);
      return cached.data;
    } else {
      // 超过1分钟，清除防抖数据
      debounceStore.delete(key);
    }
  }
  
  return null;
}

function setDebouncedData(jobTitle: string, city: string, data: any): void {
  const key = getDebounceKey(jobTitle, city);
  debounceStore.set(key, {
    data,
    timestamp: Date.now()
  });
  console.log(`[MirrorJobs] ✓ Data debounced for ${jobTitle} in ${city} (1 minute)`);
}

// 定义职位接口
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  jobType?: string;
  experience?: string;
  postedDate?: string;
  platform: string;
  url: string;
  tags?: string[];
  skills?: string[];
  source?: string;
  sourceType: string;
  summary: string;
  detailedSummary: string;
  matchScore: number | undefined;
  matchAnalysis: string;
  workMode?: string;
}

// GPT分析函数
async function analyzeJobWithGPT(job: Job): Promise<Job> {
  try {
    // 如果已经有summary，跳过分析
    if (job.summary && job.summary.length > 50) {
      return job;
    }

    const prompt = `Analyze this job posting and provide:
1. A concise summary (2-3 sentences)
2. A detailed summary (4-5 sentences)
3. A match score (0-100)
4. Match analysis (2-3 sentences)
5. A structured WORKMODE field (e.g., "2 Day Onsite", "Hybrid", "Fully Remote", etc.), based on both the raw WorkMode and the job description. If job description provides more detail, use that.

Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
RawWorkMode: ${job.workMode || 'Not specified'}
Description: ${job.description || 'No description provided'}

Format your response as:
SUMMARY:
[concise summary]

WORKMODE:
[structured work mode, e.g., "2 Day Onsite", "Hybrid", "Fully Remote"]

DETAILED_SUMMARY:
[detailed summary]

SCORE:
[number 0-100]

ANALYSIS:
[match analysis]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // 解析响应
    const workModeMatch = response.match(/WORKMODE:\s*([^\n]+)/i);
    const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=WORKMODE:|DETAILED_SUMMARY:|SCORE:|$)/);
    const detailedSummaryMatch = response.match(/DETAILED_SUMMARY:\s*([\s\S]*?)(?=SCORE:|ANALYSIS:|$)/);
    const scoreMatch = response.match(/SCORE:\s*(\d+)/);
    const analysisMatch = response.match(/ANALYSIS:\s*([\s\S]*?)(?=SUMMARY:|WORKMODE:|DETAILED_SUMMARY:|SCORE:|$)/);

    job.workMode = workModeMatch?.[1]?.trim() || job.workMode || '';
    job.summary = summaryMatch?.[1]?.trim() || `${job.title} position at ${job.company} in ${job.location}.`;
    job.detailedSummary = detailedSummaryMatch?.[1]?.trim() || job.description?.substring(0, 200) + '...' || '';
    
    // 计算基础Match Score
    const baseScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;
    
    // 应用位置权重（fringe区域乘以0.9）
    // 从URL参数或请求中获取city信息
    const city = (job as any).city || job.location?.split(',')[0]?.trim() || '';
    const locationWeight = getLocationWeight(job.location, city);
    job.matchScore = Math.round(baseScore * locationWeight);
    
    job.matchAnalysis = analysisMatch?.[1]?.trim() || 'Analysis completed.';

    return job;
  } catch (error) {
    console.error(`[GPT] Error analyzing job ${job.title}:`, error);
    // 提供基本的错误恢复，直接修改原对象
    job.summary = `${job.title || 'Unknown'} position at ${job.company || 'Unknown'} in ${job.location || 'Unknown'}.`;
    job.detailedSummary = job.description ? job.description.substring(0, 200) + '...' : '';
    job.matchScore = 60; // 设置默认值为 60
    job.matchAnalysis = 'Analysis unavailable due to processing error.';
    return job; // 返回修改后的原对象
  }
}

// POST方法：接收JobFetchService传入的数据并进行GPT分析
export async function POST(request: Request) {
  try {
    const { jobs, jobTitle, city, limit, page, isHotJob, platform } = await request.json();
    
    console.log(`[MirrorJobs] POST: Starting GPT analysis for ${jobs.length} jobs, IsHotJob: ${isHotJob}`);
    
    // 对职位进行GPT分析（保持所有原有功能）
    const analyzedJobs = await Promise.all(
      jobs.map((job: any) => {
        // 为每个job添加city信息
        const jobWithCity = { ...job, city };
        return analyzeJobWithGPT(jobWithCity);
      })
    );
    
    console.log(`[MirrorJobs] POST: Final stats: ${analyzedJobs.length} jobs, Source: ${isHotJob ? 'hot_jobs_database' : 'realtime'}`);
    
    // 保持原有的响应格式
    return NextResponse.json({
      jobs: analyzedJobs,
      total: analyzedJobs.length,
      page: page || 1,
      totalPages: Math.ceil(analyzedJobs.length / (limit || 100)),
      source: isHotJob ? 'hot_jobs_database' : 'realtime',
      isHotJob,
      analysis: {
        totalJobs: analyzedJobs.length,
        dataSource: isHotJob ? 'hot_jobs_database' : 'realtime'
      }
    });
    
  } catch (error: any) {
    console.error('[MirrorJobs] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze jobs', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle') || '';
  const city = searchParams.get('city') || '';
  const platform = searchParams.get('platform') || '';
  const limit = parseInt(searchParams.get('limit') || '600');
  const page = parseInt(searchParams.get('page') || '1');
  
  try {
    // 检查防抖数据（1分钟内）
    const debouncedData = getDebouncedData(jobTitle, city);
    if (debouncedData) {
      return NextResponse.json(debouncedData);
    }
    
    // 使用统一的job获取服务
    const result = await fetchJobs({
      jobTitle,
      city,
      limit,
      page,
      platform
    });
    
    console.log(`[MirrorJobs] GET: Starting GPT analysis for ${result.jobs.length} jobs`);
    
    // 对职位进行GPT分析，传递city信息
    const analyzedJobs = await Promise.all(
      result.jobs.map(job => {
        // 为每个job添加city信息
        const jobWithCity = { ...job, city };
        return analyzeJobWithGPT(jobWithCity);
      })
    );
    
    console.log(`[MirrorJobs] GET: Final stats: ${analyzedJobs.length} jobs, Source: ${result.source}, IsHotJob: ${result.isHotJob}`);
    
    const responseData = {
      jobs: analyzedJobs,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      source: result.source,
      isHotJob: result.isHotJob,
      analysis: result.analysis
    };
    
    // 设置防抖数据（1分钟）
    setDebouncedData(jobTitle, city, responseData);
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('[MirrorJobs] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
} 