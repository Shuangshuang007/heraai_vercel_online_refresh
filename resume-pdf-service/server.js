const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { generateDocx } = require('./docxGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 自定义静态文件服务，为DOCX文件设置正确的Content-Type
app.use('/resumes', (req, res, next) => {
  const filePath = path.join(__dirname, 'public/resumes', req.path);
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    
    // 为DOCX文件设置正确的Content-Type
    if (ext === '.docx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(filePath));
    }
  }
  
  next();
});

app.use('/resumes', express.static('public/resumes'));

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'public/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// —— bullets 规范化 —— //
function normalizeBullets(input) {
  // 1) 已经是数组：逐项清洗
  if (Array.isArray(input)) {
    return input
      .map(x => String(x || '').trim())
      .map(cleanBullet)
      .filter(Boolean);
  }

  // 2) 是字符串：先统一分隔符，再切分
  let str = String(input || '');

  // 修正常见错误： ".,"
  str = str.replace(/\.?,\s*/g, '. '); // ".,", "," → ". "

  // 先按换行/项目符/分号/句号切
  let parts = str.split(/\r?\n|[•;]+|\.\s+/g).map(x => x.trim()).filter(Boolean);

  // 如果仍只有一条且包含逗号（很多 JD/前端会用逗号拼），再按"逗号 + 大写开头"切
  if (parts.length <= 1 && /,/.test(str)) {
    parts = str.split(/,\s*(?=[A-Z(])/g).map(x => x.trim()).filter(Boolean);
  }

  return parts.map(cleanBullet).filter(Boolean);
}

function cleanBullet(x) {
  // 去掉行首多余的符号与破折号
  x = x.replace(/^[•\-\u2022\u25CF\*]\s*/,'');
  // 合并多空格
  x = x.replace(/\s{2,}/g, ' ').trim();
  // 统一句末标点（避免 "...,", "..."）
  x = x.replace(/[,;：，；。\.]+$/,'').trim();
  if (!x) return '';
  return x;
}

function bulletsHtml(input) {
  const arr = normalizeBullets(input);
  if (!arr.length) return '';
  return `<ul>${arr.map(li => `<li>${li}</li>`).join('')}</ul>`;
}

// 生成HTML模板
function generateResumeHTML(resumeData) {
  const { 
    profile, summary, experience, education, skills, languages, personalHighlights, 
    workingRightsAU, workingRightsOther, linkedin 
  } = resumeData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile?.name || 'Resume'}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 30px;
            font-size: 12px;
            line-height: 1.15;
            color: #333;
        }
        .header {
            margin-bottom: 15px;
        }
        .name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #1a1a1a;
            text-transform: uppercase;
            text-align: center;
        }
        .title {
            font-size: 17px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #2a2a2a;
        }
        .contact {
            font-size: 12px;
            color: #666666;
            margin-bottom: 18px;
            text-align: center;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary {
            font-size: 12px;
            color: #333333;
            line-height: 1.2;
            margin-bottom: 12px;
            white-space: pre-line;
        }
        .job-title {
            font-size: 12.5px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 2px;
        }
        .company {
            font-size: 12px;
            font-style: italic;
            color: #666666;
            margin-bottom: 3px;
        }
        .location {
            font-weight: normal;
            font-style: normal;
        }
        .date {
            font-size: 12px;
            color: #888888;
            margin-bottom: 3px;
        }
        .bullet-point {
            font-size: 12px;
            color: #333333;
            margin-bottom: 3px;
            line-height: 1.2;
        }
        .skills, .languages, .working-rights {
            font-size: 12px;
            color: #333333;
            line-height: 1.4;
        }
        .degree {
            font-size: 12px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 2px;
        }
        .institution {
            font-size: 12px;
            font-style: italic;
            font-weight: normal;
            color: #666666;
            margin-bottom: 4px;
        }
        .job-item, .education-item {
            margin-bottom: 12px;
        }
        
        /* 控制列表缩进 */
        ul {
            margin: 0;
            padding-left: 16px;  /* 给列表添加适当的左内边距，显示圆点 */
            list-style: disc;    /* 显示圆点 */
            font-size: inherit;  /* 继承父元素的字体大小，不改变字体大小 */
        }
        
        li {
            margin: 0;
            padding: 0;
            margin-bottom: 3px;
            font-size: inherit;  /* 继承父元素的字体大小，不改变字体大小 */
        }
        
        /* 确保内容左对齐 */
        .section {
            margin-bottom: 20px;
            padding-left: 0;
            margin-left: 0;
        }
        
        .job-item, .education-item {
            padding-left: 0;
            margin-left: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${profile?.name || 'Resume'}</div>
        ${profile?.title ? `<div class="title">${profile.title}</div>` : ''}
        <div class="contact">${profile?.location || ''} • ${profile?.phone || ''} • ${profile?.email || ''}${linkedin ? ` • LinkedIn: ${linkedin}` : ''}</div>
    </div>

    ${personalHighlights && personalHighlights.length > 0 ? `<div class="section"><div class="section-title">Personal Highlights</div><div class="summary">${(() => {const clean = (t = '') => t.replace(/^[\s•\-\*·]+/, '').replace(/\n{2,}/g, '\n').replace(/\s+/g, ' ').trim();let highlightsText = '';if (Array.isArray(personalHighlights)) {highlightsText = personalHighlights.join(' ');} else if (typeof personalHighlights === 'string') {highlightsText = personalHighlights;}return clean(highlightsText);})()}</div></div>` : ''}
    ${summary && summary.trim() !== '' ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${summary}</div>
    </div>
    ` : ''}



    ${experience && experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Employment History</div>
        ${experience.map(job => `
            <div class="job-item">
                <div class="job-title">${job.title || ''}</div>
                <div class="company"><strong>${job.company || ''}</strong>${job.location ? `, <span class="location">${job.location}</span>` : ''}</div>
                <div class="date">${job.startDate || ''} - ${job.endDate || ''}</div>
                ${(() => {
                  // 兼容数组或字符串，一律经 normalize 渲染
                  const bulletsHtmlStr = bulletsHtml(
                    job?.bullets?.length ? job.bullets : (job?.summary || job?.description || '')
                  );
                  return bulletsHtmlStr;
                })()}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${education && education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
            <div class="education-item">
                <div class="degree">${edu.degree || ''}</div>
                <div class="institution"><strong>${edu.institution || ''}</strong></div>
                <div class="date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                ${(() => {
                  // 兼容数组或字符串，一律经 normalize 渲染
                  const bulletsHtmlStr = bulletsHtml(
                    edu?.bullets?.length ? edu.bullets : (edu?.summary || edu?.description || '')
                  );
                  return bulletsHtmlStr;
                })()}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${(skills && skills.length > 0) || (languages && languages.length > 0) || (workingRightsAU && workingRightsAU.trim() !== '') ? `
    <div class="section">
        <div class="section-title">Additional Information</div>
        ${skills && skills.length > 0 ? `
        <div style="margin-bottom: 4px;">
            <strong>Skills:</strong> <span class="skills">${[...new Set(skills)].join(' • ')}</span>
        </div>
        ` : ''}
        ${languages && languages.length > 0 ? `
        <div style="margin-bottom: 4px;">
            <strong>Languages:</strong> <span class="skills">${[...new Set(languages)].join('; ')}</span>
        </div>
        ` : ''}
        ${workingRightsAU && workingRightsAU.trim() !== '' ? `
        <div style="margin-bottom: 4px;">
            <strong>Working Rights:</strong> <span class="working-rights">${workingRightsAU}</span>
        </div>
        ` : ''}
    </div>
    ` : ''}
</body>
</html>
  `;
}

// PDF生成服务
let browser = null;

async function initializeBrowser() {
  if (!browser) {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

async function generatePDF(html, options = {}) {
  const browser = await initializeBrowser();
  const page = await browser.newPage();
  
  await page.setContent(html);
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '30px', right: '30px', bottom: '30px', left: '30px' },
    ...options
  });
  
  await page.close();
  return pdfBuffer;
}

// API路由 - 支持PDF和DOCX格式
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { resumeData, settings, format = 'pdf' } = req.body;
    
    console.log('Received format:', format);
    console.log('Format type:', typeof format);
    
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    
    let buffer;
    let filename;
    let message;
    
    if (format === 'docx') {
      console.log('Generating DOCX...');
      // 生成DOCX
      buffer = await generateDocx(resumeData, settings);
      // 使用智能文件名或回退到默认格式
      if (resumeData.smartFilename) {
        filename = `${resumeData.smartFilename}.docx`;
      } else {
        filename = `${resumeData.profile.name.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      }
      message = 'DOCX generated successfully';
    } else {
      console.log('Generating PDF...');
      // 生成PDF（默认）
      const html = generateResumeHTML(resumeData);
      buffer = await generatePDF(html, settings);
      // 使用智能文件名或回退到默认格式
      if (resumeData.smartFilename) {
        filename = `${resumeData.smartFilename}.pdf`;
      } else {
        filename = `${resumeData.profile.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      }
      message = 'PDF generated successfully';
    }
    
    // 保存文件
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    // 返回下载链接
    const downloadUrl = `/resumes/${filename}`;
    
    res.json({
      success: true,
      downloadUrl,
      filename,
      format,
      message
    });
    
  } catch (error) {
    console.error('Resume generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 新增：直接返回PDF二进制数据的API
app.post('/api/generate-pdf-binary', async (req, res) => {
  try {
    const { resumeData, settings } = req.body;
    
    if (!resumeData) {
      return res.status(400).send('Resume data is required');
    }
    
    // 生成PDF
    const html = generateResumeHTML(resumeData);
    const buffer = await generatePDF(html, settings);
    
    // 直接返回PDF二进制数据
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(buffer);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).send('PDF generation failed');
  }
});

// 新增：从HTML生成Cover Letter PDF的API
app.post('/api/generate-pdf-from-html', async (req, res) => {
  try {
    const { html, filename } = req.body;
    
    if (!html) {
      return res.status(400).send('HTML content is required');
    }
    
    // 生成PDF
    const buffer = await generatePDF(html, {});
    
    // 直接返回PDF二进制数据
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'cover_letter.pdf'}"`);
    res.send(buffer);
    
  } catch (error) {
    console.error('Cover Letter PDF generation failed:', error);
    res.status(500).send('Cover Letter PDF generation failed');
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Resume PDF Service' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Resume PDF Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Resume generation: http://localhost:${PORT}/api/generate-pdf`);
  console.log(`Supported formats: PDF, DOCX`);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  if (browser) {
    try {
      await browser.close();
      console.log('Browser closed successfully');
    } catch (err) {
      console.error('Error closing browser:', err);
    }
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down...');
  if (browser) {
    try {
      await browser.close();
      console.log('Browser closed successfully');
    } catch (err) {
      console.error('Error closing browser:', err);
    }
  }
  process.exit(0);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (browser) {
    browser.close().catch(console.error);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (browser) {
    browser.close().catch(console.error);
  }
  process.exit(1);
}); 