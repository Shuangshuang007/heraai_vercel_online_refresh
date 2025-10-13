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
import { connectToMongoDB } from '../../../services/jobDatabaseService';
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

// 极简卡片：只显示职位、公司、地点（避免iOS渲染失败）
function buildMarkdownCards(q: { title: string; city: string }, jobs: any[], total: number) {
  const cards = jobs.slice(0, 5).map((j: any, idx: number) => {
    const title = (j.title || "").replace(/[–—]/g, "-").trim();
    const company = (j.company || "").trim();
    const loc = (j.location || "").trim();

    return `${idx + 1}. ${title}\n   ${company}\n   ${loc}`;
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
  title: string;
  city: string;
  page?: number;
  pageSize?: number;
  postedWithinDays?: number;
  platforms?: string[];
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
  } = params;

  try {
    const { db } = await connectToMongoDB();
    const collection = db.collection('hera_jobs.jobs');

    // Build query filter
    const filter: any = {
      title: { $regex: title, $options: 'i' },
      location: { $regex: city, $options: 'i' },
      is_active: { $ne: false }
    };

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

    // Projection: Only necessary fields
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
          name: "search_jobs",
          description: HERA_MCP_MODE === "fast" 
            ? "FAST: Lightweight search by title+city, newest first, paginated."
            : "FULL: Deep search with GPT analysis and scoring.",
          inputSchema: {
            type: "object",
            properties: {
              job_title: { 
                type: "string", 
                minLength: 1, 
                description: "e.g., 'software engineer'" 
              },
              city: { 
                type: "string", 
                minLength: 1, 
                description: "e.g., 'Melbourne'" 
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
            required: ["job_title", "city"],
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
            
            const safeJobs = src.slice(0, limit).map(mapJobSafe);
            
            // 生成多个独立的text content（每个职位一个text块）
            const content = [
              {
                type: "text",
                text: `### 🔎 Top ${safeJobs.length} ${jobTitle} roles in ${city}`
              },
              ...safeJobs.slice(0, 5).map((job: any, index: number) => ({
                type: "text",
                text: `**${index + 1}) ${job.title}**  \n🏢 ${job.company}  \n📍 ${job.location}`
              })),
              {
                type: "text",
                text: `Total found: **${result?.total || safeJobs.length}** · Page **${1}**  \nReply *"more"* to view additional results.`
              }
            ];

            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id ?? null,
              result: {
                content,
                isError: false
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
                  isError: false
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
