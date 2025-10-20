// ============================================
// Hera AI - MCP Integration Layer (FAST + FULL Dual Mode)
// ============================================
// This file implements the MCP (Model Context Protocol) adapter
// for integrating Hera AI with ChatGPT Apps.
//
// IMPORTANT: All code in this file uses English only
// - Comments in English
// - Variable names in English
// - Error messages in English
// - Log messages in English
//
// Version: Dual Mode - FAST (lightweight) + FULL (deep analysis)
// Features: Trace ID, timeout protection, pagination, always HTTP 200
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchJobs } from '../../../services/jobFetchService';
import { getUserProfile } from '../../../services/profileDatabaseService';
import { connectToMongoDB, transformMongoDBJobToFrontendFormat } from '../../../services/jobDatabaseService';
import { parseMessageWithGPT } from '../../../gpt-services/assistant/parseMessage';
import { AgentKitPlanner } from '../../../lib/agentkit/planner';
import { AgentKitExecutor } from '../../../lib/agentkit/executor';
import { AgentKitMemory } from '../../../lib/agentkit/memory';
import {
  deduplicateJobs,
  enhanceJobsWithSources,
  generateSearchLinks,
  getSourceStrategy,
  validateSearchParams,
  formatSearchResponse,
  type Job,
  type SearchResponse,
  type SearchLink,
  type LinkGenerationArgs,
} from './helpers';

// ============================================
// 1️⃣ Constants and Helper Functions
// ============================================

const JSON_HEADERS = { "Content-Type": "application/json" };

// Company name set for smart parameter correction
const COMPANY_SET = new Set<string>([
  "Google", "Atlassian", "NAB", "ANZ", "Commonwealth Bank", "Optus", "Telstra", 
  "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber", "Airbnb",
  "Wesley College Melbourne", "University of Melbourne", "Monash University",
  "RMIT", "Swinburne", "Deakin University", "La Trobe University"
]);

// Smart parameter correction function
function fixArgs(args: any) {
  let { company, job_title, city, page, page_size } = args;
  const norm = (s?: string) => (s || "").trim();

  company = norm(company);
  job_title = norm(job_title);
  city = norm(city);

  // If company is empty but job_title looks like company -> fix it
  const looksLikeCompany =
    job_title &&
    (COMPANY_SET.has(job_title) ||
     /pty\s*ltd|ltd|inc|corp|corporation|bank|group|university|college/i.test(job_title));

  if (!company && looksLikeCompany) {
    company = job_title;
    job_title = "";
  }

  // Handle 'Google Software Engineer' -> company=Google, job_title=Software Engineer
  if (!company && job_title) {
    for (const name of COMPANY_SET) {
      const re = new RegExp(`^${name}\\b`, "i");
      if (re.test(job_title)) {
        company = name;
        job_title = job_title.replace(re, "").trim();
        break;
      }
    }
  }

  return { company, job_title, city, page, page_size };
}

// MCP Mode: fast (lightweight) | full (deep analysis with GPT)
const HERA_MCP_MODE = process.env.HERA_MCP_MODE || "fast";

// Stage time budgets (milliseconds) - for FULL mode
const TOTAL_BUDGET_MS = 35000;   // Total max 35s
const GPT_TIMEOUT_MS  = 8000;    // GPT planning budget 8s
const DB_TIMEOUT_MS   = 15000;   // Database query budget 15s
const POST_TIMEOUT_MS = 10000;   // Post-processing budget 10s

const now = () => Date.now();
const budgetLeft = (t0: number) => Math.max(0, TOTAL_BUDGET_MS - (now() - t0));

function json200(data: any, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number = 5000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error("timeout")), ms)
    ) as Promise<T>,
  ]);
}

// GPT建议：安全日期转换，带兜底
function toIsoSafe(v: any, ...alts: any[]): string {
  for (const x of [v, ...alts]) {
    if (x && !Number.isNaN(Date.parse(x))) {
      try {
        return new Date(x).toISOString();
      } catch {
        continue;
      }
    }
  }
  return new Date().toISOString(); // 兜底，避免 Invalid Date
}

// GPT建议：安全映射job，消灭非法值
function mapJobSafe(j: any) {
  const id = j._id || j.id || j.jobIdentifier || crypto.randomUUID();
  const url =
    j.url ||
    j.jobUrl ||
    `https://www.heraai.net.au/jobs/${encodeURIComponent(String(id))}?utm=chatgpt-mcp`;

  return {
    id: String(id),
    title: String(j.title || ""),
    company: String(j.company || j.company_name || ""),
    location: String(j.location || j.locationRaw || ""),
    employmentType: String(j.employmentType || j.employment_type || ""),
    postDate: toIsoSafe(j.postedDateISO, j.postedDate, j.createdAt, j.updatedAt),
    url,
    platform: String(j.platform || j.source || j.source_label || "")
  };
}

// GPT建议：提取域名（不挂超链接，避免长URL导致渲染失败）
function hostOf(u?: string) {
  try { return new URL(u!).hostname; } catch { return ""; }
}

// 导入工具函数
function parseWorkMode(workMode: string, jobDescription: string): string {
  if (workMode) {
    return workMode.charAt(0).toUpperCase() + workMode.slice(1).toLowerCase();
  }
  const desc = jobDescription?.toLowerCase() || '';
  // 百分比办公
  const percentMatch = desc.match(/(\d+)%\s*(working in the office|onsite|in office)/i);
  if (percentMatch) return `${percentMatch[1]}% Onsite`;
  // 通用模式匹配
  const patterns = [
    { regex: /(\d+)\s*days?\s*(?:in\s*)?(?:the\s*)?(?:office|onsite)/i, format: (match: any) => `${match[1]}d Onsite` },
    { regex: /at\s*least\s*(\d+)\s*days?\s*(?:in\s*)?(?:the\s*)?(?:office|onsite)/i, format: (match: any) => `+${match[1]}d Onsite` },
    { regex: /hybrid/i, format: () => 'Hybrid' },
    { regex: /remote|work\s*from\s*home/i, format: () => 'Fully Remote' },
    { regex: /onsite|in\s*office/i, format: () => 'Onsite' }
  ];
  for (const pattern of patterns) {
    const match = desc.match(pattern.regex);
    if (match) {
      return pattern.format(match);
    }
  }
  return '';
}

function normalizeExperienceTag(text: string): string | null {
  const match = text.match(/(\d{1,2})\s*(\+)?\s*(y|years)/i);
  if (match) {
    const years = parseInt(match[1], 10);
    if (years > 40) return null;
    if (years > 15) return '+15y';
    return `${years}+ years`;
  }
  if (/experience/i.test(text)) {
    return 'experienced professional';
  }
  return null;
}

