const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Spacing } = require('docx');
const fs = require('fs');
const path = require('path');

/**
 * 生成DOCX格式的简历
 * @param {Object} resumeData - 简历数据
 * @param {Object} settings - 生成设置
 * @returns {Buffer} - DOCX文件Buffer
 */
async function generateDocx(resumeData, settings = {}) {
  const { profile, summary, experience, education, skills, languages, personalHighlights, workingRightsAU, workingRightsOther, linkedin } = resumeData;
  
    // 创建文档
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1152, // 0.8 inch (1440 * 0.8)
            right: 1080, // 0.75 inch (1440 * 0.75)
            bottom: 1152, // 0.8 inch (1440 * 0.8)
            left: 1080, // 0.75 inch (1440 * 0.75)
          },
        },
      },
      children: [
        // 头部信息 - Resume.co样式
        new Paragraph({
          children: [
            new TextRun({
              text: (profile.name || 'Your Name').toUpperCase(),
              bold: true,
              size: 56, // 28 pt * 2 = 56 (docx使用半磅为单位)
              color: '1a1a1a',
              font: 'Arial',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400, line: 276 }, // 1.1倍行间距
        }),
        
        // 联系信息
        new Paragraph({
          children: [
            new TextRun({
              text: `${profile.email || ''} • ${profile.phone || ''} • ${profile.location || ''}`,
              size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
              color: '666666',
              font: 'Arial',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800, line: 276 }, // 1.1倍行间距
        }),
        
        // LinkedIn链接（如果有）
        ...(linkedin ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `LinkedIn: ${linkedin}`,
                size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                color: '666666',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800, line: 276 }, // 1.1倍行间距
          })
        ] : []),
        
        // 个人亮点（如果有）
        ...(personalHighlights ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PERSONAL HIGHLIGHTS',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 400, after: 200, line: 331 }, // 1.2倍行间距
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: (() => {
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
                      .replace(/\s+/g, ' ')        // 将多个空格替换为单个空格
                      .trim();                     // 移除首尾空格
                  
                  return highlightsText;
                })(),
                size: 24, // 12 pt * 2 = 24 (docx使用半磅为单位)
                color: '333333',
                font: 'Arial',
              }),
            ],
            spacing: { after: 400, line: 331 }, // 1.2倍行间距
          })
        ] : []),
        
        // 在Personal Highlights和Employment History之间添加空行
        new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: { after: 400, line: 331 }, // 1.2倍行间距
        }),
        
        // 专业摘要
        ...(summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 400, after: 200, line: 331 }, // 1.2倍行间距
          }),
          ...(Array.isArray(summary) ? 
            summary.map(item => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${item}`,
                    size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                    color: '333333',
                    font: 'Arial',
                  }),
                ],
                spacing: { after: 200, line: 276 }, // 1.1倍行间距
              })
            ) : 
            summary.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).map(sentence => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${sentence.trim()}`,
                    size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                    color: '333333',
                    font: 'Arial',
                  }),
                ],
                spacing: { after: 200, line: 276 }, // 1.1倍行间距
              })
            )
          )
        ] : []),
        
        // 工作经验
        ...(experience && experience.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EMPLOYMENT HISTORY',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 600, after: 200, line: 276 }, // 1.1倍行间距
          }),
          ...generateExperienceSection(experience)
        ] : []),
        
        // 教育背景
        ...(education && education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 400, after: 200, line: 276 }, // 1.1倍行间距
          }),
          ...generateEducationSection(education)
        ] : []),
        
        // 技能
        ...(skills && skills.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 400, after: 200, line: 276 }, // 1.1倍行间距
          }),
          new Paragraph({
            children: [
                                                                                                                                                                                                                       new TextRun({
                text: skills.join(', '),
                size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                color: '333333',
                font: 'Arial',
              }),
            ],
            spacing: { after: 400, line: 276 }, // 1.1倍行间距
          })
        ] : []),
        
                // ADDITIONAL INFORMATION 章节
        ...((languages && languages.length > 0) || workingRightsAU || workingRightsOther ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'ADDITIONAL INFORMATION',
                bold: true,
                size: 28, // 14 pt * 2 = 28 (docx使用半磅为单位)
                color: '1a1a1a',
                allCaps: true,
                font: 'Arial',
              }),
            ],
            spacing: { before: 400, after: 200, line: 276 }, // 1.1倍行间距
          }),
          
          // 语言
          ...(languages && languages.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Languages',
                  bold: true,
                  size: 24, // 12 pt * 2 = 24 (docx使用半磅为单位)
                  color: '1a1a1a',
                  font: 'Arial',
                }),
              ],
              spacing: { before: 200, after: 100, line: 276 }, // 1.1倍行间距
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: languages.join(' • '),
                  size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                  color: '333333',
                  font: 'Arial',
                }),
              ],
              spacing: { after: 300, line: 276 }, // 1.1倍行间距
            })
          ] : []),
          
          // 工作权利
          ...(workingRightsAU || workingRightsOther ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Working Rights',
                  bold: true,
                  size: 24, // 12 pt * 2 = 24 (docx使用半磅为单位)
                  color: '1a1a1a',
                  font: 'Arial',
                }),
              ],
              spacing: { before: 200, after: 100, line: 276 }, // 1.1倍行间距
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${workingRightsAU || ''}${workingRightsOther ? `, ${workingRightsOther}` : ''}`,
                  size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
                  color: '333333',
                  font: 'Arial',
                }),
              ],
              spacing: { after: 400, line: 276 }, // 1.1倍行间距
            })
          ] : []),
        ] : []),
      ],
    }],
  });
  
  // 生成Buffer
  return await Packer.toBuffer(doc);
}

/**
 * 生成工作经验部分
 */
function generateExperienceSection(experience) {
  const sections = [];
  
  experience.forEach((job, index) => {
    // 职位标题
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: job.title || '',
          bold: true,
          size: 24, // 12 pt * 2 = 24 (docx使用半磅为单位)
          color: '1a1a1a',
          font: 'Arial',
        }),
      ],
      spacing: { before: index === 0 ? 0 : 300, line: 276 }, // 1.1倍行间距
    }));
    
    // 公司信息
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: `${job.company || ''}`,
          size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
          color: '666666',
          bold: true, // 企业名称加粗
          font: 'Arial',
        }),
        ...(job.location ? [
          new TextRun({
            text: `, ${job.location}`,
            size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
            color: '666666',
            italics: true, // 位置信息保持斜体
            font: 'Arial',
          })
        ] : [])
      ],
      spacing: { after: 100, line: 276 }, // 1.1倍行间距
    }));
    
    // 时间
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: `${job.startDate || ''} - ${job.endDate || 'Present'}`,
          size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
          color: '888888',
          font: 'Arial',
        }),
      ],
      spacing: { after: 200, line: 276 }, // 1.1倍行间距
    }));
    
    // 描述
    if (job.description && job.description.length > 0) {
      job.description.forEach(desc => {
        sections.push(new Paragraph({
          children: [
            new TextRun({
              text: `• ${desc}`,
              size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
              color: '333333',
              font: 'Arial',
            }),
          ],
          spacing: { before: 100, line: 276 }, // 1.1倍行间距
        }));
      });
    }
    
    sections.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { after: 200, line: 276 }, // 1.1倍行间距
    }));
  });
  
  return sections;
}

/**
 * 生成教育背景部分
 */
function generateEducationSection(education) {
  const sections = [];
  
  education.forEach((edu, index) => {
    // 学位
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: edu.degree || '',
          bold: true,
          size: 24, // 12 pt * 2 = 24 (docx使用半磅为单位)
          color: '1a1a1a',
          font: 'Arial',
        }),
      ],
      spacing: { before: index === 0 ? 0 : 300, line: 276 }, // 1.1倍行间距
    }));
    
    // 学校
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: edu.institution || '',
          size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
          color: '666666',
          bold: true, // 学校名称加粗
          font: 'Arial',
        }),
      ],
      spacing: { after: 100, line: 276 }, // 1.1倍行间距
    }));
    
    // 时间
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: `${edu.startDate || ''} - ${edu.endDate || ''}`,
          size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
          color: '888888',
          font: 'Arial',
        }),
      ],
      spacing: { after: 200, line: 276 }, // 1.1倍行间距
    }));
    
    // 描述
    if (edu.description && edu.description.length > 0) {
      edu.description.forEach(desc => {
        sections.push(new Paragraph({
          children: [
            new TextRun({
              text: `• ${desc}`,
              size: 22, // 11 pt * 2 = 22 (docx使用半磅为单位)
              color: '333333',
              font: 'Arial',
            }),
          ],
          spacing: { before: 100, line: 276 }, // 1.1倍行间距
        }));
      });
    }
    
    sections.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { after: 200, line: 276 }, // 1.1倍行间距
    }));
  });
  
  return sections;
}

module.exports = { generateDocx };
