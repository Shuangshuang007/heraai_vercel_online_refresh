const express = require('express');
const fetch = require('node-fetch');
const { toPdfResumeInput } = require('./src/lib/normalize');

const app = express();

// Working Rights 取值器函数
function pickWorkingRightsAU(body) {
  const raw =
    (body?.profileForm && body.profileForm.workingRightsAU) ||
    body?.workingRightsAU ||
    body?.WR_AU || '';
  return String(raw).trim();
}

// 最小替换工具（只作用于已有文本）
function applyMappings(text, mappings) {
  if (!text || !mappings?.length) return text || '';
  let out = String(text);
  for (const m of mappings) {
    const from = m?.from?.trim();
    const to = m?.to?.trim();
    if (!from || !to) continue;
    const re = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(re, to);
  }
  return out;
}

// 添加CORS支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 确保 JSON 解析中间件
app.use(require('express').json({ limit: '5mb' }));
app.use(require('express').urlencoded({ extended: true, limit: '5mb' }));

// 新接口：/api/tailor-resume
app.post('/api/tailor-resume', async (req, res) => {
  try {
    const body = req.body || {};
    
    // 可选：仅健康探活时直接返回，不进入生成流程
    if (body && body.test === 'health') {
      return res.status(200).json({ status: 'OK', service: 'Tailor Resume Service' });
    }

    // 兜底逻辑：如果前端直接发送了完整的 resumeData，直接转发给 PDF 服务
    if (body.resumeData && body.format === 'pdf') {
      console.log('🔍 检测到完整 resumeData，直接转发给 PDF 服务');
      
      try {
        const pdfRes = await fetch(process.env.PDF_SERVICE_URL || 'http://localhost:3001/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!pdfRes.ok) {
          const detail = await pdfRes.text().catch(()=> '');
          return res.status(502).json({ code:'PDF_SERVICE_FAILED', detail });
        }

        // 返回PDF二进制数据
        const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

        res.status(200);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="tailored_resume.pdf"`);
        res.setHeader('Cache-Control', 'no-store');
        res.end(pdfBuffer);
        return;
      } catch (e) {
        console.error('PDF 服务调用失败:', e);
        return res.status(502).json({ code:'PDF_SERVICE_FAILED', detail: e.message });
      }
    }

    // 原有的 Tailor Resume 逻辑（作为备选）
    console.log('🔍 使用原有 Tailor Resume 逻辑');
    
    // 回到原来的简单逻辑
    const form = body.profileForm || body;
    const normalized = {
      workingRightsAU: pickWorkingRightsAU(body),
      education: Array.isArray(form.education) ? form.education : [],
      skills: Array.isArray(form.skills) ? form.skills : [],
      languages: Array.isArray(form.languages) ? form.languages : []
    };

    // 调用原有的 toPdfResumeInput 函数
    const resumeData = toPdfResumeInput(normalized);

    try {
      // 调用 PDF 服务
      const pdfRes = await fetch(process.env.PDF_SERVICE_URL || 'http://localhost:3001/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData, format: 'pdf' })
      });

      if (!pdfRes.ok) {
        const detail = await pdfRes.text().catch(()=> '');
        return res.status(502).json({ code:'PDF_SERVICE_FAILED', detail });
      }

      // 返回PDF二进制数据
      const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

      res.status(200);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="tailored_resume.pdf"`);
      res.setHeader('Cache-Control', 'no-store');
      res.end(pdfBuffer);

    } catch (e) {
      console.error('Tailor resume generation error:', e);
      return res.status(400).json({
        error: 'Failed to tailor resume',
        details: e?.message || 'Invalid payload',
        timestamp: new Date().toISOString(),
      });
    }

  } catch (err) {
    console.error('Tailor resume error:', err);
    res.status(500).json({
      error: 'Failed to tailor resume',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(3003, () => {
  console.log('Tailor Resume Service running on http://localhost:3003');
});
