import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/services/gridfsService';
import { upsertJobApplication } from '@/services/profileDatabaseService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { coverLetterContent, job, userProfile } = await req.json();

    if (!coverLetterContent || !job || !userProfile) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 格式化Cover Letter内容
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const name = userProfile.firstName && userProfile.lastName 
      ? `${userProfile.firstName} ${userProfile.lastName}` 
      : userProfile.name || 'Your Name';
    const email = userProfile.email || 'your.email@example.com';
    const phone = userProfile.phone || 'Your Phone';
    const location = userProfile.city && userProfile.country 
      ? `${userProfile.city}, ${userProfile.country}` 
      : userProfile.location || 'Your Location';

    // 使用环境变量配置服务URL
    const coverLetterServiceUrl = process.env.COVER_LETTER_PDF_SERVICE_URL;
    if (!coverLetterServiceUrl) {
      throw new Error('COVER_LETTER_PDF_SERVICE_URL environment variable is not set');
    }
    const response = await fetch(
      `${coverLetterServiceUrl}/api/generate-cover-letter-pdf`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/pdf' 
        },
        body: JSON.stringify({
          coverLetterData: {
            content: coverLetterContent,
            profile: {
              name: name,
              email: email,
              phone: phone,
              location: location
            },
            company: job.company,
            jobTitle: job.title,
            date: today
          },
          settings: {
            format: 'A4',
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Cover Letter PDF Service error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Cover letter PDF generation failed', 
          status: response.status, 
          detail: errorText 
        }), 
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 获取PDF二进制数据
    const pdfBuffer = await response.arrayBuffer();
    
    // 生成智能文件名
    const firstName = userProfile.firstName || '';
    const lastName = userProfile.lastName || '';
    const jobTitle = job.title || '';
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = currentDate.getFullYear();
    
    // 清理jobTitle，移除特殊字符，保留空格
    const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9\s]/g, '');
    
    const smartFilename = `${firstName} ${lastName}_CoverLetter_${cleanJobTitle}_${year}${month}${day}`;
    
    // 保存PDF到GridFS并记录到用户Profile（云备份）
    let gridfsId: string | null = null;
    if (userProfile?.email) {
      try {
        // 上传到GridFS
        gridfsId = await uploadPDF(Buffer.from(pdfBuffer), `${smartFilename}.pdf`);
        
        // 构建动态下载URL - 支持生产环境和本地开发
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
        const downloadUrl = `${baseUrl}/api/download-cover-letter/${gridfsId}`;
        
        // 保存GridFS ID和下载URL到用户Profile的Application中
        if (userProfile?.email && job?.id) {
          try {
            await upsertJobApplication(userProfile.email, job.id, {
              coverLetter: {
                gridfsId: gridfsId,
                downloadUrl: downloadUrl,
                filename: `${smartFilename}.pdf`
              }
            });
            console.log(`[Cover Letter API] Cover Letter saved to Application for ${userProfile.email}, jobId: ${job.id}`);
          } catch (profileError) {
            console.warn('[Cover Letter API] Failed to save Cover Letter to Application:', profileError);
            // 不影响主要功能，只记录警告
          }
        }
        
        console.log(`[Cover Letter API] Cover Letter PDF uploaded to GridFS for ${userProfile.email}, GridFS ID: ${gridfsId}, Download URL: ${downloadUrl}`);
      } catch (profileError) {
        console.warn('[Cover Letter API] Failed to save Cover Letter to GridFS/profile:', profileError);
        // 不影响主要功能，只记录警告
      }
    }
    
    // 返回成功响应，包含下载URL
    return NextResponse.json({
      success: true,
      filename: `${smartFilename}.pdf`,
      downloadUrl: gridfsId ? `/api/download-cover-letter/${gridfsId}` : null,
      format: 'pdf',
      message: 'Cover letter PDF generated successfully'
    });

  } catch (error) {
    console.error('Cover letter PDF proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        detail: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
