import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const backendUrl = process.env.NEXT_PUBLIC_SEEK_API_BASE ?? (
  isProd
    ? (() => { throw new Error('Missing NEXT_PUBLIC_SEEK_API_BASE in production') })()
    : 'http://localhost:4000'
);

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobTitle = searchParams.get('jobTitle');
  const city = searchParams.get('city');
  const limit = searchParams.get('limit') || '100';

  const apiUrl = `${backendUrl}/api/seek-jobs?jobTitle=${encodeURIComponent(jobTitle || '')}&city=${encodeURIComponent(city || '')}&limit=${limit}`;
  try {
    const response = await fetch(apiUrl);
    const text = await response.text();
    // 关键日志，帮助排查
    console.log('fetch url:', apiUrl, 'status:', response.status, 'body:', text.slice(0, 200));
    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream API error', status: response.status, detail: text }, { status: 500 });
    }
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    // 捕获 fetch 或 JSON 解析异常
    console.error('Fetch or parse error:', err);
    return NextResponse.json({ error: 'Internal error', detail: String(err) }, { status: 500 });
  }
} 