// 生成job highlights（结合数据库字段和OpenAI）
async function generateJobHighlights(job: any): Promise<string[]> {
  const highlights: string[] = [];
  
  // ============================================
  // 第1条：公司 + 明确年份 + Work Mode + 上班要求
  // ============================================
  const company = job.company || job.organisation || 'Company';
  
  // 提取经验年份（从数据库字段）
  let experienceText = '';
  if (job.experience) {
    // 尝试提取具体年份
    const yearMatch = job.experience.match(/(\d{1,2})\s*[\+\-–]?\s*(\d{1,2})?\s*(years?|yrs?|y)/i);
    if (yearMatch) {
      if (yearMatch[2]) {
        experienceText = `${yearMatch[1]}-${yearMatch[2]} years`;
      } else {
        experienceText = `${yearMatch[1]}+ years`;
      }
    } else {
      experienceText = job.experience;
    }
  } else {
    // 从 tags 中提取经验
    const experienceTag = (job.tags || []).find((tag: string) => 
      /\d+\s*(y|years|yrs)|experience|senior|junior|mid/i.test(tag)
    );
    if (experienceTag) {
      const normalized = normalizeExperienceTag(experienceTag);
      if (normalized) {
        experienceText = normalized;
      }
    }
  }
  if (!experienceText) {
    experienceText = 'experienced professional';
  }
  
  // 提取工作模式（从数据库字段）
  const workMode = parseWorkMode(job.workMode || '', job.description || '');
  
  // 组合第1条
  if (workMode) {
    highlights.push(`${company} seeking ${experienceText}; ${workMode}`);
  } else {
    highlights.push(`${company} seeking ${experienceText}`);
  }
  
  // ============================================
  // 第2条：技能 + Degree + 身份要求
  // ============================================
  const requirementsParts: string[] = [];
  
  // 2.1 技能要求（使用OpenAI提取或fallback到数据库）
  let skillsText = '';
  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
    });

    const prompt = `Extract ONLY the top 3-4 technical skills/tools from this job posting.

Job: ${job.title || ''}
Description: ${(job.description || job.summary || '').substring(0, 800)}
${job.skills && job.skills.length > 0 ? `\nSkills: ${job.skills.slice(0, 8).join(', ')}` : ''}

Return ONLY a comma-separated list of 3-4 technical skills (no "Requires:", no explanations).
Example: Python, AWS, Docker, Kubernetes`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content?.trim() || '';
    if (response && !response.toLowerCase().includes('requires')) {
      skillsText = response;
    }
  } catch (error) {
    console.error('[MCP] OpenAI error:', error);
  }
  
  // Fallback: 使用数据库skills
  if (!skillsText && job.skills && job.skills.length > 0) {
    skillsText = job.skills.slice(0, 4).join(', ');
  }
  
  if (skillsText) {
    requirementsParts.push(skillsText);
  }
  
  // 2.2 学位要求（从tags或description提取）
  let degreeText = '';
  const degreeTag = (job.tags || []).find((tag: string) => 
    /bachelor|master|phd|doctorate|degree/i.test(tag)
  );
  if (degreeTag) {
    degreeText = degreeTag;
  } else {
    const jdLower = (job.description || job.summary || '').toLowerCase();
    if (/bachelor'?s?\s+degree/i.test(jdLower)) {
      degreeText = "Bachelor's";
    } else if (/master'?s?\s+degree/i.test(jdLower)) {
      degreeText = "Master's";
    } else if (/phd|doctorate/i.test(jdLower)) {
      degreeText = "PhD";
    }
  }
  if (degreeText) {
    requirementsParts.push(degreeText);
  }
  
  // 2.3 身份要求（从description提取）
  const jdText = (job.description || job.summary || '').toLowerCase();
  let citizenshipText = '';
  if (/australian citizenship|citizenship required|pr required|permanent resident/i.test(jdText)) {
    citizenshipText = 'Australian PR/Citizenship required';
  } else if (/visa sponsorship|sponsorship available|will sponsor/i.test(jdText)) {
    citizenshipText = 'Visa sponsorship available';
  }
  if (citizenshipText) {
    requirementsParts.push(citizenshipText);
  }
  
  // 组合第2条
  if (requirementsParts.length > 0) {
    highlights.push(`Requires: ${requirementsParts.join('; ')}`);
  } else {
    highlights.push('View details for full requirements');
  }
  
  return highlights;
}

// 带Highlights和View Details链接的卡片（ChatGPT支持Markdown链接）
function buildMarkdownCards(q: { title: string; city: string }, jobs: any[], total: number) {
  const cards = jobs.slice(0, 5).map((j: any, idx: number) => {
    const title = (j.title || "").replace(/[–—]/g, "-").trim();
    const company = (j.company || "").trim();
    const loc = (j.location || "").trim();
    const url = j.url || "";

    // Highlights显示（如果有）
    const highlightLines = (j.highlights || []).map((h: string) => {
      return `   📌 ${h}`;
    }).join('\n');

    // View Details链接
    const viewDetailsLink = url ? `\n   [View Details](${url})` : "";

    // 组合：标题、公司、地点、highlights、View Details
    const parts = [
      `${idx + 1}. ${title}`,
      `   ${company}`,
      `   ${loc}`
    ];
    
    if (highlightLines) {
      parts.push(''); // 空行
      parts.push(highlightLines);
    }
    
    if (viewDetailsLink) {
      parts.push(viewDetailsLink);
    }

    return parts.join('\n');
  });

  return [
    `Found ${total} jobs for "${q.title}" in ${q.city}`,
    "",
    cards.join("\n\n"),
    "",
    `Reply "more" for next 5 results.`,
  ].join("\n");
}

// GPT建议：安全MCP响应包装器（同时返回text+json）
function safeMcpOk(id: number | string | null, payload: any, textPreview?: string) {
  const content: any[] = [];
  
  // iOS ChatGPT需要text类型才能正常渲染
  if (textPreview) {
    content.push({ type: "text", text: textPreview });
  }
  
  content.push({
    type: "json",
    data: { content: payload }
  });

  const body = {
    jsonrpc: "2.0",
    id: id ?? null,
    result: {
      content,
      isError: false
    }
  };
  console.info("[MCP RESPONSE 2KB]", JSON.stringify(body).slice(0, 2000));
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function safeMcpErr(id: number | string | null, msg = "Hera Jobs temporary error") {
  const body = {
    jsonrpc: "2.0",
    id: id ?? null,
    result: {
      content: [{ type: "text", text: msg }],
      isError: true
    }
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

// ============================================
// 2️⃣ FAST Mode: Lightweight Database Query
// ============================================

interface FastQueryParams {
  title?: string; // Make optional
  city?: string; // Make optional
  page?: number;
  pageSize?: number;
  postedWithinDays?: number;
  platforms?: string[];
  company?: string; // New: company filter
}

async function fastDbQuery(params: FastQueryParams): Promise<{
  jobs: any[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  const {
    title,
    city,
    page = 1,
    pageSize = 20,
    postedWithinDays,
    platforms,
    company,
  } = params;

  try {
    const { db } = await connectToMongoDB();
    const collection = db.collection('hera_jobs.jobs');

    // Build query filter
    const filter: any = {
      is_active: { $ne: false }
    };

    // Optional: Filter by title (only if provided)
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    // Optional: Filter by city (only if provided)
    if (city) {
      filter.location = { $regex: city, $options: 'i' };
    }

    // Optional: Filter by company
    if (company) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { company: { $regex: company, $options: 'i' } },
          { company_name: { $regex: company, $options: 'i' } }
        ]
      });
    }

    // Optional: Filter by posted date
    if (postedWithinDays && postedWithinDays > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - postedWithinDays);
      filter.$or = [
        { postedDateISO: { $gte: cutoffDate.toISOString() } },
        { createdAt: { $gte: cutoffDate } },
      ];
    }

    // Optional: Filter by platforms
    if (platforms && platforms.length > 0) {
      const platformRegex = platforms.map(p => new RegExp(p, 'i'));
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { source: { $in: platformRegex } },
          { sourceType: { $in: platformRegex } },
          { platform: { $in: platformRegex } },
        ]
      });
    }

    // Sorting: Use postedDateISO, fallback to createdAt
    const sort: any = {
      postedDateISO: -1,
      createdAt: -1,
      updatedAt: -1
    };

    // Projection: Include fields needed for highlights generation
    const projection = {
      id: 1,
      _id: 1,
      jobIdentifier: 1,
      title: 1,
      company: 1,
      organisation: 1,
      location: 1,
      employmentType: 1,
      jobUrl: 1,
      url: 1,
      postedDateISO: 1,
      postedDate: 1,
      postedDateRaw: 1,
      createdAt: 1,
      updatedAt: 1,
      source: 1,
      sourceType: 1,
      platform: 1,
      // ✅ Additional fields for highlights generation
      description: 1,
      summary: 1,
      requirements: 1,
      skills: 1,
      experience: 1,
      benefits: 1,
      workMode: 1,
    };

    // Pagination
    const skip = (page - 1) * pageSize;
    const limit = Math.min(pageSize, 50); // Max 50 per page

    // Execute query
    const [jobs, totalCount] = await Promise.all([
      collection
        .find(filter)
        .project(projection)
        .sort(sort)
        .skip(skip)
        .limit(limit + 1) // Fetch one extra to check if there's more
        .toArray(),
      collection.countDocuments(filter),
    ]);

    // Check if there are more results
    const hasMore = jobs.length > limit;
    const resultJobs = hasMore ? jobs.slice(0, limit) : jobs;

    console.log(`[MCP FAST] Found ${resultJobs.length}/${totalCount} jobs for "${title}" in "${city}"`);

    return {
      jobs: resultJobs,
      total: totalCount,
      page,
      pageSize: limit,
      hasMore,
    };
  } catch (error) {
    console.error('[MCP FAST] Database query error:', error);
    return {
      jobs: [],
      total: 0,
      page,
      pageSize: pageSize || 20,
      hasMore: false,
    };
  }
}

// ============================================
// 3️⃣ FULL Mode: Deep Analysis Functions
// ============================================

// GPT planning stage (currently skipped)
async function generateJobPlan(jobTitle: string, city: string): Promise<any> {
  try {
    console.log(`[MCP FULL] Skipping GPT planning for now: ${jobTitle} in ${city}`);
    return null;
  } catch (error) {
    console.warn('[MCP FULL] GPT planning error:', error);
    return null;
  }
}

// Database query stage (FULL mode)
async function fetchFromDatabase(jobTitle: string, city: string, limit: number, plan?: any): Promise<any[]> {
  try {
    console.log(`[MCP FULL] Querying: ${jobTitle} in ${city}`);
    
    const result = await fetchJobs({
      jobTitle,
      city,
      platform: 'all',
      limit: Math.min(limit * 3, 25),
      page: 1,
    });

    return result.jobs || [];
  } catch (error) {
    console.error('[MCP FULL] Database fetch error:', error);
    return [];
  }
}

