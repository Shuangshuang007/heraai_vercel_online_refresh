export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 使用环境变量配置服务URL
    const pdfServiceUrl = process.env.RESUME_PDF_SERVICE_URL;
    if (!pdfServiceUrl) {
      throw new Error('RESUME_PDF_SERVICE_URL environment variable is not set');
    }
    const r = await fetch(
      `${pdfServiceUrl}/api/generate-pdf-binary`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/pdf' 
        },
        body: JSON.stringify(payload),
      }
    );

    if (!r.ok) {
      const errorText = await r.text().catch(() => 'Unknown error');
      console.error('PDF Service error:', r.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'PDF generation failed', 
          status: r.status, 
          detail: errorText 
        }), 
        { 
          status: r.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 获取 PDF 二进制数据
    const pdfBuffer = await r.arrayBuffer();
    const contentType = r.headers.get('Content-Type') || 'application/pdf';
    const contentDisposition = r.headers.get('Content-Disposition') || 'attachment; filename="resume.pdf"';

    // 返回 PDF 二进制数据
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('PDF proxy error:', error);
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
