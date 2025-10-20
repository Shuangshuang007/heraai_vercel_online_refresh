import { NextRequest, NextResponse } from 'next/server';
import { addResumeToProfile, upsertJobApplication } from '@/services/profileDatabaseService';
import { uploadPDF } from '@/services/gridfsService';

// 让这个路由跑在 Node 运行时（Edge 不允许 http 出站）
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { resumeData, settings, format = 'pdf', jobId } = await req.json();
    
    // 使用环境变量配置服务URL
    const resumeServiceUrl = process.env.RESUME_PDF_SERVICE_URL;
    if (!resumeServiceUrl) {
      throw new Error('RESUME_PDF_SERVICE_URL environment variable is not set');
    }
    
    // 调用Playwright后端服务
    const response = await fetch(`${resumeServiceUrl}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        settings,
        format
      })
    });
    
    if (!response.ok) {
      throw new Error(`Backend service error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      let gridfsId: string | null = null; // 声明在外部作用域
      
      // 保存PDF到GridFS并记录到用户Profile（云备份）
      if (resumeData.profile?.email && format === 'pdf') {
        try {
          // 读取生成的PDF文件内容
          const pdfResponse = await fetch(`${resumeServiceUrl}${result.downloadUrl}`);
          if (!pdfResponse.ok) {
            throw new Error('Failed to fetch generated PDF');
          }
          
          const pdfBuffer = await pdfResponse.arrayBuffer();
          
          // 上传到GridFS
          gridfsId = await uploadPDF(Buffer.from(pdfBuffer), result.filename || 'Generated Resume');
          
          // 构建动态下载URL - 支持生产环境和本地开发
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
          const downloadUrl = `${baseUrl}/api/download-resume/${gridfsId}`;
          
          // 根据是否有jobId决定保存位置
          if (jobId) {
            // Tailor Resume：保存到applications数组
            await upsertJobApplication(resumeData.profile.email, jobId, {
              resumeTailor: {
                gridfsId: gridfsId,
                downloadUrl: downloadUrl,
                filename: result.filename || 'Generated Resume'
              }
            });
            console.log(`[Resume API] Tailored resume saved to Application for ${resumeData.profile.email}, jobId: ${jobId}`);
          } else {
            // Profile Resume：保存到resumes数组（原有逻辑）
            await addResumeToProfile(resumeData.profile.email, {
              id: `resume_${Date.now()}`,
              name: result.filename || 'Generated Resume',
              gridfsId: gridfsId,
              downloadUrl: downloadUrl,
              type: 'ProfileResume'
            });
            console.log(`[Resume API] Profile resume saved to resumes array for ${resumeData.profile.email}`);
          }
        } catch (profileError) {
          console.warn('[Resume API] Failed to save ProfileResume to GridFS/profile:', profileError);
          // 不影响主要功能，只记录警告
        }
      }
      
      // 返回成功响应
      let finalDownloadUrl = gridfsId ? `/api/download-resume/${gridfsId}` : `/api/resume-proxy/${encodeURIComponent(result.filename)}`;
      
      return NextResponse.json({
        success: true,
        filename: result.filename,
        downloadUrl: finalDownloadUrl, // ✅ 优先使用GridFS，备选使用代理
        format: result.format,
        message: result.message
      });
    } else {
      throw new Error(result.error || 'Resume generation failed');
    }
    
  } catch (error) {
    console.error('Resume generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}

// GET方法用于测试
export async function GET() {
  try {
    // 补上变量定义 - 使用环境变量配置服务URL
    const resumeServiceUrl = process.env.RESUME_PDF_SERVICE_URL;
    if (!resumeServiceUrl) {
      throw new Error('RESUME_PDF_SERVICE_URL environment variable is not set');
    }
    
    // 简单的健康检查或获取下载URL
    const response = await fetch(`${resumeServiceUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    
    const result = await response.text();
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Health check passed',
      data: result
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
} 