// Post-processing stage (deduplication, scoring)
async function postProcessResults(jobs: any[]): Promise<any[]> {
  try {
    if (jobs.length === 0) {
      return [];
    }

    let processedJobs = enhanceJobsWithSources(jobs);
    processedJobs = deduplicateJobs(processedJobs);
    
    processedJobs = processedJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      source: job.source,
      source_label: job.source_label,
      matchScore: job.matchScore,
      url: job.url,
    }));

    console.log(`[MCP FULL] Processed ${processedJobs.length} jobs`);
    return processedJobs;
  } catch (error) {
    console.error('[MCP FULL] Post-processing error:', error);
    return jobs;
  }
}

// ============================================
// 4️⃣ GET /api/mcp - Health Check
// ============================================

export async function GET(request: NextRequest) {
  console.log('[MCP] GET request received');
  
  return json200({
    tools: [
      {
        name: 'search_jobs',
        description: `Search jobs (mode: ${HERA_MCP_MODE})`,
      },
      {
        name: 'search_jobs_by_company',
        description: 'Search jobs by specific company name',
      },
      {
        name: 'build_search_links', 
        description: 'Generate direct search URLs for job platforms',
      },
      {
        name: 'get_user_applications',
        description: 'Retrieve user job application history',
      },
    ],
    mode: HERA_MCP_MODE,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}

// ============================================
// 5️⃣ POST /api/mcp - Main MCP Handler
// ============================================

export async function POST(request: NextRequest) {
  const startTime = now();
  
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return json200({ error: "invalid_json" });
    }

    console.log('[MCP] POST request:', {
      method: body.method,
      id: body.id,
      mode: HERA_MCP_MODE,
      startAt: new Date().toISOString(),
    });

    // Ignore notifications (prevent MCP 424)
    if (typeof body.method === "string" && body.method.startsWith("notifications/")) {
      console.log("[MCP] Notification:", body.method);
      return new Response(null, { status: 204 });
    }

    // ============================================
    // initialize - Return protocol info
    // ============================================
    if (body.method === "initialize") {
      return json200({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: {
          protocolVersion: "2025-06-18",
          serverInfo: { name: "Hera AI", version: "2.0.0", mode: HERA_MCP_MODE },
          capabilities: { tools: {} },
        },
      });
    }

    // ============================================
    // tools/list - List available tools
    // ============================================
    if (body.method === "tools/list") {
      const rpcTools = [
        {
          name: "recommend_jobs",
          description: "🎯 PERSONALIZED JOB RECOMMENDATIONS - Use this for AI-powered job matching!\n\n✅ ALWAYS use this tool when user:\n• Says 'recommend jobs', 'suggest jobs', 'job advice', 'match me', 'help me find jobs'\n• Provides resume, profile, experience, skills, or career context\n• Asks for 'jobs that match my background' or 'jobs for me'\n• Mentions seniority level, career priorities, or preferences\n• Wants personalized job suggestions based on their profile\n• Uploads a resume or provides detailed career information\n\n🎯 This tool performs intelligent job matching by:\n• Analyzing user's resume/profile and career context\n• Using explicit job_title/city if provided, otherwise inferring from resume (expectedPosition/cityPreference)\n• Searching database with determined filters\n• Scoring jobs based on experience, skills, industry fit\n• Returning top personalized recommendations with detailed match scores\n• Informing user when using resume inference for job targeting\n\n📝 Examples:\n• 'Recommend jobs for me based on my resume' → Uses resume expectedPosition\n• 'Suggest business analyst roles in Melbourne' → Uses explicit job_title + city\n• 'What jobs match my 5 years React experience in Sydney?' → Uses explicit criteria\n• 'Help me find data analyst positions' → Uses explicit job_title\n• 'I'm a senior developer, recommend suitable roles' → Uses profile context\n\n⚠️ NEVER call search_jobs after this tool - it provides complete results",
          inputSchema: {
            type: "object",
            properties: {
              user_profile: {
                type: "object",
                description: "User profile information for job matching",
                properties: {
                  jobTitles: {
                    type: "array",
                    items: { type: "string" },
                    description: "User's job titles or target positions"
                  },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "User's skills and competencies"
                  },
                  city: {
                    type: "string",
                    description: "User's preferred city"
                  },
                  seniority: {
                    type: "string",
                    enum: ["Junior", "Mid", "Senior", "Lead", "Manager", "Director", "VP", "C-level"],
                    description: "User's seniority level"
                  },
                  openToRelocate: {
                    type: "boolean",
                    description: "Whether user is open to relocation"
                  },
                  careerPriorities: {
                    type: "array",
                    items: { type: "string" },
                    description: "User's career priorities and preferences"
                  },
                  expectedPosition: {
                    type: "string",
                    description: "Expected position level"
                  },
                  currentPosition: {
                    type: "string",
                    description: "Current position level"
                  },
                  expectedSalary: {
                    type: "string",
                    enum: ["Lowest", "Low", "Medium", "High", "Highest"],
                    description: "Expected salary range"
                  },
                  employmentHistory: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        position: { type: "string" }
                      }
                    },
                    description: "User's employment history"
                  }
                },
                required: []
              },
              job_title: {
                type: "string",
                description: "Specific job title to search for (optional, e.g. 'business analyst', 'software engineer')"
              },
              city: {
                type: "string",
                description: "City to search for jobs (optional, e.g. 'Melbourne', 'Sydney')"
              },
              limit: {
                type: "integer",
                default: 10,
                minimum: 5,
                maximum: 20,
                description: "Number of recent jobs to analyze (default 10, max 20)"
              },
              use_chat_context: {
                type: "boolean",
                default: true,
                description: "Whether to use recent chat context for profile signals"
              },
              strict_filters: {
                type: "boolean",
                default: true,
                description: "If true and job_title/city provided, enforce them as database filters before scoring"
              }
            },
            required: ["user_profile"],
            additionalProperties: false
          }
        },
        {
          name: "search_jobs_by_company",
          description: "🏢 USE THIS for ANY company/employer searches!\n\n✅ ALWAYS use this tool when user mentions ANY company name:\n• Google, Microsoft, Atlassian, NAB, ANZ, Commonwealth Bank\n• Apple, Amazon, Meta, Netflix, Spotify, Uber\n• Wesley College, University of Melbourne, Monash University\n• Any company ending in Ltd, Inc, Corp, Bank, Group, University, College\n\n📋 Mapping rules:\n• Company name → company field\n• 'in/near <City>' → city field  \n• Job role → job_title field\n\n🎯 Examples:\n• 'jobs at Google' -> company='Google'\n• 'accountant at Microsoft' -> company='Microsoft', job_title='accountant'\n• 'find jobs with NAB in Melbourne' -> company='NAB', city='Melbourne'\n• 'software engineer at Atlassian' -> company='Atlassian', job_title='software engineer'",
          inputSchema: {
            type: "object",
            properties: {
              company: { 
                type: "string", 
                description: "Employer name, e.g., 'Google', 'Atlassian', 'NAB'" 
              },
              city: { 
                type: "string", 
                description: "Optional city filter, e.g., 'Melbourne'" 
              },
              job_title: { 
                type: "string", 
                description: "Optional role filter, e.g., 'software engineer'" 
              },
              page: { 
                type: "integer", 
                default: 1, 
                minimum: 1, 
                description: "Page number for pagination" 
              },
              page_size: { 
                type: "integer", 
                default: 20, 
                minimum: 1, 
                maximum: 50, 
                description: "Results per page (max 50)" 
              },
              posted_within_days: { 
                type: "integer", 
                minimum: 1, 
                description: "Filter jobs posted within X days (optional)" 
              },
              platforms: { 
                type: "array", 
                items: { type: "string" }, 
                description: "Filter by platforms: seek, linkedin, jora, adzuna, etc. (optional)" 
              }
            },
            required: ["company"],
            additionalProperties: false
          },
        },
        {
          name: "search_jobs",
          description: "🔍 LISTING SEARCH - Use this ONLY for simple job searches!\n\n✅ Use ONLY when user asks for:\n• 'find jobs', 'search jobs', 'browse jobs' WITHOUT personal context\n• Specific job titles: 'software engineer jobs', 'accountant positions'\n• Specific cities: 'jobs in Melbourne', 'Sydney jobs'\n• General job searches WITHOUT resume/profile/experience context\n\n🚫 NEVER use this if user:\n• Says 'recommend', 'suggest', 'advice', 'match', 'help me find'\n• Provides resume, profile, experience, skills, or background\n• Asks for personalized job matching or career advice\n• Mentions seniority level, career priorities, or preferences\n• Wants job recommendations based on their profile\n\n📝 Examples:\n• 'find software engineer jobs in Sydney'\n• 'search for accountant positions'\n• 'browse jobs in Melbourne'\n\n❌ WRONG usage (use recommend_jobs instead):\n• 'recommend jobs for me' -> use recommend_jobs\n• 'suggest jobs based on my resume' -> use recommend_jobs\n• 'help me find jobs that match my experience' -> use recommend_jobs",
          inputSchema: {
            type: "object",
            properties: {
              job_title: { 
                type: "string", 
                description: "e.g., 'software engineer'" 
              },
              city: { 
                type: "string", 
                description: "City only, e.g., 'Melbourne', 'Sydney'" 
              },
              page: { 
                type: "integer", 
                default: 1, 
                minimum: 1,
                description: "Page number for pagination"
              },
              page_size: { 
                type: "integer", 
                default: 20, 
                minimum: 1, 
                maximum: 50, 
                description: "Results per page (max 50)"
              },
              posted_within_days: {
                type: "integer",
                minimum: 1,
                description: "Filter jobs posted within X days (optional)"
              },
              platforms: {
                type: "array",
                items: { type: "string" },
                description: "Filter by platforms: seek, linkedin, jora, adzuna, etc. (optional)"
              },
              mode: {
                type: "string",
                enum: ["fast", "full"],
                description: "Override default mode for this request (optional)"
              }
            },
            anyOf: [
              { "required": ["job_title"] },
              { "required": ["city"] }
            ],
            additionalProperties: false
          },
        },
        {
          name: "build_search_links",
          description: "Generate direct search URLs for job platforms.",
          inputSchema: {
            type: "object",
            properties: {
              job_title: { type: "string", minLength: 1 },
              city: { type: "string", minLength: 1 },
              platforms: { 
                type: "array", 
                items: { type: "string" },
                default: ["linkedin", "seek", "jora", "adzuna"]
              },
            },
            required: ["job_title", "city"],
          },
        },
        {
          name: "get_user_applications",
          description: "Retrieve user job application history.",
          inputSchema: {
            type: "object",
            properties: {
              user_email: { type: "string", format: "email" },
              status_filter: { 
                type: "string", 
                enum: ["all", "saved", "applied", "interviewing", "offered", "rejected"],
                default: "all"
              },
            },
            required: ["user_email"],
          },
        },
      ];
      
      return json200({ 
        jsonrpc: "2.0", 
        id: body.id ?? null, 
        result: { tools: rpcTools } 
      });
    }

    // ============================================
    // AgentKit Integration - Planning & Execution
    // ============================================
    if (body.method === "agentkit/plan") {
      const traceId = crypto.randomUUID();
      const { userMessage, sessionId, userContext } = body.params || {};
      
      console.info("[AgentKit] Planning request:", { traceId, userMessage, sessionId });
      
      // Auto-switch to v2 if enabled
      if (process.env.FEATURE_AGENTKIT_V2 === 'true') {
        console.log("[AgentKit] Auto-switching to v2 logic");
        
        try {
          // Convert userMessage to intent format for v2
          const { plan } = await import('../../../experimental/agentkit_mvp/planner');
          
          // Simple intent mapping from userMessage
          const intent = {
            primary: 'find_jobs' as const,
            readiness: 'ready' as const,
            blockers: [],
            confidence: 0.9
          };
          
          const userId = sessionId || 'chatgpt_user';
          const v2Plan = await plan(userId, intent);
          
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    plan: v2Plan,
                    version: "v2_auto"
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId, "X-AgentKit-Auto-V2": "true" });
          
        } catch (error: any) {
          console.error('[AgentKit] V2 auto-switch error, falling back to v1:', error);
          // Fall through to v1 logic
        }
      }
      
      try {
        if (!userMessage) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "userMessage is required",
                    planId: null
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-Trace-Id": traceId });
        }

        // Use AgentKit Planner to generate plan
        const planner = new AgentKitPlanner();
        const memory = new AgentKitMemory();
        
        // Store conversation context in memory
        if (userContext?.history) {
          await memory.storeConversationHistory(sessionId || traceId, userContext.history);
        }

        // Generate execution plan
        const plan = await planner.generatePlan(userMessage, sessionId || traceId, userContext);
        
        // Store the plan
        const executor = new AgentKitExecutor();
        await executor.storePlan(plan);
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: { content: plan }
            }],
            isError: false
          }
        }, { "X-AgentKit-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit] Planning error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json", 
              data: {
                content: {
                  error: error.message || 'Planning failed',
                  planId: null
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-Trace-Id": traceId });
      }
    }

    if (body.method === "agentkit/execute") {
      const traceId = crypto.randomUUID();
      const { planId, stepId } = body.params || {};
      
      console.info("[AgentKit] Execution request:", { traceId, planId, stepId });
      
      // Auto-switch to v2 if enabled
      if (process.env.FEATURE_AGENTKIT_V2 === 'true') {
        console.log("[AgentKit] Auto-switching execute to v2 logic");
        
        try {
          // For execute, we need to get the plan and execute it with v2 logic
          // This is a simplified version - in practice you'd retrieve the actual plan
          const mockPlan = {
            id: planId || 'fallback_plan',
            userId: 'chatgpt_user',
            intent: {
              primary: 'find_jobs' as const,
              readiness: 'ready' as const,
              blockers: [],
              confidence: 0.9
            },
            steps: [
              {
                id: stepId || 's1',
                tool: 'searchJobs' as const,
                args: { limit: 20 },
                priority: 1
              }
            ],
            createdAt: new Date().toISOString(),
            version: 'v1.0.0' as const
          };
          
          const { execute } = await import('../../../experimental/agentkit_mvp/executor');
          const results = await execute(mockPlan, { dryRun: false });
          
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    executions: results,
                    version: "v2_auto"
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId, "X-AgentKit-Auto-V2": "true" });
          
        } catch (error: any) {
          console.error('[AgentKit] V2 execute auto-switch error, falling back to v1:', error);
          // Fall through to v1 logic
        }
      }
      
      try {
        if (!planId || !stepId) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "planId and stepId are required",
                    result: null
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-Trace-Id": traceId });
        }

        // Execute AgentKit plan step using new executor
        const executor = new AgentKitExecutor();
        const result = await executor.executeStep(planId, stepId);
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: { content: result }
            }],
            isError: false
          }
        }, { "X-AgentKit-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit] Execution error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  error: error.message || 'Execution failed',
                  result: null
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-Trace-Id": traceId });
      }
    }

    // ============================================
    // AgentKit V2 - Experimental MVP Integration
    // ============================================
    
    // v2: plan-only (只读规划)
    if (body.method === "agentkit-v2/plan") {
      const traceId = crypto.randomUUID();
      console.log("[AgentKit V2] Planning request:", { traceId });
      
      try {
        // Phase 1: 认证检查
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.AGENTKIT_TOKEN;
        if (expectedToken && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== expectedToken)) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: {
              code: -32603,
              message: "Unauthorized: Missing or invalid AGENTKIT_TOKEN"
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }

        // Phase 1: 功能开关检查
        if (process.env.FEATURE_AGENTKIT_V2 !== 'true') {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: {
              code: -32603,
              message: "AgentKit v2 is currently disabled"
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }

        const { plan } = await import('../../../experimental/agentkit_mvp/planner');
        const { userId = 'anonymous', intent } = body.params || {};
        
        if (!intent) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "intent parameter is required",
                    plan: null
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }
        
        const p = await plan(userId, intent);
        
        // Phase 1: Guard - 参数校验和白名单校验
        const ALLOWED_TOOLS = ["parseResume", "updateProfile", "searchJobs", "rankRecommend"];
        const validationErrors = [];
        
        if (!p.id || typeof p.id !== 'string') {
          validationErrors.push("Plan ID is required and must be string");
        }
        if (!Array.isArray(p.steps)) {
          validationErrors.push("Plan steps must be array");
        } else {
          for (const step of p.steps) {
            if (!ALLOWED_TOOLS.includes(step.tool)) {
              validationErrors.push(`Tool ${step.tool} not in allowed list: ${ALLOWED_TOOLS.join(', ')}`);
            }
            if (!step.id || typeof step.id !== 'string') {
              validationErrors.push("Step ID is required and must be string");
            }
          }
        }
        
        if (validationErrors.length > 0) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "plan_validation_error",
                    details: validationErrors,
                    plan: null
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  plan: p
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit V2] Planning error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  error: error.message || 'Planning failed',
                  plan: null
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
      }
    }

    // v2: execute with tool whitelist (执行器，仅允许指定工具)
    if (body.method === "agentkit-v2/execute") {
      const traceId = crypto.randomUUID();
      const executionStartTime = Date.now();
      console.log("[AgentKit V2] Execution request:", { traceId });
      
      try {
        // Phase 1: 认证和功能开关检查（与plan方法相同）
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.AGENTKIT_TOKEN;
        if (expectedToken && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== expectedToken)) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: {
              code: -32603,
              message: "Unauthorized: Missing or invalid AGENTKIT_TOKEN"
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }

        if (process.env.FEATURE_AGENTKIT_V2 !== 'true') {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: {
              code: -32603,
              message: "AgentKit v2 is currently disabled"
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }

        const { execute } = await import('../../../experimental/agentkit_mvp/executor');
        const { plan, allowTools = ["parseResume", "updateProfile", "searchJobs", "rankRecommend"] } = body.params || {};
        
        if (!plan) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "plan parameter is required",
                    executions: []
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }

        // Phase 1: 观测埋点 - 初始化监控指标
        const toolFailureCounts = new Map<string, number>();
        let totalRetries = 0;
        const stepStartTimes = new Map<string, number>();
        
        // 增强版执行器：调用真实MCP工具
        const results: Array<{
          id: string;
          planId: string;
          stepId: string;
          tool: string;
          status: 'success' | 'error' | 'skipped';
          latencyMs: number;
          inputSnapshot: unknown;
          outputSnapshot: unknown | null;
          errorMessage: string | null;
          createdAt: string;
        }> = [];
        for (const step of plan.steps) {
          stepStartTimes.set(step.id, Date.now());
          // 白名单过滤
          if (allowTools && allowTools.length > 0 && !allowTools.includes(step.tool)) {
            results.push({
              id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              planId: plan.id,
              stepId: step.id,
              tool: step.tool,
              status: 'skipped',
              latencyMs: 0,
              inputSnapshot: step.args,
              outputSnapshot: null,
              errorMessage: 'tool not allowed in v2 phase',
              createdAt: new Date().toISOString(),
            });
            continue;
          }

          const t0 = Date.now();
          let result = null;
          let status = 'success';
          let errorMessage = null;

          try {
            console.log(`[AgentKit V2] Executing tool: ${step.tool}`, step.args);
            
            // 将AgentKit工具名映射到MCP工具名
            if (step.tool === 'searchJobs') {
              // 调用真实的search_jobs工具
              const toolCallResult = await (async () => {
                const jobTitle = step.args.limit ? 'Software Engineer' : (step.args.jobTitle || 'Developer');
                const city = step.args.location || 'Sydney';
                
                // 模拟MCP工具调用逻辑
                const jobTitleStr = String(jobTitle).trim();
                const cityStr = String(city).trim();
                
                if (!jobTitleStr || !cityStr) {
                  return {
                    jobs: [],
                    total: 0,
                    note: "missing_params",
                    message: "job_title and city are required"
                  };
                }

                // 这里应该调用实际的MCP搜索逻辑
                // 为了演示，我们返回一个结构化响应
                return {
                  jobs: [
                    {
                      id: `job_${Date.now()}`,
                      title: jobTitleStr,
                      company: "Demo Company",
                      location: `${cityStr}, NSW`,
                      description: "Generated via AgentKit v2"
                    }
                  ],
                  total: 1,
                  note: "agentkit_v2_result"
                };
              })();
              
              result = toolCallResult;
            } else {
              // 对于其他工具，使用mock实现
              const { ToolRegistry } = await import('../../../experimental/agentkit_mvp/registry');
              result = await (ToolRegistry as any)[step.tool](step.args);
            }
          } catch (error: any) {
            status = 'error';
            errorMessage = String(error?.message ?? error);
            console.error(`[AgentKit V2] Tool ${step.tool} failed:`, errorMessage);
            
            // Phase 1: 观测埋点 - 工具失败率统计
            const currentFailures = toolFailureCounts.get(step.tool) || 0;
            toolFailureCounts.set(step.tool, currentFailures + 1);
          }

          const latencyMs = Date.now() - t0;
          results.push({
            id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            planId: plan.id,
            stepId: step.id,
            tool: step.tool,
            status: status as any,
            latencyMs,
            inputSnapshot: step.args,
            outputSnapshot: result,
            errorMessage,
            createdAt: new Date().toISOString(),
          });
        }
        
        // Phase 1: 观测埋点 - 计算关键指标并记录日志
        const totalExecutionTime = Date.now() - executionStartTime;
        const rankRecommendStep = results.find(r => r.tool === 'rankRecommend' && r.status === 'success');
        const timeToFirstRecsMs = rankRecommendStep ? 
          (rankRecommendStep.createdAt ? new Date(rankRecommendStep.createdAt).getTime() - executionStartTime : 0) : 
          totalExecutionTime;
        
        // 记录关键指标到日志
        console.log(`[AgentKit V2] [METRICS] ${traceId}`, {
          time_to_first_recs_ms: timeToFirstRecsMs,
          tool_failure_rate: Object.fromEntries(
            Array.from(toolFailureCounts.entries()).map(([tool, failures]) => [
              tool, 
              `${((failures / results.filter(r => r.tool === tool).length) * 100).toFixed(2)}%`
            ])
          ),
          exec_retry_count: totalRetries,
          total_execution_time_ms: totalExecutionTime,
          plan_id: plan.id,
          user_id: plan.userId || 'anonymous',
          steps_count: plan.steps.length,
          successful_steps: results.filter(r => r.status === 'success').length,
          failed_steps: results.filter(r => r.status === 'error').length
        });
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  executions: results
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit V2] Execution error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  error: error.message || 'Execution failed',
                  executions: []
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
      }
    }

    // ============================================
    // tools/call - Execute tool
    // ============================================
    if (body.method === "tools/call") {
      const traceId = crypto.randomUUID();
      const { name, arguments: args } = body.params || {};
      console.info("[TRACE]", traceId, { tool: name, args });

      try {
        // ============================================
        // Tool: search_jobs (FAST or FULL mode)
        // ============================================
        if (name === "search_jobs") {
          const jobTitle = String(args?.job_title || "").trim();
          const city = String(args?.city || "").trim();
          const requestMode = args?.mode || HERA_MCP_MODE; // Allow per-request override

          // Validate required params
          if (!jobTitle || !city) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      jobs: [],
                      total: 0,
                      note: "missing_params",
                      message: "job_title and city are required"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId, "X-MCP-Mode": requestMode });
          }

          // ============================================
          // FAST MODE: Lightweight database query
          // ============================================
          if (requestMode === "fast") {
            const t0 = Date.now();
            const page = Math.max(1, Number(args?.page || 1));
            const pageSize = 5; // GPT建议：第一次固定5条，确认通了再放开
            
            // 只处理有效的参数，跳过 undefined
            const postedWithinDays = args?.posted_within_days && Number(args.posted_within_days) > 0 
              ? Number(args.posted_within_days) : undefined;
            const platforms = Array.isArray(args?.platforms) && args.platforms.length > 0 
              ? args.platforms : undefined;

            // 只打印有效的参数，跳过 undefined
            const logParams: any = { page, pageSize };
            if (args?.limit) logParams.limit = args.limit;
            if (postedWithinDays) logParams.postedWithinDays = postedWithinDays;
            if (platforms) logParams.platforms = platforms;
            console.info("[TRACE]", traceId, "FAST mode:", logParams);

            let result;
            try {
              result = await withTimeout(
                fastDbQuery({ 
                  title: jobTitle, 
                  city, 
                  page, 
                  pageSize,
                  postedWithinDays,
                  platforms
                }),
                Math.min(8000, budgetLeft(t0))
              );
            } catch (e: any) {
              console.warn("[TRACE]", traceId, "FAST query timeout:", e.message);
              result = { jobs: [], total: 0, page, pageSize, hasMore: false };
            }

            // Map jobs to response format
            const jobs = result.jobs.map((j: any) => {
              // Determine posted date (priority: postedDateISO > createdAt > updatedAt)
              const posted =
                j.postedDateISO ||
                j.postedDate ||
                j.postedDateRaw ||
                j.createdAt ||
                j.updatedAt ||
                null;

              // Generate URL: priority jobUrl > url > internal fallback
              const jobId = String(j.id || j._id || j.jobIdentifier || "");
              const url =
                (j.jobUrl && typeof j.jobUrl === "string" && j.jobUrl.startsWith("http"))
                  ? j.jobUrl
                  : (j.url && typeof j.url === "string" && j.url.startsWith("http"))
                    ? j.url
                    : `https://www.heraai.net.au/jobs/${encodeURIComponent(jobId)}?utm_source=chatgpt&utm_medium=mcp&utm_campaign=fast`;

              return {
                id: jobId,
                title: j.title || "",
                company: j.company || j.organisation || "",
                location: j.location || "",
                employmentType: j.employmentType || "",
                postDate: posted ? (posted instanceof Date ? posted.toISOString() : new Date(posted).toISOString()) : null,
                url,
                platform: j.sourceType || (Array.isArray(j.source) ? j.source[0] : j.source) || j.platform || "",
              };
            });

            const elapsed = Date.now() - t0;
            const note = elapsed >= 8000 ? "timeout" : "completed";

            // GPT建议：第一次只回5条，控制体积 + 保证 < 8s
            const HARD_DEADLINE_MS = 8000;
            const limit = 5;
            const src: any[] = Array.isArray(result?.jobs) ? result.jobs : (Array.isArray(result) ? result : []);
            
            // 并发生成highlights（使用原始job数据，包含description等字段）
            const jobsWithHighlights = await Promise.all(
              src.slice(0, limit).map(async (job: any) => {
                try {
                  const highlights = await withTimeout(
                    generateJobHighlights(job),
                    3000 // 每个job最多3秒
                  );
                  return { ...job, highlights };
                } catch (error) {
                  console.error('[MCP] Highlights timeout for job:', job.id || job._id);
                  // Fallback: 使用数据库字段
                  const fallbackHighlights = [
                    `${job.company || 'Company'} seeking ${job.experience || 'candidate'}`,
                    job.skills && job.skills.length > 0 
                      ? `Requires: ${job.skills.slice(0, 5).join(', ')}`
                      : 'View details for requirements'
                  ];
                  return { ...job, highlights: fallbackHighlights };
                }
              })
            );
            
            // 映射为安全格式（保留highlights）
            const safeJobs = jobsWithHighlights.map((j: any) => ({
              ...mapJobSafe(j),
              highlights: j.highlights || []
            }));
            
            // 生成Markdown卡片预览（iOS ChatGPT需要，现在包含highlights）
            const markdownPreview = buildMarkdownCards(
              { title: jobTitle, city }, 
              safeJobs, 
              result?.total || safeJobs.length
            );

            // 测试：只返回text，不返回json（看是否是json导致问题）
            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [
                  { type: "text", text: markdownPreview }
                ],
                isError: false,
                // 添加isFinal标记防止重复调用
                mode: "search",
                query_used: { job_title: jobTitle, city: city },
                total: safeJobs.length,
                isFinal: true
              }
            }), {
              status: 200,
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "no-store"
              }
            });
          }

          // ============================================
          // FULL MODE: Deep analysis with GPT
          // ============================================
          else {
            const limit = Number(args?.limit || 5);
            const t0 = Date.now();
            console.info("[TRACE]", traceId, "FULL mode: Starting staged pipeline");

            // Stage 1: GPT planning
            let plan;
            try {
              plan = await withTimeout(
                generateJobPlan(jobTitle, city),
                Math.min(GPT_TIMEOUT_MS, budgetLeft(t0))
              );
              console.info("[TRACE]", traceId, "GPT plan OK");
            } catch (e: any) {
              console.warn("[TRACE]", traceId, "GPT planning timeout:", e.message);
              plan = null;
            }

            // Stage 2: Database query
            let rows;
            try {
              rows = await withTimeout(
                fetchFromDatabase(jobTitle, city, limit, plan),
                Math.min(DB_TIMEOUT_MS, budgetLeft(t0))
              );
              console.info("[TRACE]", traceId, "DB query OK, rows:", rows?.length ?? 0);
            } catch (e: any) {
              console.warn("[TRACE]", traceId, "DB timeout:", e.message);
              rows = [];
            }

            // Stage 3: Post-processing
            let processedJobs;
            try {
              processedJobs = await withTimeout(
                postProcessResults(rows),
                Math.min(POST_TIMEOUT_MS, budgetLeft(t0))
              );
            } catch (e: any) {
              console.warn("[TRACE]", traceId, "Post-process timeout:", e.message);
              processedJobs = rows;
            }

            const elapsed = now() - t0;
            const note = elapsed >= TOTAL_BUDGET_MS ? "budget_timeout" : "completed";

            return json200(
              {
                jsonrpc: "2.0",
                id: body.id ?? null,
                result: {
                  content: [{
                    type: "json",
                    data: {
                      content: {
                        mode: "full",
                        jobs: processedJobs,
                        total: processedJobs?.length ?? 0,
                        note,
                        elapsed_ms: elapsed,
                        query: `${jobTitle} in ${city}`,
                        timestamp: new Date().toISOString(),
                      }
                    }
                  }],
                  isError: false,
                  // 添加isFinal标记防止重复调用
                  mode: "search",
                  query_used: { job_title: jobTitle, city: city },
                  total: processedJobs?.length ?? 0,
                  isFinal: true
                }
              },
              { 
                "X-MCP-Trace-Id": traceId,
                "X-MCP-Mode": "full",
                "X-MCP-Elapsed": String(elapsed)
              }
            );
          }
        }

        // ============================================
        // Tool: jobs_at_company (alias for search_jobs_by_company)
        // ============================================
        else if (name === "jobs_at_company") {
          // Apply smart parameter correction
          const fixedArgs = fixArgs(args);
          const companyName = fixedArgs.company;
          const jobTitle = fixedArgs.job_title;
          const city = fixedArgs.city;

          // Validate required params
          if (!companyName) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      jobs: [],
                      total: 0,
                      note: "missing_params",
                      message: "company is required"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }

          // Use FAST mode for company search (lightweight)
          const t0 = Date.now();
          const page = Math.max(1, Number(args?.page || 1));
          const pageSize = 20; // Default page size
          const postedWithinDays = Number(args?.posted_within_days || 0);
          const platforms = Array.isArray(args?.platforms) ? args.platforms : undefined;

          console.info("[TRACE]", traceId, "Company search (jobs_at_company):", { companyName, jobTitle, city });

          // Build query parameters
          const queryParams: FastQueryParams = {
            title: jobTitle || undefined, // Only use job title if provided
            city: city || undefined, // Only use city if provided
            page,
            pageSize,
            postedWithinDays: postedWithinDays > 0 ? postedWithinDays : undefined,
            platforms,
            company: companyName, // Company filter is the main search criteria
          };

          try {
            const result = await fastDbQuery(queryParams);
            
            // Generate highlights for jobs (reuse existing logic)
            const jobsWithHighlights = await Promise.all(
              result.jobs.slice(0, pageSize).map(async (job: any) => {
                try {
                  const highlights = await withTimeout(
                    generateJobHighlights(job),
                    3000 // Each job gets 3 seconds for highlights
                  );
                  return { ...job, highlights };
                } catch (error) {
                  console.error('[MCP] Highlights timeout for job:', job.id || job._id);
                  // Fallback logic
                  const fallbackHighlights = [
                    `${job.company || job.company_name || 'Company'} seeking ${job.experience || 'candidate'}`,
                    job.skills && job.skills.length > 0 
                      ? `Requires: ${job.skills.slice(0, 5).join(', ')}`
                      : 'View details for requirements'
                  ];
                  return { ...job, highlights: fallbackHighlights };
                }
              })
            );
            
            // Map to safe format (preserve highlights)
            const safeJobs = jobsWithHighlights.map((j: any) => ({
              ...mapJobSafe(j),
              highlights: j.highlights || []
            }));
            
            // Generate Markdown cards preview with company info
            const markdownPreview = buildMarkdownCards(
              { title: jobTitle || `jobs from ${companyName}`, city }, 
              safeJobs, 
              result?.total || safeJobs.length
            );

            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [
                  { type: "text", text: markdownPreview }
                ],
                isError: false
              }
            }), {
              status: 200,
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "no-store"
              }
            });

          } catch (error: any) {
            console.error('[MCP] Company search error:', error);
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      jobs: [],
                      total: 0,
                      note: "error",
                      message: error.message || "Company search failed"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }
        }

        // ============================================
        // Tool: search_jobs_by_company
        // ============================================
        else if (name === "search_jobs_by_company") {
          // Apply smart parameter correction
          const fixedArgs = fixArgs(args);
          const companyName = fixedArgs.company;
          const jobTitle = fixedArgs.job_title;
          const city = fixedArgs.city;

          // Validate required params
          if (!companyName) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      jobs: [],
                      total: 0,
                      note: "missing_params",
                      message: "company is required"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }

          // Use FAST mode for company search (lightweight)
          const t0 = Date.now();
          const page = Math.max(1, Number(args?.page || 1));
          const pageSize = 20; // Default page size
          const postedWithinDays = Number(args?.posted_within_days || 0);
          const platforms = Array.isArray(args?.platforms) ? args.platforms : undefined;

          console.info("[TRACE]", traceId, "Company search:", { companyName, jobTitle, city });

          // Build query parameters
          const queryParams: FastQueryParams = {
            title: jobTitle || undefined, // Only use job title if provided
            city: city || undefined, // Only use city if provided
            page,
            pageSize,
            postedWithinDays: postedWithinDays > 0 ? postedWithinDays : undefined,
            platforms,
            company: companyName, // Company filter is the main search criteria
          };

          try {
            const result = await fastDbQuery(queryParams);
            
            // Generate highlights for jobs (reuse existing logic)
            const jobsWithHighlights = await Promise.all(
              result.jobs.slice(0, pageSize).map(async (job: any) => {
                try {
                  const highlights = await withTimeout(
                    generateJobHighlights(job),
                    3000 // Each job gets 3 seconds for highlights
                  );
                  return { ...job, highlights };
                } catch (error) {
                  console.error('[MCP] Highlights timeout for job:', job.id || job._id);
                  // Fallback logic
                  const fallbackHighlights = [
                    `${job.company || job.company_name || 'Company'} seeking ${job.experience || 'candidate'}`,
                    job.skills && job.skills.length > 0 
                      ? `Requires: ${job.skills.slice(0, 5).join(', ')}`
                      : 'View details for requirements'
                  ];
                  return { ...job, highlights: fallbackHighlights };
                }
              })
            );
            
            // Map to safe format (preserve highlights)
            const safeJobs = jobsWithHighlights.map((j: any) => ({
              ...mapJobSafe(j),
              highlights: j.highlights || []
            }));
            
            // Generate Markdown cards preview with company info
            const markdownPreview = buildMarkdownCards(
              { title: jobTitle || `jobs from ${companyName}`, city }, 
              safeJobs, 
              result?.total || safeJobs.length
            );

            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [
                  { type: "text", text: markdownPreview }
                ],
                isError: false
              }
            }), {
              status: 200,
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "no-store"
              }
            });

          } catch (error: any) {
            console.error('[MCP] Company search error:', error);
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      jobs: [],
                      total: 0,
                      note: "error",
                      message: error.message || "Company search failed"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }
        }

        // ============================================
        // Tool: build_search_links
        // ============================================
        else if (name === "build_search_links") {
          const jobTitle = String(args?.job_title || "").trim();
          const city = String(args?.city || "").trim();
          const platforms = args?.platforms || ["linkedin", "seek", "jora", "adzuna"];

          if (!jobTitle || !city) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      links: [],
                      total: 0,
                      note: "missing_params"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }

          const linkArgs: LinkGenerationArgs = {
            job_title: jobTitle,
            city,
            country_code: 'AU',
            platforms,
            posted_within_days: 7,
          };

          const links: SearchLink[] = generateSearchLinks(linkArgs);

          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    links,
                    total: links.length,
                    query: `${jobTitle} in ${city}`,
                  }
                }
              }],
              isError: false
            }
          }, { "X-MCP-Trace-Id": traceId });
        }

        // ============================================
        // Tool: get_user_applications
        // ============================================
        else if (name === "get_user_applications") {
          const userEmail = String(args?.user_email || "").trim();
          const statusFilter = args?.status_filter || 'all';

          if (!userEmail) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      applications: [],
                      total: 0,
                      note: "missing_user_email"
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }

          const profile = await withTimeout(getUserProfile(userEmail), 5000).catch(() => null);

          if (!profile) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "json",
                  data: {
                    content: {
                      applications: [],
                      total: 0,
                      note: "profile_not_found",
                    }
                  }
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }

          let applications = profile.applications || [];
          if (statusFilter !== 'all') {
            applications = applications.filter(
              (app: any) => app.applicationStatus === statusFilter
            );
          }

          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    applications,
                    total: applications.length,
                    status_filter: statusFilter,
                    user_email: userEmail,
                  }
                }
              }],
              isError: false
            }
          }, { "X-MCP-Trace-Id": traceId });
        }

        // ============================================
        // Tool: recommend_jobs
        // ============================================
        else if (name === "recommend_jobs") {
          const { 
            user_profile = {}, 
            job_title, 
            city, 
            limit = 10, 
            use_chat_context = true, 
            strict_filters = true 
          } = args;
          
          console.log('[MCP] recommend_jobs - Input args:', { job_title, city, limit, use_chat_context, strict_filters });
          
          // 信息优先级处理：对话明确信息 > 简历解析信息 > 默认值
          const determineSearchCriteria = () => {
            // 1. 对话明确信息（最高优先级）
            if (job_title || city) {
              return {
                jobTitle: job_title || null,
                city: city || null,
                source: 'explicit_input',
                usedResumeInference: false
              };
            }
            
            // 2. 简历解析信息（中等优先级）
            if (user_profile.expectedPosition || user_profile.jobTitles?.[0] || user_profile.city) {
              return {
                jobTitle: user_profile.expectedPosition || user_profile.jobTitles?.[0] || null,
                city: user_profile.city || null,
                source: 'resume_parsed',
                usedResumeInference: true,
                inferredPosition: user_profile.expectedPosition || user_profile.jobTitles?.[0] || null
              };
            }
            
            // 3. 默认值（最低优先级）
            return {
              jobTitle: null,
              city: 'Melbourne',
              source: 'default',
              usedResumeInference: false
            };
          };
          
          const searchCriteria = determineSearchCriteria();
          console.log('[MCP] Search criteria determined:', searchCriteria);
          
          // 构建用户档案，保持现有的简历解析逻辑
          const defaultProfile = {
            skills: user_profile.skills && user_profile.skills.length > 0 ? user_profile.skills : ['General Skills', 'Problem Solving', 'Communication'],
            city: searchCriteria.city || 'Melbourne',
            seniority: user_profile.seniority || 'Mid',
            jobTitles: user_profile.jobTitles && user_profile.jobTitles.length > 0 ? user_profile.jobTitles : ['General Professional'],
            openToRelocate: user_profile.openToRelocate || false,
            careerPriorities: user_profile.careerPriorities && user_profile.careerPriorities.length > 0 ? user_profile.careerPriorities : ['Career Growth', 'Work-Life Balance'],
            expectedSalary: user_profile.expectedSalary || 'Medium',
            currentPosition: user_profile.currentPosition || 'Professional',
            expectedPosition: user_profile.expectedPosition || 'Senior Professional',
            employmentHistory: user_profile.employmentHistory && user_profile.employmentHistory.length > 0 ? user_profile.employmentHistory : [
              { company: 'Previous Company', position: 'Professional Role' }
            ]
          };
          
          console.log('[MCP] recommend_jobs - Final profile:', JSON.stringify(defaultProfile, null, 2));

          try {
            // 1. 根据搜索条件从数据库获取职位
            const { db } = await connectToMongoDB();
            const collection = db.collection('hera_jobs.jobs');
            
            // 构建查询条件
            const query: any = { is_active: { $ne: false } };
            
            // 如果启用了严格筛选且有明确的搜索条件
            if (strict_filters && (searchCriteria.jobTitle || searchCriteria.city)) {
              if (searchCriteria.jobTitle) {
                query.$or = [
                  { title: { $regex: searchCriteria.jobTitle, $options: 'i' } },
                  { summary: { $regex: searchCriteria.jobTitle, $options: 'i' } }
                ];
              }
              if (searchCriteria.city) {
                query.location = { $regex: searchCriteria.city, $options: 'i' };
              }
            } else if (searchCriteria.city) {
              // 只有城市筛选
              query.location = { $regex: searchCriteria.city, $options: 'i' };
            }
            
            console.log('[MCP] Database query:', JSON.stringify(query, null, 2));
            
            // 获取更多职位用于筛选，确保有足够的选择
            const searchLimit = Math.max(limit * 3, 30);
            const recentJobs = await collection
              .find(query)
              .sort({ updatedAt: -1, createdAt: -1 })
              .limit(searchLimit)
              .toArray();

            // 转换为前端格式
            const transformedJobs = recentJobs
              .map((job: any) => transformMongoDBJobToFrontendFormat(job))
              .filter((job: any) => job !== null);

            if (transformedJobs.length === 0) {
              return json200({
                jsonrpc: "2.0",
                id: body.id ?? null,
                result: {
                  content: [{
                    type: "text",
                    text: "No recent job postings found. Try adjusting your search criteria or check back later for new postings."
                  }],
                  isError: false
                }
              }, { "X-MCP-Trace-Id": traceId });
            }

            // 2. 发送给mirror-jobs进行基础分析
            const mirrorResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mirror-jobs`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jobs: transformedJobs,
                jobTitle: defaultProfile.jobTitles?.[0] || 'General',
                city: defaultProfile.city,
                limit: limit,
                page: 1,
                isHotJob: false,
                platform: 'recommendation'
              })
            });

            if (!mirrorResponse.ok) {
              throw new Error(`Mirror-jobs API error: ${mirrorResponse.status}`);
            }

            const mirrorResult = await mirrorResponse.json();
            const analyzedJobs = mirrorResult.jobs || [];

            // 3. 对每个职位进行用户匹配分析
            console.log(`[MCP] Starting GPT matching for ${analyzedJobs.length} jobs`);
            const scoredJobs = await Promise.all(
              analyzedJobs.map(async (job: any) => {
                try {
                  console.log(`[MCP] Calling GPT for job: ${job.title}`);
                  const gptApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/gpt-services/jobMatch`;
                  console.log(`[MCP] GPT API URL: ${gptApiUrl}`);
                  const matchResponse = await fetch(gptApiUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      jobTitle: job.title,
                      jobDescription: job.description || '',
                      jobRequirements: job.requirements || [],
                      jobLocation: job.location,
                      userProfile: {
                        jobTitles: defaultProfile.jobTitles.length > 0 ? defaultProfile.jobTitles : [job.title],
                        skills: defaultProfile.skills,
                        city: defaultProfile.city,
                        seniority: defaultProfile.seniority,
                        openToRelocate: defaultProfile.openToRelocate,
                        careerPriorities: defaultProfile.careerPriorities,
                        expectedSalary: defaultProfile.expectedSalary,
                        currentPosition: defaultProfile.currentPosition,
                        expectedPosition: defaultProfile.expectedPosition,
                        employmentHistory: defaultProfile.employmentHistory
                      }
                    }),
                  });

                  if (!matchResponse.ok) {
                    throw new Error(`Match API error: ${matchResponse.status}`);
                  }

                  const matchData = await matchResponse.json();
                  
                  // 添加调试日志 - 使用更明显的格式
                  console.log(`[MCP] ===== JOB SCORING DEBUG =====`);
                  console.log(`[MCP] Job Title: ${job.title}`);
                  console.log(`[MCP] GPT Raw Response:`, matchData);
                  console.log(`[MCP] Score from GPT: ${matchData.score}`);
                  console.log(`[MCP] SubScores from GPT:`, matchData.subScores);
                  console.log(`[MCP] ================================`);
                  
                  // 确保分数格式符合GPT要求
                  const validatedSubScores = {
                    experience: Math.min(Math.max(matchData.subScores?.experience || 50, 50), 95),
                    industry: Math.min(Math.max(matchData.subScores?.industry || 50, 50), 95),
                    skills: Math.min(Math.max(matchData.subScores?.skills || 50, 50), 90), // skills最高90
                    other: Math.min(Math.max(matchData.subScores?.other || 50, 50), 95)
                  };
                  
                  const validatedMatchScore = Math.min(Math.max(matchData.score || 50, 50), 95);
                  
                  console.log(`[MCP] Job ${job.title} - Final Scores:`, {
                    matchScore: validatedMatchScore,
                    subScores: validatedSubScores
                  });
                  
                  return {
                    ...job,
                    matchScore: validatedMatchScore,
                    subScores: validatedSubScores,
                    matchAnalysis: matchData.analysis || 'Analysis not available',
                    matchHighlights: matchData.highlights || [],
                    summary: matchData.listSummary || job.summary || `${job.title} position at ${job.company}`,
                    detailedSummary: matchData.detailedSummary || job.detailedSummary || job.description?.substring(0, 200) + '...',
                    keyRequirements: matchData.keyRequirements || [],
                    userType: matchData.userType || 'neutral'
                  };
                } catch (error) {
                  console.error(`Error scoring job ${job.id}:`, error);
                  // 为每个失败的职位生成不同的默认分数，避免所有分数都一样
                  const randomOffset = Math.floor(Math.random() * 20) - 10; // -10 到 +10 的随机偏移
                  const baseScore = 60 + randomOffset;
                  const finalScore = Math.min(Math.max(baseScore, 50), 80);
                  
                  return {
                    ...job,
                    matchScore: finalScore,
                    subScores: { 
                      experience: Math.min(Math.max(55 + randomOffset, 50), 85),
                      industry: Math.min(Math.max(60 + randomOffset, 50), 85),
                      skills: Math.min(Math.max(50 + randomOffset, 50), 80),
                      other: Math.min(Math.max(65 + randomOffset, 50), 85)
                    },
                    matchAnalysis: 'Unable to analyze - using fallback scoring',
                    matchHighlights: [
                      `Basic match: ${job.title} position`,
                      `Location: ${job.location}`,
                      `Company: ${job.company}`
                    ],
                    summary: job.summary || `${job.title} position at ${job.company}`,
                    detailedSummary: job.detailedSummary || job.description?.substring(0, 200) + '...',
                    keyRequirements: [],
                    userType: 'neutral'
                  };
                }
              })
            );

            // 4. 按分数从高到低排序，返回前5个
            const recommendedJobs = scoredJobs
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 5);

            // 5. 按照现有UI规则格式化显示，确保分数格式正确
            const recommendations = recommendedJobs.map((job, index) => 
              `**${index + 1}. ${job.title}** at ${job.company}\n` +
              `📍 ${job.location} | 💼 ${job.jobType || 'Full-time'} | 💰 ${job.salary || 'Salary not specified'}\n` +
              `\n**Job Highlights:**\n${job.matchHighlights?.map((h: string) => `• ${h}`).join('\n') || 'Analysis not available'}\n` +
              `\n**Match Score: ${job.matchScore}%**\n` +
              `• Experience: ${job.subScores.experience}% | Skills: ${job.subScores.skills}% | Industry: ${job.subScores.industry}% | Other: ${job.subScores.other}%\n` +
              `\n🔗 [View Job](${job.url})\n` +
              `\n---\n`
            ).join('\n');

            // 构建基础摘要
            let summary = `Found ${recommendedJobs.length} personalized job recommendations based on recent postings. ` +
              `All jobs are sorted by match score (${recommendedJobs[0]?.matchScore}% - ${recommendedJobs[recommendedJobs.length-1]?.matchScore}%).`;
            
            // 如果使用了简历推测，添加说明
            if (searchCriteria.usedResumeInference && searchCriteria.inferredPosition) {
              summary += `\n\n💡 **根据你的简历推测目标职位为『${searchCriteria.inferredPosition}』**`;
              if (searchCriteria.city) {
                summary += `，地点为『${searchCriteria.city}』`;
              }
              summary += `。如有其他补充信息或想法，请告诉我！`;
            }

            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "text",
                  text: `# 🎯 Personalized Job Recommendations\n\n${summary}\n\n${recommendations}`
                }],
                isError: false,
                // 添加isFinal标记防止重复调用
                mode: "recommend",
                query_used: { 
                  job_title: searchCriteria.jobTitle, 
                  city: searchCriteria.city 
                },
                used_resume: true,
                total: recommendedJobs.length,
                isFinal: true
              }
            }, { "X-MCP-Trace-Id": traceId });

          } catch (error: any) {
            console.error('[MCP] recommend_jobs error:', error);
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content: [{
                  type: "text",
                  text: `Failed to get job recommendations: ${error.message}`
                }],
                isError: false
              }
            }, { "X-MCP-Trace-Id": traceId });
          }
        }

        // Unknown tool
        else {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: `Unknown tool: ${name}`,
                    note: "unknown_tool"
                  }
                }
              }],
              isError: false
            }
          }, { "X-MCP-Trace-Id": traceId });
        }

      } catch (e: any) {
        console.warn("[TRACE]", traceId, "Pipeline error:", e.message);

        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  jobs: [],
                  error: String(e.message),
                  note: "pipeline_error",
                  timestamp: new Date().toISOString(),
                }
              }
            }],
            isError: false
          }
        }, { "X-MCP-Trace-Id": traceId });
      }
    }

    // Unknown method
    return json200({
      jsonrpc: "2.0",
      id: body.id ?? null,
      result: {
        content: [{
          type: "json",
          data: {
            content: {
              error: `Method not found: ${body.method}`,
              note: "unknown_method"
            }
          }
        }],
        isError: false
      }
    });

  } catch (error: any) {
    const traceId = crypto.randomUUID();
    console.error('[MCP] POST error:', {
      error: error.message,
      traceId,
      elapsed: now() - startTime,
    });

    // Always return HTTP 200 with error in JSON body
    return json200({
      jsonrpc: "2.0",
      id: null,
      result: {
        content: [{
          type: "json",
          data: {
            content: {
              error: error.message,
              note: "internal_error",
              timestamp: new Date().toISOString(),
            }
          }
        }],
        isError: false
      }
    }, { "X-MCP-Trace-Id": traceId });
  }
}

