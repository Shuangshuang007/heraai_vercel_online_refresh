// 让这个路由跑在 Node 运行时（Edge 不允许 http 出站）
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const base = process.env.RESUME_PDF_SERVICE_URL!; // 例如 http://149.28.175.142:3001
    // 你的 Vultr 保存规则里，PDF 都在 /public/resumes/ 下（按你日志/代码判断）
    const target = `${base}/public/resumes/${encodeURIComponent(filename)}`;

    const vultrRes = await fetch(target, { cache: 'no-store' });

    if (!vultrRes.ok || !vultrRes.body) {
      return new Response('File not found', { status: vultrRes.status || 404 });
    }

    // 透传流 & 设置下载头
    return new Response(vultrRes.body, {
      status: 200,
      headers: {
        'Content-Type':
          vultrRes.headers.get('content-type') || 'application/pdf',
        'Content-Disposition':
          vultrRes.headers.get('content-disposition') ||
          `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response('Proxy error', { status: 502 });
  }
}
