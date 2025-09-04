import { NextResponse } from 'next/server';
import { parseMessageWithGPT } from '@/gpt-services/assistant/parseMessage';

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function POST(req: Request) {
  try {
    const { message, context, jobContext } = await req.json();
    const response = await parseMessageWithGPT({ message, context, jobContext });
    console.log('GPT 原始返回:', response);
    try {
      const parsed = JSON.parse(response);
      return NextResponse.json(parsed);
    } catch (e) {
      return NextResponse.json({ action: 'none', error: 'GPT返回无法解析为JSON', debug: response });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 