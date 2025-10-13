// ============================================
// Hera AI - MCP Integration Layer (Fixed for 424 Error)
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
// Version: Fixed - Always returns HTTP 200
// Features: Trace ID, timeout protection, single database
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchJobs } from '../../../services/jobFetchService';
import { getUserProfile } from '../../../services/profileDatabaseService';
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
// 1️⃣ 顶部添加工具函数与常量
// ============================================

const JSON_HEADERS = { "Content-Type": "application/json" };
const QUERY_TIMEOUT_MS = 10000; // 数据库最大允许 10 秒
const now = () => Date.now();

function json200(data: any, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number = QUERY_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

// ============================================
// 6️⃣ fetchFromDatabase（调用现有服务）
// ============================================

async function fetchFromDatabase(jobTitle: string, city: string, limit: number): Promise<any[]> {
  try {
    console.log(`[MCP fetchFromDatabase] Querying: ${jobTitle} in ${city}`);
    
    // 调用现有的 fetchJobs 服务
    const result = await fetchJobs({
      jobTitle,
      city,
      platform: 'all',
      limit: Math.min(limit * 3, 25), // 获取更多数据用于去重
      page: 1,
    });

    let jobs: Job[] = result.jobs || [];
    
    if (jobs.length > 0) {
      // 添加源标签
      jobs = enhanceJobsWithSources(jobs);
      
      // 去重
      jobs = deduplicateJobs(jobs);
      
      // 限制结果
      jobs = jobs.slice(0, limit);
      
      // 简化对象（移除重字段）
      jobs = jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        source: job.source,
        source_label: job.source_label,
        matchScore: job.matchScore,
        url: job.url,
      }));
    }

    console.log(`[MCP fetchFromDatabase] Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('[MCP fetchFromDatabase] Error:', error);
    return [];
  }
}

// ============================================
// GET /api/mcp - Health Check (Fast Response)
// ============================================

export async function GET(request: NextRequest) {
  console.log('[MCP] GET request received');
  
  return json200({
    tools: [
      {
        name: 'search_jobs',
        description: 'Search jobs from database with intelligent deduplication',
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
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}

// ============================================
// POST /api/mcp - Main MCP Handler (Always 200)
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
      startAt: new Date().toISOString(),
    });

    // 🟢 忽略 notifications（防止 MCP 424）
    if (typeof body.method === "string" && body.method.startsWith("notifications/")) {
      console.log("[MCP] Notification:", body.method);
      return new Response(null, { status: 204 });
    }

    // ============================================
    // 3️⃣ initialize —— 返回新版协议
    // ============================================
    if (body.method === "initialize") {
      return json200({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: {
          protocolVersion: "2025-06-18",
          serverInfo: { name: "Hera AI", version: "1.0.0" },
          capabilities: { tools: {} },
        },
      });
    }

    // ============================================
    // 4️⃣ tools/list —— 列出工具（用 inputSchema）
    // ============================================
    if (body.method === "tools/list") {
      const rpcTools = [
        {
          name: "search_jobs",
          description: "Search jobs from database with intelligent deduplication.",
          inputSchema: {
            type: "object",
            properties: {
              job_title: { type: "string", minLength: 1 },
              city: { type: "string", minLength: 1 },
              limit: { type: "integer", default: 5, minimum: 1, maximum: 20 },
            },
            required: ["job_title", "city"],
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
    // 5️⃣ tools/call —— 核心逻辑（防超时 + 永远 200）
    // ============================================
    if (body.method === "tools/call") {
      const traceId = crypto.randomUUID();
      const { name, arguments: args } = body.params || {};
      console.info("[TRACE]", traceId, { start: name, args });

      try {
        if (name === "search_jobs") {
          const start = now();
          const jobTitle = String(args?.job_title || "").trim();
          const city = String(args?.city || "").trim();
          const limit = Number(args?.limit || 5);

          if (!jobTitle || !city) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              error: { code: 2, message: "Missing required parameters" },
            }, { "X-MCP-Trace-Id": traceId });
          }

          // 🧠 调用数据库（带超时保护）
          const jobs = await withTimeout(fetchFromDatabase(jobTitle, city, limit));

          const res = {
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{ 
                type: "json", 
                data: { 
                  content: { 
                    jobs, 
                    total: jobs.length,
                    query: `${jobTitle} in ${city}`,
                    timestamp: new Date().toISOString(),
                  } 
                } 
              }],
              isError: false,
            },
          };

          console.info("[TRACE]", traceId, { done: true, elapsed: now() - start });
          return json200(res, { "X-MCP-Trace-Id": traceId });

        } else if (name === "build_search_links") {
          const jobTitle = String(args?.job_title || "").trim();
          const city = String(args?.city || "").trim();
          const platforms = args?.platforms || ["linkedin", "seek", "jora", "adzuna"];

          if (!jobTitle || !city) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              error: { code: 2, message: "Missing required parameters" },
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

          const res = {
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
                  },
                },
              }],
              isError: false,
            },
          };

          console.info("[TRACE]", traceId, { done: true, elapsed: now() - startTime });
          return json200(res, { "X-MCP-Trace-Id": traceId });

        } else if (name === "get_user_applications") {
          const userEmail = String(args?.user_email || "").trim();
          const statusFilter = args?.status_filter || 'all';

          if (!userEmail) {
            return json200({
              jsonrpc: "2.0",
              id: body.id ?? null,
              error: { code: 2, message: "Missing user_email parameter" },
            }, { "X-MCP-Trace-Id": traceId });
          }

          // 调用现有服务（带超时保护）
          const profile = await withTimeout(getUserProfile(userEmail));

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
                      message: "Profile not found",
                    },
                  },
                }],
                isError: false,
              },
            }, { "X-MCP-Trace-Id": traceId });
          }

          let applications = profile.applications || [];
          if (statusFilter !== 'all') {
            applications = applications.filter(
              (app: any) => app.applicationStatus === statusFilter
            );
          }

          const res = {
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
                  },
                },
              }],
              isError: false,
            },
          };

          console.info("[TRACE]", traceId, { done: true, elapsed: now() - startTime });
          return json200(res, { "X-MCP-Trace-Id": traceId });

        } else {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: { code: 1, message: `Unknown tool: ${name}` },
          }, { "X-MCP-Trace-Id": traceId });
        }

      } catch (e: any) {
        console.warn("[TRACE]", traceId, "DB or timeout error:", e.message);

        const fallback = {
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [
              {
                type: "json",
                data: {
                  content: {
                    jobs: [],
                    error: String(e.message),
                    note: "Timeout or DB error, returned safely with HTTP 200",
                    timestamp: new Date().toISOString(),
                  },
                },
              },
            ],
            isError: false,
          },
        };

        return json200(fallback, { "X-MCP-Trace-Id": traceId });
      }
    }

    // 未知方法
    return json200({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32601, message: `Method not found: ${body.method}` },
    });

  } catch (error: any) {
    const traceId = crypto.randomUUID();
    console.error('[MCP] POST error:', {
      error: error.message,
      traceId,
      elapsed: now() - startTime,
    });

    // 即使出现未预期的错误，也返回 200
    return json200({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: "Internal error - but returned safely with HTTP 200",
        data: error.message,
      },
    }, { "X-MCP-Trace-Id": traceId });
  }
}