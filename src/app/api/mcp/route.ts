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

// ============================================
// Authentication Middleware
// ============================================

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.MCP_SHARED_SECRET}`;
  
  if (!expectedToken || expectedToken === 'Bearer undefined') {
    console.error('[MCP Auth] MCP_SHARED_SECRET not configured');
    return false;
  }
  
  return authHeader === expectedToken;
}

// ============================================
// GET /api/mcp - Return Tools Manifest
// ============================================

export async function GET(request: NextRequest) {
  // Validate authentication
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing Bearer token' },
      { status: 401 }
    );
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
            description: 'Maximum number of jobs to return after deduplication (1-100). Default: 25',
            minimum: 1,
            maximum: 100,
            default: 25,
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

  return NextResponse.json({ tools });
}

// ============================================
// POST /api/mcp - Tool Invocation Handler
// ============================================

export async function POST(request: NextRequest) {
  // Validate authentication
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, arguments: args } = body;

    console.log(`[MCP] Tool invoked: ${name}`, {
      args: JSON.stringify(args).substring(0, 200),
    });

    // Route to appropriate tool handler
    switch (name) {
      case 'search_jobs':
        return await handleSearchJobs(args);

      case 'build_search_links':
        return await handleBuildSearchLinks(args);

      case 'get_user_applications':
        return await handleGetApplications(args);

      default:
        return NextResponse.json(
          {
            error: `Unknown tool: ${name}`,
            code: 'INVALID_TOOL',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[MCP] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}

// ============================================
// Tool Handler Functions
// ============================================

// Tool 1: Search Jobs (Optimized with strategy routing)
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

  // Call existing fetchJobs service directly (no changes to business logic)
  const platformParam = sourceStrategy.sources.includes('seek') ? 'all' : 'linkedin';
  const fetchLimit = Math.min(params.limit * 2, 100); // Fetch more for deduplication
  
  console.log(`[MCP search_jobs] Calling fetchJobs service directly:`, {
    jobTitle: params.job_title,
    city: params.city,
    platform: platformParam,
    limit: fetchLimit,
  });

  const result = await fetchJobs({
    jobTitle: params.job_title,
    city: params.city,
    platform: platformParam,
    limit: fetchLimit,
    page: 1,
  });

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

  // Format response with metadata
  const searchResponse: SearchResponse = formatSearchResponse(
    jobs,
    totalBeforeDedup,
    sourceStrategy.sources,
    sourceStrategy.strategy,
    params.country_code,
    params
  );

  console.log(`[MCP search_jobs] Final results:`, {
    jobs: searchResponse.jobs.length,
    strategy: searchResponse.search_strategy,
    sources_used: searchResponse.sources_used,
    deduplication: searchResponse.deduplication_enabled,
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

  if (!user_email) {
    throw new Error('user_email is required');
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
