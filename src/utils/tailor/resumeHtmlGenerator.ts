// 与 resume-pdf-service 中完全相同的 HTML 生成逻辑
// 确保预览和最终 PDF 完全一致

// bullets 规范化函数
function normalizeBullets(input: any): string[] {
  // 1) 已经是数组：逐项清洗
  if (Array.isArray(input)) {
    return input
      .map((x: any) => String(x || '').trim())
      .map(cleanBullet)
      .filter(Boolean);
  }

  // 2) 是字符串：先统一分隔符，再切分
  let str = String(input || '');

  // 修正常见错误： ".,"
  str = str.replace(/\.?,\s*/g, '. '); // ".,", "," → ". "

  // 先按换行/项目符/分号/句号切
  let parts = str.split(/\r?\n|[•;]+|\.\s+/g).map((x: string) => x.trim()).filter(Boolean);

  // 如果仍只有一条且包含逗号（很多 JD/前端会用逗号拼），再按"逗号 + 大写开头"切
  if (parts.length <= 1 && /,/.test(str)) {
    parts = str.split(/,\s*(?=[A-Z(])/g).map((x: string) => x.trim()).filter(Boolean);
  }

  return parts.map(cleanBullet).filter(Boolean);
}

function cleanBullet(x: string): string {
  // 去掉行首多余的符号与破折号
  x = x.replace(/^[•\-\u2022\u25CF\*]\s*/, '');
  // 合并多空格
  x = x.replace(/\s{2,}/g, ' ').trim();
  // 统一句末标点（避免 "...,", "..."）
  x = x.replace(/[,;：，；。\.]+$/, '').trim();
  if (!x) return '';
  return x.endsWith('.') ? x : x + '.';
}

function bulletsHtml(input: any): string {
  const arr = normalizeBullets(input);
  if (!arr.length) return '';
  return `<ul>${arr.map((li: string) => `<li>${li}</li>`).join('')}</ul>`;
}

// 生成HTML模板 - 与 resume-pdf-service 中完全一致
export function generateResumeHTML(resumeData: any): string {
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
            margin-bottom: 12px;
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
            margin-bottom: 8px;
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
            margin-bottom: 15px;
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

    ${personalHighlights && personalHighlights.length > 0 ? `
    <div class="section">
        <div class="section-title">Personal Highlights</div>
        <ul>
            <li class="bullet-point">
                ${(() => {
                    // 处理Personal Highlights - 清理多余的点
                    let highlightsText = '';
                    if (Array.isArray(personalHighlights)) {
                        // 如果是数组，合并所有项
                        highlightsText = personalHighlights.join(' ');
                    } else if (typeof personalHighlights === 'string') {
                        // 如果是字符串，直接使用
                        highlightsText = personalHighlights;
                    }
                    
                    // 清理多余的点：移除开头和结尾的点，以及多余的空格
                    highlightsText = highlightsText
                        .replace(/^[•\-\*\s]+/, '')  // 移除开头的点、破折号、星号和空格
                        .replace(/[•\-\*\s]+$/, '')  // 移除结尾的点、破折号、星号和空格
                        .replace(/[.!?]+$/, '')      // 强制移除结尾的句号、感叹号、问号
                        .replace(/\s+/g, ' ')        // 将多个空格替换为单个空格
                        .trim();                     // 移除首尾空格
                    
                    return highlightsText;
                })()}
            </li>
        </ul>
    </div>
    ` : ''}

    ${summary && summary.trim() !== '' ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${summary}</div>
    </div>
    ` : ''}

    ${experience && experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Employment History</div>
        ${experience.map((job: any) => `
            <div class="job-item">
                <div class="job-title">${job.title || ''}</div>
                <div class="company"><strong>${job.company || ''}</strong>${typeof job.location === 'string' && job.location ? `, <span class="location">${job.location}</span>` : ''}</div>
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
        ${education.map((edu: any) => `
            <div class="education-item">
                <div class="degree">${edu.degree || ''}</div>
                <div class="institution"><strong>${edu.institution || ''}</strong>${typeof edu.location === 'string' && edu.location ? `, <span class="location">${edu.location}</span>` : ''}</div>
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
            <strong>Languages:</strong> <span class="languages">${languages.filter((lang: any, index: number, arr: any[]) => {
              // 去重逻辑：基于 language 和 level 的组合去重
              if (typeof lang === 'object' && lang.language) {
                const firstIndex = arr.findIndex(item => 
                  typeof lang === 'object' && 
                  item.language === lang.language && 
                  item.level === lang.level
                );
                return firstIndex === index;
              } else if (typeof lang === 'string') {
                const firstIndex = arr.findIndex(item => item === lang);
                return firstIndex === index;
              }
              return true;
            }).map((lang: any) => {
              if (typeof lang === 'object' && lang.language) {
                return lang.language + ' (' + (lang.level || 'Basic') + ')';
              } else if (typeof lang === 'string') {
                return lang;
              } else {
                return 'Unknown Language';
              }
            }).join('; ')}</span>
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
