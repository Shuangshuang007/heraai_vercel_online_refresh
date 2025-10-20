import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const backendUrl = process.env.NEXT_PUBLIC_ADZUNA_API_BASE ?? (
  isProd
    ? (() => { throw new Error('Missing NEXT_PUBLIC_ADZUNA_API_BASE in production') })()
    : 'http://localhost:4003'
);

export async function GET(req: NextRequest) {
  // --- TEMPORARY DEBUGGING LOG ---
  console.log('Vercel Function Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    ADZUNA_API_BASE: process.env.NEXT_PUBLIC_ADZUNA_API_BASE,
  });
  // --- END OF DEBUGGING LOG ---

  const { searchParams } = new URL(req.url);
  const jobTitle = searchParams.get('jobTitle') || '';
  const city = searchParams.get('city') || '';
  const limit = searchParams.get('limit') || '100';

  const apiUrl = `${backendUrl}/api/adzuna-jobs?jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(city)}&limit=${limit}`;

  try {
    const response = await fetch(apiUrl);
    const text = await response.text();
    console.log('Adzuna fetch url:', apiUrl, 'status:', response.status, 'body:', text.slice(0, 200));

    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream API error', status: response.status, detail: text }, { status: 500 });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Adzuna fetch error:', err);
    return NextResponse.json({ error: 'Internal error', detail: String(err) }, { status: 500 });
  }
}
