import { NextRequest, NextResponse } from 'next/server';
import { getCareerAdvice } from '@/gpt-services/assistant/careerAdvice';

export async function POST(request: NextRequest) {
  try {
    const { profile, latestPreferences, question, context, replyLang } = await request.json();

    if (!profile || !latestPreferences || !question) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const advice = await getCareerAdvice({
      profile,
      latestPreferences,
      question,
      context,
      replyLang
    });

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('Career advice error:', error);
    return NextResponse.json(
      { error: 'Failed to get career advice' },
      { status: 500 }
    );
  }
} 