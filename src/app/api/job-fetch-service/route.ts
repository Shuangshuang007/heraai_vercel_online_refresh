import { NextRequest, NextResponse } from 'next/server';
import { fetchJobs } from '../../../services/jobFetchService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle') || '';
  const city = searchParams.get('city') || '';
  const platform = searchParams.get('platform') || '';
  const limit = parseInt(searchParams.get('limit') || '600');
  const page = parseInt(searchParams.get('page') || '1');
  
  try {
    console.log(`[JobFetchService API] Received request: jobTitle=${jobTitle}, city=${city}, platform=${platform}`);
    
    const result = await fetchJobs({
      jobTitle,
      city,
      limit,
      page,
      platform
    });
    
    console.log(`[JobFetchService API] Returning ${result.jobs.length} jobs`);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('[JobFetchService API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
} 