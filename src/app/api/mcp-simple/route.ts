// ============================================
// Hera AI - MCP Ultra Simple Endpoint
// ============================================
// This is the simplest possible MCP endpoint for ChatGPT validation

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// GET /api/mcp-simple - Return Static Tools
// ============================================

export async function GET() {
  // Return static tools immediately
  const response = {
    tools: [
      {
        name: 'search_jobs',
        description: 'Search for jobs',
        input_schema: {
          type: 'object',
          properties: {
            job_title: { type: 'string' },
            city: { type: 'string' }
          },
          required: ['job_title', 'city']
        }
      }
    ]
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'application/json'
    }
  });
}

// ============================================
// POST /api/mcp-simple - Return Static Data
// ============================================

export async function POST() {
  // Return static test data immediately
  const response = {
    content: {
      jobs: [
        { title: 'Test Job 1', company: 'Test Company' },
        { title: 'Test Job 2', company: 'Sample Corp' }
      ],
      total: 2
    }
  };

  return NextResponse.json(response);
}
