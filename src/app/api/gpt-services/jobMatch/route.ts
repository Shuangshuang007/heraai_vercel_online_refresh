import { NextResponse } from 'next/server';
import { matchJobWithGPT } from '@/gpt-services/jobMatch/matchJob';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 验证必要的字段
    if (!data.jobTitle || !data.jobDescription || !data.jobRequirements || !data.jobLocation || !data.userProfile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 调用 GPT 服务
    const result = await matchJobWithGPT(data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in job match API:', error);
    return NextResponse.json(
      { error: 'Failed to process job match request' },
      { status: 500 }
    );
  }
} 