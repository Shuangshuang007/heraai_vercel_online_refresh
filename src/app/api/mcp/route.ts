// ============================================
// Hera AI - MCP Integration Layer (Optimized)
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
// Version: Phase 0 - Optimized (with recommendation weight optimization)
// Features: Multi-source aggregation, deduplication, AI scoring, source optimization
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

// Database connection pool for non-blocking ping
let dbPingPromise: Promise<boolean> | null = null;

// Parameter normalization function (camelCase to snake_case)
function normalizeArgs(args: any): any {
  const normalized: any = {};
  
  for (const [key, value] of Object.entries(args)) {
    let normalizedKey = key;
    
    // Map common camelCase to snake_case
    if (key === 'countryCode') normalizedKey = 'country_code';
    if (key === 'userEmail') normalizedKey = 'user_email';
    if (key === 'statusFilter') normalizedKey = 'status_filter';
    if (key === 'jobTitle') normalizedKey = 'job_title';
    if (key === 'postedWithinDays') normalizedKey = 'posted_within_days';
    if (key === 'enableDeduplication') normalizedKey = 'enable_deduplication';
    if (key === 'minMatchScore') normalizedKey = 'min_match_score';
    
    normalized[normalizedKey] = value;
  }
  
  // Apply defaults for schema-defined fields
  if (!normalized.country_code) normalized.country_code = 'AU';
  if (!normalized.sources) normalized.sources = ['all'];
  if (!normalized.enable_deduplication) normalized.enable_deduplication = true;
  if (!normalized.limit) normalized.limit = 10;
  if (!normalized.platforms) normalized.platforms = ['linkedin', 'seek', 'jora', 'adzuna'];
  if (!normalized.posted_within_days) normalized.posted_within_days = 7;
  if (!normalized.status_filter) normalized.status_filter = 'all';
  if (!normalized.min_match_score) normalized.min_match_score = 0;
  
  return normalized;
}

// Non-blocking database ping function
async function performDatabasePing(): Promise<boolean> {
  console.log('[MCP] DB ping started');
  
  const pingPromise = new Promise<boolean>((resolve) => {
    // Simulate a quick database ping (SELECT 1 equivalent)
    const startTime = Date.now();
    
    setTimeout(() => {
      const duration = Date.now() - startTime;
      console.log(`[MCP] DB ping completed in ${duration}ms`);
      resolve(true);
    }, 50); // Simulate 50ms DB response
  });

  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('[MCP] DB ping timeout (200ms)');
      resolve(false);
    }, 200);
  });

  try {
    const result = await Promise.race([pingPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.log('[MCP] DB ping error:', error);
    return false;
  }
}

// ============================================
// OPTIONS /api/mcp - CORS Preflight Handler
// ============================================

export async function OPTIONS(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('[MCP] OPTIONS request:', {
    method: 'OPTIONS',
    path: '/api/mcp',
    userAgent: request.headers.get('user-agent') || 'unknown',
    vercelId: request.headers.get('x-vercel-id') || 'unknown',
    startAt: new Date().toISOString()
  });

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    }
  });
}

