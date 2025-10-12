// ============================================
// Hera AI - MCP Public Endpoint (No Auth)
// ============================================
// This is a public version of the MCP endpoint specifically for ChatGPT Connectors
// It bypasses authentication for easier integration with ChatGPT
//
// IMPORTANT: All code in this file uses English only
// - Comments in English
// - Variable names in English
// - Error messages in English
// - Log messages in English
//
// Version: ChatGPT Connector Optimized
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
} from '../mcp/helpers';

// ============================================
// GET /api/mcp-public - Return Tools Manifest
// ============================================

export async function GET(request: NextRequest) {
  // No authentication required for ChatGPT Connectors
  console.log('[MCP-Public] GET request received');

  // Tools manifest optimized for ChatGPT
  const tools = [
    // Tool 1: Search Jobs (Optimized for ChatGPT)
    {
      name: 'search_jobs',
      description: `Search and aggregate jobs from multiple platforms (LinkedIn, SEEK, Jora, Adzuna) with intelligent deduplication and AI-powered match scoring. Automatically prioritizes SEEK for Australian jobs while providing comprehensive cross-platform coverage.

Features:
• Multi-source aggregation (4+ job boards)
• Intelligent deduplication by company+title+location
• AI match scoring (experience, skills, industry, location fit)
• Source transparency (each job tagged with origin platform)
• Country-based optimization (AU→SEEK priority, US→LinkedIn)

Perfect for: Users seeking comprehensive job coverage beyond single platforms.`,
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: "Job title, role, or keywords (e.g., 'Software Engineer', 'Data Analyst', 'Marketing Manager')",
          },
          city: {
            type: 'string',
            description: "City name (e.g., 'Melbourne', 'Sydney', 'Brisbane', 'New York')",
          },
          country_code: {
            type: 'string',
            minLength: 2,
            maxLength: 2,
            description: "ISO 3166-1 alpha-2 country code (e.g., 'AU' for Australia, 'US' for USA, 'GB' for UK). Default: 'AU'",
            default: 'AU',
          },
          sources: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['all', 'linkedin', 'seek', 'jora', 'adzuna', 'indeed'],
            },
            description: "Job platforms to search. Use ['all'] for comprehensive multi-source aggregation (recommended). Use ['seek'] for SEEK-only results.",
            default: ['all'],
          },
          enable_deduplication: {
            type: 'boolean',
            description: "Enable intelligent deduplication across sources. Recommended: true.",
            default: true,
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of jobs to return after deduplication (1-50). Default: 10',
            minimum: 1,
            maximum: 50,
            default: 10,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 2: Build Search Links
    {
      name: 'build_search_links',
      description: `Generate direct search URLs for LinkedIn, SEEK, Jora, and Adzuna with pre-filled search parameters. Useful for accessing platform-specific features or expanding search beyond aggregated results.`,
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
            description: "ISO 3166-1 alpha-2 country code. Default: 'AU'",
            default: 'AU',
          },
          platforms: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['linkedin', 'seek', 'jora', 'adzuna', 'indeed'],
            },
            description: "Which platforms to generate links for. Default: ['linkedin', 'seek', 'jora', 'adzuna']",
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

    // Tool 3: Get User Applications (Limited for public access)
    {
      name: 'get_user_applications',
      description: `Retrieve user's job application history across all platforms. Note: This is a read-only operation that requires a valid user email.`,
      input_schema: {
        type: 'object',
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description: "User's email address to fetch application history.",
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
// POST /api/mcp-public - Tool Invocation Handler
// ============================================

export async function POST(request: NextRequest) {
  // No authentication required for ChatGPT Connectors
  try {
    const body = await request.json();
    const { name, arguments: args } = body;

    console.log(`[MCP-Public] Tool invoked: ${name}`, {
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
    console.error('[MCP-Public] Error:', error);
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

// Tool 1: Search Jobs
async function handleSearchJobs(args: any) {
  // Validate and sanitize input parameters
  const validation = validateSearchParams(args);
  if (!validation.isValid) {
    throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
  }

  const params = validation.sanitized;
  console.log(`[MCP-Public search_jobs] Validated params:`, {
    job_title: params.job_title,
    city: params.city,
    country_code: params.country_code,
    sources: params.sources,
    limit: params.limit,
  });

  // Determine optimal source strategy
  const sourceStrategy = getSourceStrategy(params.country_code, params.sources);
  console.log(`[MCP-Public search_jobs] Strategy: ${sourceStrategy.strategy}`);

  // Call existing fetchJobs service directly
  const platformParam = sourceStrategy.sources.includes('seek') ? 'all' : 'linkedin';
  const fetchLimit = Math.min(params.limit * 2, 50); // Limit for public access
  
  console.log(`[MCP-Public search_jobs] Calling fetchJobs service directly`);

  const result = await fetchJobs({
    jobTitle: params.job_title,
    city: params.city,
    platform: platformParam,
    limit: fetchLimit,
    page: 1,
  });

  let jobs: Job[] = result.jobs || [];
  const totalBeforeDedup = jobs.length;

  console.log(`[MCP-Public search_jobs] Raw results: ${totalBeforeDedup} jobs`);

  // Post-process jobs with optimizations
  if (jobs.length > 0) {
    // Add source badges
    jobs = enhanceJobsWithSources(jobs);
    
    // Apply deduplication if enabled
    if (params.enable_deduplication) {
      const beforeDedup = jobs.length;
      jobs = deduplicateJobs(jobs);
      console.log(`[MCP-Public search_jobs] Deduplication: ${beforeDedup} → ${jobs.length} jobs`);
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

  console.log(`[MCP-Public search_jobs] Final results: ${searchResponse.jobs.length} jobs`);

  return NextResponse.json({
    content: searchResponse,
  });
}

// Tool 2: Build Search Links
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

  console.log(`[MCP-Public build_search_links] Generating links for ${country_code}`);

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

// Tool 3: Get User Applications
async function handleGetApplications(args: any) {
  const { user_email, status_filter = 'all' } = args;

  if (!user_email) {
    throw new Error('user_email is required');
  }

  // Call existing getUserProfile service directly
  console.log(`[MCP-Public get_user_applications] Calling getUserProfile service`);

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

  console.log(`[MCP-Public get_user_applications] Results: ${applications.length} applications`);

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
