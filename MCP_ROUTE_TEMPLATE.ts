// ============================================
// Hera AI - MCP Integration Layer
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
// Version: Phase 0 - MVP
// Tools: search_jobs, build_search_links, get_user_applications
// ============================================

import { NextRequest, NextResponse } from 'next/server';

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
// Deep Link Generator Utility
// ============================================
function buildSearchLinks(args: {
  job_title: string;
  city: string;
  platforms?: string[];
  posted_within_days?: number;
}) {
  const {
    job_title,
    city,
    platforms = ['linkedin', 'seek', 'jora', 'adzuna'],
    posted_within_days = 7,
  } = args;

  const links: Array<{ platform: string; url: string; label: string }> = [];

  // LinkedIn
  if (platforms.includes('linkedin')) {
    const daysInSeconds = posted_within_days * 86400;
    links.push({
      platform: 'linkedin',
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
        job_title
      )}&location=${encodeURIComponent(
        city + ', Australia'
      )}&f_TPR=r${daysInSeconds}`,
      label: 'Open on LinkedIn',
    });
  }

  // SEEK
  if (platforms.includes('seek')) {
    const slugify = (str: string) =>
      str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    links.push({
      platform: 'seek',
      url: `https://www.seek.com.au/${slugify(job_title)}-jobs/in-${slugify(
        city
      )}?daterange=${posted_within_days}`,
      label: 'Open on SEEK',
    });
  }

  // Jora
  if (platforms.includes('jora')) {
    links.push({
      platform: 'jora',
      url: `https://au.jora.com/j?sp=search&q=${encodeURIComponent(
        job_title
      )}&l=${encodeURIComponent(city + ' VIC')}`,
      label: 'Open on Jora',
    });
  }

  // Adzuna
  if (platforms.includes('adzuna')) {
    links.push({
      platform: 'adzuna',
      url: `https://www.adzuna.com.au/search?q=${encodeURIComponent(
        job_title
      )}&w=${encodeURIComponent(city)}`,
      label: 'Open on Adzuna',
    });
  }

  return links;
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

  // Tools manifest
  const tools = [
    // Tool 1: Search Jobs
    {
      name: 'search_jobs',
      description:
        'Search for jobs using Hera\'s intelligent job aggregation system. Automatically determines whether to use Hot Jobs database (pre-analyzed, high-quality matches) or real-time platform scraping (LinkedIn, SEEK, Jora, Adzuna). Returns jobs with AI-powered match scores and detailed analysis.',
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description:
              "Target job title or role (e.g., 'Software Engineer', 'HR Manager', 'Data Analyst', 'xmas casual')",
          },
          city: {
            type: 'string',
            description:
              "City name for job location (e.g., 'Melbourne', 'Sydney', 'Brisbane')",
          },
          platform: {
            type: 'string',
            enum: ['all', 'linkedin', 'seek', 'jora', 'adzuna'],
            description:
              "Specific job platform to search. Use 'all' for multi-source aggregation (recommended). Default: 'all'",
            default: 'all',
          },
          limit: {
            type: 'integer',
            description:
              'Maximum number of jobs to return (1-100). Default: 25',
            minimum: 1,
            maximum: 100,
            default: 25,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 2: Build Search Links
    {
      name: 'build_search_links',
      description:
        'Generate direct search URLs for major job platforms (LinkedIn, SEEK, Jora, Adzuna) with pre-filled search parameters. Useful for expanding job search beyond Hera\'s aggregation. Returns clickable links.',
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: "Job title or keywords (e.g., 'data analyst')",
          },
          city: {
            type: 'string',
            description: "City name (e.g., 'Sydney')",
          },
          platforms: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['linkedin', 'seek', 'jora', 'adzuna'],
            },
            description:
              "Which platforms to generate links for. Default: ['linkedin', 'seek', 'jora', 'adzuna']",
            default: ['linkedin', 'seek', 'jora', 'adzuna'],
          },
          posted_within_days: {
            type: 'integer',
            description:
              'Filter by posting date (e.g., 7 for last week). Default: 7',
            minimum: 1,
            maximum: 365,
            default: 7,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },

    // Tool 3: Get User Applications
    {
      name: 'get_user_applications',
      description:
        "Retrieve user's job application history including saved jobs, tailored resumes, cover letters, and application status. Helps track job search progress and manage applications. Read-only; no data will be modified.",
      input_schema: {
        type: 'object',
        properties: {
          user_email: {
            type: 'string',
            format: 'email',
            description:
              "User's email address to fetch application history. Email used only for lookups; never stored from this call.",
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

// Tool 1: Search Jobs
async function handleSearchJobs(args: any) {
  const { job_title, city, platform = 'all', limit = 25 } = args;

  if (!job_title || !city) {
    throw new Error('job_title and city are required');
  }

  // Call existing API (no changes to business logic)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  const apiUrl = `${baseUrl}/api/job-fetch-service?jobTitle=${encodeURIComponent(
    job_title
  )}&city=${encodeURIComponent(city)}&platform=${platform}&limit=${Math.min(
    limit,
    100
  )}`;

  console.log(`[MCP search_jobs] Calling: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Job search failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Return result (preserve existing API format)
  return NextResponse.json({
    content: {
      jobs: data.jobs.slice(0, limit),
      total: data.jobs.length,
      source: data.source,
      isHotJob: data.isHotJob,
    },
  });
}

// Tool 2: Build Search Links
async function handleBuildSearchLinks(args: any) {
  const { job_title, city, platforms, posted_within_days } = args;

  if (!job_title || !city) {
    throw new Error('job_title and city are required');
  }

  const links = buildSearchLinks({
    job_title,
    city,
    platforms,
    posted_within_days,
  });

  return NextResponse.json({
    content: {
      links,
      total: links.length,
    },
  });
}

// Tool 3: Get User Applications
async function handleGetApplications(args: any) {
  const { user_email, status_filter = 'all' } = args;

  if (!user_email) {
    throw new Error('user_email is required');
  }

  // Call existing API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
  const apiUrl = `${baseUrl}/api/applications?email=${encodeURIComponent(
    user_email
  )}`;

  console.log(`[MCP get_user_applications] Calling: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to retrieve applications');
  }

  // Optional: filter by status
  let applications = data.applications || [];

  if (status_filter !== 'all') {
    applications = applications.filter(
      (app: any) => app.applicationStatus === status_filter
    );
  }

  return NextResponse.json({
    content: {
      applications,
      total: applications.length,
      userProfile: data.userProfile,
    },
  });
}