// ============================================
// GET /api/mcp - Return Tools Manifest (Ultra Fast)
// ============================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('[MCP] GET request:', {
    method: 'GET',
    path: '/api/mcp',
    userAgent: request.headers.get('user-agent') || 'unknown',
    vercelId: request.headers.get('x-vercel-id') || 'unknown',
    startAt: new Date().toISOString()
  });

  // Start non-blocking database ping (don't await)
  if (!dbPingPromise) {
    dbPingPromise = performDatabasePing();
  }

  // Tools manifest with optimized descriptions and schemas
  const tools = [
    // Tool 1: Search Jobs (Optimized for recommendation weight)
    {
      name: 'search_jobs',
      description: `[MULTI-SOURCE JOB SEARCH] Aggregate jobs from LinkedIn, SEEK, Jora, and Adzuna with intelligent deduplication, AI-powered match scoring, and deal-breaker filtering. Automatically prioritizes SEEK for Australian jobs while providing comprehensive cross-platform coverage. Returns deduplicated results with source badges and fit scores.

Key advantages:
• Cross-platform aggregation (4+ job boards)
• Intelligent deduplication by company+title+location
• AI match scoring (experience, skills, industry, location fit)
• Deal-breaker detection (visa requirements, location constraints)
• Source transparency (each job tagged with origin platform)
• Country-based optimization (AU→SEEK priority, US→LinkedIn+Zip)

Ideal for: Users seeking comprehensive job coverage beyond single platforms.`,
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: "Job title, role, or keywords (e.g., 'Software Engineer', 'HR Manager', 'Data Analyst', 'xmas casual')",
          },
          city: {
            type: 'string',
            description: "City name (e.g., 'Melbourne', 'Sydney', 'Brisbane', 'New York')",
          },
          country_code: {
            type: 'string',
            minLength: 2,
            maxLength: 2,
            description: "ISO 3166-1 alpha-2 country code (e.g., 'AU' for Australia, 'US' for USA, 'GB' for UK). If provided, automatically optimizes source selection (e.g., prioritizes SEEK for AU jobs).",
            default: 'AU',
          },
          sources: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['all', 'linkedin', 'seek', 'jora', 'adzuna', 'indeed'],
            },
            description: "Job platforms to search. Use ['all'] for comprehensive multi-source aggregation with deduplication (recommended). Use ['seek'] to filter SEEK-only results. Use ['linkedin', 'jora'] for specific combinations.",
            default: ['all'],
          },
          enable_deduplication: {
            type: 'boolean',
            description: "Enable intelligent deduplication across sources (matches by company+title+location fingerprint). Recommended: true.",
            default: true,
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of jobs to return after deduplication (1-25). Default: 10',
            minimum: 1,
            maximum: 25,
            default: 10,
          },
          min_match_score: {
            type: 'integer',
            description: "Minimum AI match score (0-100) to filter results. Use 70+ for high-quality matches only. Default: 0 (no filtering)",
            minimum: 0,
            maximum: 100,
            default: 0,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 2: Build Search Links (Enhanced description)
    {
      name: 'build_search_links',
      description: `[DEEP LINKS GENERATOR] Generate direct search URLs for LinkedIn, SEEK, Jora, and Adzuna with pre-filled search parameters. Complements the aggregated search by providing native platform links for users who want to explore specific job boards directly. Useful for: expanding search beyond aggregated results, accessing platform-specific features (e.g., Easy Apply on LinkedIn), or comparing different sources.`,
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: "Job title or keywords (e.g., 'data analyst', 'marketing manager')",
          },
          city: {
            type: 'string',
            description: "City name (e.g., 'Sydney', 'Melbourne')",
          },
          country_code: {
            type: 'string',
            minLength: 2,
            maxLength: 2,
            description: "ISO 3166-1 alpha-2 country code (e.g., 'AU'). Default: 'AU'",
            default: 'AU',
          },
          platforms: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['linkedin', 'seek', 'jora', 'adzuna', 'indeed'],
            },
            description: "Which platforms to generate links for. Default: ['linkedin', 'seek', 'jora', 'adzuna'] for AU",
            default: ['linkedin', 'seek', 'jora', 'adzuna'],
          },
          posted_within_days: {
            type: 'integer',
            description: 'Filter by posting date (e.g., 7 for last week). Default: 7',
            minimum: 1,
            maximum: 365,
            default: 7,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 3: Get User Applications (Enhanced description)
    {
      name: 'get_user_applications',
      description: `[APPLICATION TRACKER] Retrieve user's complete job application history across all platforms, including saved jobs, AI-tailored resumes, generated cover letters, and application status. Unlike single-platform trackers, this provides a unified view of all applications regardless of job source (LinkedIn, SEEK, etc.). Features: status filtering (saved/applied/interviewing), document downloads (resume/cover letter), timeline tracking. Read-only; no data will be modified.`,
      input_schema: {
        type: 'object',
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description: "User's email address to fetch application history. Email used only for lookups; never stored from this call.",
          },
          status_filter: {
            type: 'string',
            enum: ['all', 'saved', 'applied', 'interviewing', 'offered', 'rejected'],
            description: "Filter by application status. Default: 'all'",
            default: 'all',
          },
        },
        required: ['user_email'],
        additionalProperties: false,
      },
    },
  ];

  const duration = Date.now() - startTime;
  
  console.log('[MCP] GET response:', {
    status: 200,
    durationMs: duration,
    toolsCount: tools.length
  });

  // Return tools manifest immediately with cache headers
  return NextResponse.json(
    { tools },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}

