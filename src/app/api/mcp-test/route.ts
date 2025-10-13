// ============================================
// Hera AI - MCP Test Endpoint (Ultra Fast)
// ============================================
// This is a minimal test endpoint specifically for ChatGPT Connector validation
// It returns static data without any database connections

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// GET /api/mcp-test - Return Minimal Tools Manifest
// ============================================

export async function GET(request: NextRequest) {
  console.log('[MCP-Test] GET request received');

  // Minimal tools manifest for testing
  const tools = [
    {
      name: 'search_jobs',
      description: 'Search jobs from multiple platforms with AI-powered matching',
      input_schema: {
        type: 'object',
        properties: {
          job_title: {
            type: 'string',
            description: 'Job title or keywords',
          },
          city: {
            type: 'string',
            description: 'City name',
          },
          limit: {
            type: 'integer',
            description: 'Number of jobs to return (1-5)',
            minimum: 1,
            maximum: 5,
            default: 3,
          },
        },
        required: ['job_title', 'city'],
        additionalProperties: false,
      },
    },
  ];

  // Return immediately with cache headers
  return NextResponse.json(
    { tools },
    {
      headers: {
        'Cache-Control': 'public, max-age=600', // 10 minutes cache
        'Content-Type': 'application/json',
      },
    }
  );
}

// ============================================
// POST /api/mcp-test - Minimal Tool Response
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    console.log(`[MCP-Test] Tool invoked: ${name}`);

    // Return minimal test data
    if (name === 'search_jobs') {
      return NextResponse.json({
        content: {
          jobs: [
            {
              id: 'test-1',
              title: 'Software Engineer',
              company: 'Test Company',
              location: 'Melbourne, AU',
              source: 'test',
              matchScore: 85,
            },
            {
              id: 'test-2',
              title: 'Data Analyst',
              company: 'Sample Corp',
              location: 'Sydney, AU',
              source: 'test',
              matchScore: 80,
            },
          ],
          total: 2,
          message: 'Test data - this is a minimal endpoint for ChatGPT validation',
        },
      });
    }

    return NextResponse.json(
      { error: 'Unknown tool', code: 'INVALID_TOOL' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[MCP-Test] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}



