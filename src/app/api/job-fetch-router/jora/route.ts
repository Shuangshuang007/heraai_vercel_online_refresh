import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobTitle = searchParams.get('jobTitle') || '';
  const city = searchParams.get('city') || '';
  const limit = searchParams.get('limit') || '100';

  const isProd = process.env.NODE_ENV === 'production';
  const backendUrl = process.env.NEXT_PUBLIC_JORA_API_BASE ?? (
    isProd
      ? (() => { throw new Error('Missing NEXT_PUBLIC_JORA_API_BASE in production') })()
      : 'http://localhost:4002'
  );
  const apiUrl = `${backendUrl}/api/jora-jobs?jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(city)}&limit=${limit}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Jora Crawler API' }, { status: 500 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error', detail: (error as Error).message }, { status: 500 });
  }
} 