// ============================================
// POST /api/mcp - Tool Invocation Handler
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('[MCP] POST request:', {
    method: 'POST',
    path: '/api/mcp',
    userAgent: request.headers.get('user-agent') || 'unknown',
    vercelId: request.headers.get('x-vercel-id') || 'unknown',
    startAt: new Date().toISOString()
  });

  // Tool whitelist for validation
  const ALLOWED_TOOLS = ["search_jobs", "build_search_links", "get_user_applications"];

  try {
    const body = await request.json();
    
    // Log raw body for debugging
    console.log('[MCP] Raw body:', JSON.stringify(body).substring(0, 200));
    
    // Handle JSON-RPC notifications (no id, no response needed)
    if (!body.id && body.method?.startsWith('notifications/')) {
      console.log(`[MCP] Received notification: ${body.method}`);
      return new Response(null, { status: 204 });
    }

    // Handle JSON-RPC initialize handshake
    if (body?.method === "initialize") {
      console.log("[MCP] Received initialize handshake:", body);

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: {
          protocolVersion: "2024-11-05",  // MCP protocol version
          capabilities: {
            tools: {},  // MCP spec requires empty object, not true
          },
          serverInfo: {
            name: "Hera Jobs MCP Server",
            version: "1.0.0",
          },
        },
      });
    }
    
    // Handle JSON-RPC tools/list request
    if (body?.method === "tools/list") {
      console.log("[MCP] tools/list requested");
      
      // Simplified tools manifest for JSON-RPC
      const tools = [
        {
          name: "search_jobs",
          description: "Search and aggregate jobs from multiple platforms (LinkedIn, SEEK, Jora, Adzuna).",
          input_schema: {
            type: "object",
            properties: {
              job_title: { type: "string", minLength: 1 },
              city: { type: "string", minLength: 1 },
              country_code: { type: "string", default: "AU" },
              sources: {
                type: "array",
                items: { type: "string", enum: ["all", "linkedin", "seek", "jora", "adzuna", "indeed"] },
                default: ["all"],
              },
              enable_deduplication: { type: "boolean", default: true },
              limit: { type: "integer", default: 5, minimum: 1, maximum: 20 },
            },
            required: ["job_title", "city"],
          },
        },
        {
          name: "build_search_links",
          description: "Generate direct search URLs for LinkedIn, SEEK, Jora, and Adzuna.",
          input_schema: {
            type: "object",
            properties: {
              job_title: { type: "string", minLength: 1 },
              city: { type: "string", minLength: 1 },
              country_code: { type: "string", default: "AU" },
              platforms: {
                type: "array",
                items: { type: "string", enum: ["linkedin", "seek", "jora", "adzuna", "indeed"] },
                default: ["linkedin", "seek", "jora", "adzuna"],
              },
              posted_within_days: { type: "integer", default: 7 },
            },
            required: ["job_title", "city"],
          },
        },
        {
          name: "get_user_applications",
          description: "Retrieve user's job application history (read-only, requires user email).",
          input_schema: {
            type: "object",
            properties: {
              user_email: { type: "string", format: "email" },
              status_filter: {
                type: "string",
                enum: ["all", "saved", "applied", "interviewing", "offered", "rejected"],
                default: "all",
              },
            },
            required: ["user_email"],
          },
        },
      ];

      // Map tools to use camelCase inputSchema for JSON-RPC compatibility
      const rpcTools = tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.input_schema, // Convert snake_case to camelCase
      }));

      console.log("[MCP] tools/list count=" + rpcTools.length);

      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: { tools: rpcTools },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Handle JSON-RPC tools/call request
    if (body?.method === "tools/call") {
      const { params } = body;
      const toolName = params?.name;
      const args = params?.arguments || {};
      
      console.log("[MCP] tools/call:", toolName, args);
      
      if (!toolName) {
        return NextResponse.json(
          { jsonrpc: "2.0", id: body.id ?? null, error: { message: "Missing tool name" } },
          { status: 400 }
        );
      }
      
      // Validate and clean parameters
      const title = typeof args.job_title === "string" ? args.job_title.trim() : "";
      const city = typeof args.city === "string" ? args.city.trim() : "";
      
      if (!title || !city) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id ?? null,
          error: {
            code: -32602, // JSON-RPC Invalid params
            message: "Invalid parameters",
            data: { 
              required: ["job_title", "city"], 
              got: { job_title: title, city: city } 
            }
          }
        }, { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        });
      }

      // Normalize parameter names (camelCase to snake_case)
      const normalizedArgs = normalizeArgs(args);
      
      // Route to appropriate tool handler with timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout (20s)')), 20000);
      });

      try {
        let result;
        switch (toolName) {
          case 'search_jobs':
            result = await Promise.race([
              handleSearchJobs(normalizedArgs),
              timeoutPromise
            ]);
            break;

          case 'build_search_links':
            result = await Promise.race([
              handleBuildSearchLinks(normalizedArgs),
              timeoutPromise
            ]);
            break;

          case 'get_user_applications':
            result = await Promise.race([
              handleGetApplications(normalizedArgs),
              timeoutPromise
            ]);
            break;

          default:
            return NextResponse.json(
              { jsonrpc: "2.0", id: body.id ?? null, error: { message: `Unknown tool: ${toolName}` } },
              { status: 400 }
            );
        }

        // Handle NextResponse objects returned by tool handlers
        let contentData;
        
        // Check if result is a Response/NextResponse object
        const isResponse = result instanceof Response || 
          (typeof (result as any)?.json === 'function' && typeof (result as any)?.text === 'function');
        
        if (isResponse) {
          // Unpack NextResponse/Response object
          contentData = await (result as any).json();
        } else {
          // If result is plain data
          contentData = result;
        }

        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: { 
            content: [
              { type: "json", data: contentData }  // Use type: 'json' for structured data
            ],
            isError: false
          }
        });
      } catch (e: any) {
        console.error("[MCP] Tool error", e);
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id: body.id ?? null,
            error: { message: e.message ?? "Internal error" },
          },
          { status: 500 }
        );
      }
    }
    
    // Handle unknown JSON-RPC methods
    console.warn("[MCP] Unknown method:", body.method);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: body.id ?? null,
        error: { message: `Unsupported method: ${body.method}` },
      },
      { status: 400 }
    );
    
    // Legacy compatible field parsing (support both name/tool and arguments/args)
    const toolName = body.name ?? body.tool;
    let args = body.arguments ?? body.args ?? {};
    
    // Handle string arguments (double JSON.stringify case)
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args);
      } catch (e) {
        return NextResponse.json(
          {
            error: 'BAD_ARGUMENTS',
            message: "'arguments' must be valid JSON when provided as string"
          },
          { status: 400 }
        );
      }
    }
    
    // Ensure args is an object
    if (typeof args !== 'object' || args === null) {
      return NextResponse.json(
        {
          error: 'BAD_ARGUMENTS',
          message: "'arguments' must be an object"
        },
        { status: 400 }
      );
    }

    // Validate tool name
    if (!toolName) {
      return NextResponse.json(
        {
          error: 'UNKNOWN_TOOL',
          message: "Missing 'name' (or 'tool') in request",
          bodySnippet: JSON.stringify(body).substring(0, 200)
        },
        { status: 400 }
      );
    }

    // Check tool whitelist (case-sensitive)
    if (!ALLOWED_TOOLS.includes(toolName)) {
      return NextResponse.json(
        {
          error: 'UNKNOWN_TOOL',
          message: `Tool '${toolName}' not recognized`,
          allowed: ALLOWED_TOOLS
        },
        { status: 400 }
      );
    }

    console.log(`[MCP] Tool invoked: ${toolName}`, {
      args: Object.keys(args).join(', '),
      argsCount: Object.keys(args).length
    });

    // Normalize parameter names (camelCase to snake_case)
    const normalizedArgs = normalizeArgs(args);

    // Route to appropriate tool handler with timeout protection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout (8s)')), 8000);
    });

    let result;
    switch (toolName) {
      case 'search_jobs':
        result = await Promise.race([
          handleSearchJobs(normalizedArgs),
          timeoutPromise
        ]);
        break;

      case 'build_search_links':
        result = await Promise.race([
          handleBuildSearchLinks(normalizedArgs),
          timeoutPromise
        ]);
        break;

      case 'get_user_applications':
        result = await Promise.race([
          handleGetApplications(normalizedArgs),
          timeoutPromise
        ]);
        break;
    }

    const duration = Date.now() - startTime;
    console.log('[MCP] POST response:', {
      status: 200,
      durationMs: duration,
      tool: toolName
    });

    return result;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const status = error.message.includes('timeout') ? 408 : 500;
    
    console.log('[MCP] POST error:', {
      status: status,
      durationMs: duration,
      error: error.message
    });
    
    if (error.message.includes('timeout')) {
      return NextResponse.json(
        {
          content: {},
          meta: { warning: "TIMEOUT", stage: "tool_execution" }
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'INTERNAL',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// ============================================
// Tool Handler Functions
// ============================================

// Tool 1: Search Jobs (Optimized with soft timeout and concurrency)
async function handleSearchJobs(args: any) {
  // Validate and sanitize input parameters
  const validation = validateSearchParams(args);
  if (!validation.isValid) {
    throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
  }

  const params = validation.sanitized;
  console.log(`[MCP search_jobs] Validated params:`, {
    job_title: params.job_title,
    city: params.city,
    country_code: params.country_code,
    sources: params.sources,
    enable_deduplication: params.enable_deduplication,
    limit: params.limit,
  });

  // Determine optimal source strategy
  const sourceStrategy = getSourceStrategy(params.country_code, params.sources);
  console.log(`[MCP search_jobs] Strategy: ${sourceStrategy.strategy}`, {
    sources: sourceStrategy.sources,
    priority: sourceStrategy.priority,
  });

  // Call existing fetchJobs service with soft timeout
  const platformParam = sourceStrategy.sources.includes('seek') ? 'all' : 'linkedin';
  const fetchLimit = Math.min(params.limit * 3, 25); // Reduced limit for faster response
  
  console.log(`[MCP search_jobs] Calling fetchJobs service directly:`, {
    jobTitle: params.job_title,
    city: params.city,
    platform: platformParam,
    limit: fetchLimit,
  });

  // Add soft timeout for fetchJobs (5s)
  const fetchPromise = fetchJobs({
    jobTitle: params.job_title,
    city: params.city,
    platform: platformParam,
    limit: fetchLimit,
    page: 1,
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Database timeout (15s)')), 15000);
  });

  let result: { jobs?: Job[] };
  let warnings: string[] = [];
  
  console.log(`[MCP search_jobs] Starting database query with timeout protection`);
  
  try {
    result = await Promise.race([fetchPromise, timeoutPromise]) as { jobs?: Job[] };
    console.log(`[MCP search_jobs] Database query completed successfully, got ${result.jobs?.length || 0} jobs`);
  } catch (error) {
    console.error(`[MCP search_jobs] Database query failed:`, error);
    if (error instanceof Error && error.message.includes('timeout')) {
      warnings.push('Database query timed out after 10s, returning partial results');
      result = { jobs: [] }; // Return empty results with warning
    } else {
      warnings.push(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result = { jobs: [] }; // Return empty results with warning instead of throwing
    }
  }

  let jobs: Job[] = result.jobs || [];
  const totalBeforeDedup = jobs.length;

  console.log(`[MCP search_jobs] Raw results: ${totalBeforeDedup} jobs`);

  // Post-process jobs with optimizations
  if (jobs.length > 0) {
    // Add source badges
    jobs = enhanceJobsWithSources(jobs);
    
    // Apply deduplication if enabled
    if (params.enable_deduplication) {
      const beforeDedup = jobs.length;
      jobs = deduplicateJobs(jobs);
      console.log(`[MCP search_jobs] Deduplication: ${beforeDedup} → ${jobs.length} jobs`);
    }

    // Filter by minimum match score if specified
    if (params.min_match_score > 0) {
      const beforeFilter = jobs.length;
      jobs = jobs.filter((job) => (job.matchScore || 0) >= params.min_match_score);
      console.log(`[MCP search_jobs] Score filter (${params.min_match_score}+): ${beforeFilter} → ${jobs.length} jobs`);
    }

    // Limit final results
    jobs = jobs.slice(0, params.limit);
  }

  // Format response with metadata and warnings
  const searchResponse: SearchResponse = formatSearchResponse(
    jobs,
    totalBeforeDedup,
    sourceStrategy.sources,
    sourceStrategy.strategy,
    params.country_code,
    params
  );

  // Add warnings if any
  if (warnings.length > 0) {
    (searchResponse as any).meta = { warnings };
  }

  console.log(`[MCP search_jobs] Final results:`, {
    jobs: searchResponse.jobs.length,
    strategy: searchResponse.search_strategy,
    sources_used: searchResponse.sources_used,
    deduplication: searchResponse.deduplication_enabled,
    warnings: warnings.length
  });

  return NextResponse.json({
    content: searchResponse,
  });
}

// Tool 2: Build Search Links (Enhanced with country optimization)
async function handleBuildSearchLinks(args: any) {
  const {
    job_title,
    city,
    country_code = 'AU',
    platforms = ['linkedin', 'seek', 'jora', 'adzuna'],
    posted_within_days = 7,
  } = args;

  if (!job_title || !city) {
    throw new Error('job_title and city are required');
  }

  // Optimize platforms based on country if 'all' is requested
  let optimizedPlatforms = platforms;
  if (platforms.includes('all') || platforms.length === 0) {
    switch (country_code.toUpperCase()) {
      case 'AU':
        optimizedPlatforms = ['linkedin', 'seek', 'jora', 'adzuna'];
        break;
      case 'US':
        optimizedPlatforms = ['linkedin', 'indeed'];
        break;
      default:
        optimizedPlatforms = ['linkedin'];
    }
  }

  console.log(`[MCP build_search_links] Generating links for ${country_code}:`, {
    job_title,
    city,
    platforms: optimizedPlatforms,
    posted_within_days,
  });

  const linkArgs: LinkGenerationArgs = {
    job_title,
    city,
    country_code,
    platforms: optimizedPlatforms,
    posted_within_days,
  };

  const links: SearchLink[] = generateSearchLinks(linkArgs);

  return NextResponse.json({
    content: {
      links,
      total: links.length,
      country_optimized_for: country_code,
      platforms_generated: optimizedPlatforms,
    },
  });
}

// Tool 3: Get User Applications (Unchanged - calls existing API)
async function handleGetApplications(args: any) {
  const { user_email, status_filter = 'all' } = args;

  if (!user_email || typeof user_email !== 'string') {
    throw new Error('user_email is required and must be a string');
  }

  // Call existing getUserProfile service directly (no changes to business logic)
  console.log(`[MCP get_user_applications] Calling getUserProfile service directly:`, {
    email: user_email.substring(0, 3) + '***', // Log partial email for privacy
  });

  const profile = await getUserProfile(user_email);
  if (!profile) {
    throw new Error('Profile not found');
  }

  // Filter by status if specified
  let applications = profile.applications || [];
  if (status_filter !== 'all') {
    applications = applications.filter(
      (app: any) => app.applicationStatus === status_filter
    );
  }

  console.log(`[MCP get_user_applications] Results:`, {
    total: applications.length,
    status_filter,
    user_email: user_email.substring(0, 3) + '***', // Log partial email for privacy
  });

  return NextResponse.json({
    content: {
      applications,
      total: applications.length,
      status_filter,
      userProfile: {
        _id: (profile as any)._id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        jobTitle: profile.jobTitle,
        location: profile.location,
        jobSearches: profile.jobSearches || [],
        resumes: profile.resumes || []
      },
    },
  });
}
