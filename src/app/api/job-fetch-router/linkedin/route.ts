import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const backendUrl = process.env.NEXT_PUBLIC_LINKEDIN_API_BASE ?? (
  isProd
    ? (() => { throw new Error('Missing NEXT_PUBLIC_LINKEDIN_API_BASE in production') })()
    : 'http://localhost:4001'
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get('keywords') || '';
  const location = searchParams.get('location') || '';
  const limit = searchParams.get('limit') || '100';

  const apiUrl = `${backendUrl}/api/linkedin-jobs?jobTitle=${encodeURIComponent(keywords)}&city=${encodeURIComponent(location)}&limit=${limit}`;

  try {
    const response = await fetch(apiUrl);
    const text = await response.text();  // 更安全，防止解析失败
    console.log('LinkedIn fetch url:', apiUrl, 'status:', response.status, 'body:', text.slice(0, 200));

    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream API error', status: response.status, detail: text }, { status: 500 });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('LinkedIn fetch error:', err);
    return NextResponse.json({ error: 'Internal error', detail: String(err) }, { status: 500 });
  }
} 