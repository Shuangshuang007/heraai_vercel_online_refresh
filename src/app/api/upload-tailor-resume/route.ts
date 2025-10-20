import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/services/gridfsService';

export async function POST(request: NextRequest) {
  try {
    const { pdfBuffer, filename, email, jobId } = await request.json();
    
    console.log(`[Upload Tailor Resume] Processing upload for ${email}, jobId: ${jobId}`);
    
    // 将数组转换回Buffer
    const buffer = Buffer.from(pdfBuffer);
    
    // 上传到GridFS
    const gridfsId = await uploadPDF(buffer, filename);
    
    // 构建动态下载URL - 支持生产环境和本地开发
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
    const downloadUrl = `${baseUrl}/api/download-resume/${gridfsId}`;
    
    console.log(`[Upload Tailor Resume] PDF uploaded to GridFS successfully: ${filename}, ID: ${gridfsId}`);
    
    return NextResponse.json({
      success: true,
      gridfsId,
      downloadUrl,
      filename,
      message: 'Tailor Resume PDF uploaded to GridFS successfully'
    });
    
  } catch (error) {
    console.error('[Upload Tailor Resume] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload Tailor Resume PDF to GridFS' 
      },
      { status: 500 }
    );
  }
}
