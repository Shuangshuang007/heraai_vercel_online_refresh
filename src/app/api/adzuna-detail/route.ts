import { NextResponse } from 'next/server';

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const userEmail = searchParams.get('email');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch detail', detail: String(error) }, { status: 500 });
  }
} 