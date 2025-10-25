import { NextRequest, NextResponse } from 'next/server';
import { downloadPDF, getPDFMetadata } from '@/services/gridfsService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[View Cover Letter API] Attempting to view PDF with GridFS ID: ${id}`);
    
    const pdfBuffer = await downloadPDF(id);
    
    console.log(`[View Cover Letter API] PDF loaded successfully, size: ${pdfBuffer.length} bytes`);
    
    // 获取文件元数据以设置正确的文件名
    const metadata = await getPDFMetadata(id);
    const filename = metadata?.filename || 'cover-letter.pdf';
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error(`[View Cover Letter API] Error loading PDF:`, error);
    return NextResponse.json(
      { error: 'Cover Letter PDF not found or failed to load' }, 
      { status: 404 }
    );
  }
}
