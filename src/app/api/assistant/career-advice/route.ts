import { NextRequest, NextResponse } from 'next/server';

// 让这个路由跑在 Node 运行时（Edge 不允许 http 出站）
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { currentJob, experience, location, education, mode = 'report' } = await req.json();
    
    // 使用环境变量配置服务URL
    const careerApiUrl = process.env.CAREER_SWITCH_API_URL;
    if (!careerApiUrl) {
      throw new Error('CAREER_SWITCH_API_URL environment variable is not set');
    }
    
    console.log('[Career Advice API] Calling Vultr service:', careerApiUrl);
    
    // 调用Vultr上的Career Switch API
    const response = await fetch(`${careerApiUrl}/api/career/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentJob,
        experience,
        location,
        education,
        mode
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Career Advice API] Backend service error:', response.status, errorText);
      throw new Error(`Backend service error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('[Career Advice API] Success:', {
        from: result.from,
        candidatesCount: result.candidates?.length,
        mode: result.query?.mode
      });
      
      // 返回成功响应
      return NextResponse.json({
        success: true,
        data: result
      });
    } else {
      throw new Error(result.error || 'Career advice generation failed');
    }
    
  } catch (error) {
    console.error('[Career Advice API] Failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get career advice' 
      },
      { status: 500 }
    );
  }
}

// GET方法用于健康检查
export async function GET() {
  try {
    const careerApiUrl = process.env.CAREER_SWITCH_API_URL;
    if (!careerApiUrl) {
      throw new Error('CAREER_SWITCH_API_URL environment variable is not set');
    }
    
    // 简单的健康检查
    const response = await fetch(`${careerApiUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Career Advice API is healthy',
      backend: result
    });
    
  } catch (error) {
    console.error('[Career Advice API] Health check failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Health check failed' 
      },
      { status: 500 }
    );
  }
}
