import { NextRequest, NextResponse } from 'next/server';
import { downloadPDF, getPDFMetadata } from '@/services/gridfsService';
import { getUserSubscriptionStatus } from '@/services/profileDatabaseService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log(`[Download Cover Letter API] Attempting to download PDF with GridFS ID: ${id}`);
    
    // 获取用户邮箱 (从query参数)
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // 检查订阅状态
    const subscriptionStatus = await getUserSubscriptionStatus(email);
    if (!subscriptionStatus.isPremiumToday) {
      return NextResponse.json(
        { 
          error: 'PAYMENT_REQUIRED',
          message: 'Premium subscription required for downloads',
          code: 'PAYWALL_DOWNLOAD_COVER_LETTER'
        },
        { status: 402 }
      );
    }
    
    const pdfBuffer = await downloadPDF(id);
    
    console.log(`[Download Cover Letter API] PDF downloaded successfully, size: ${pdfBuffer.length} bytes`);
    
    // 获取文件元数据以设置正确的文件名
    const metadata = await getPDFMetadata(id);
    const filename = metadata?.filename || 'cover-letter.pdf';
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error(`[Download Cover Letter API] Error downloading PDF:`, error);
    return NextResponse.json(
      { error: 'Cover Letter PDF not found or download failed' }, 
      { status: 404 }
    );
  }
}
