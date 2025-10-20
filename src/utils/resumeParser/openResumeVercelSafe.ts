// 纯JavaScript版本的OpenResume算法 - Vercel兼容
export class OpenResumeVercelSafe {
  private static instance: OpenResumeVercelSafe;
  
  private constructor() {}
  
  static getInstance(): OpenResumeVercelSafe {
    if (!OpenResumeVercelSafe.instance) {
      OpenResumeVercelSafe.instance = new OpenResumeVercelSafe();
    }
    return OpenResumeVercelSafe.instance;
  }

  /**
   * 主要解析方法 - 实现OpenResume的四步流程（纯JavaScript版本）
   */
  async parsePDF(buffer: Buffer): Promise<string> {
    try {
      // Step 1: 使用纯JavaScript库提取文本
      const rawText = await this.extractTextFromPDF(buffer);
      console.log(`✓ Extracted raw text (${rawText.length} characters)`);

      // Step 2: 将文本分割为行
      const lines = this.splitTextIntoLines(rawText);
      console.log(`✓ Split into ${lines.length} lines`);

      // Step 3: 将行分组为章节
      const sections = this.groupLinesIntoSections(lines);
      console.log(`✓ Grouped into ${sections.length} sections`);

      // Step 4: 从章节提取结构化信息
      const structuredText = this.extractResumeFromSections(sections);
      console.log('✓ Extracted structured resume data');

      return structuredText;
    } catch (error) {
      console.error('OpenResume VercelSafe parsing failed:', error);
      throw new Error(`OpenResume VercelSafe parsing failed: ${error}`);
    }
  }

  /**
   * Step 1: 使用纯JavaScript库提取PDF文本
   */
  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const errors: string[] = [];
    
    // 尝试多个纯JavaScript PDF解析库
    const libraries = [
      { name: 'pdf-parse-debugging-disabled', parser: this.parseWithPdfParse },
      { name: 'pdf-text-extract', parser: this.parseWithPdfTextExtract },
      { name: 'pdf2txt', parser: this.parseWithPdf2txt }
    ];

    for (const lib of libraries) {
      try {
        const text = await lib.parser(buffer);
        if (text && text.trim().length > 0) {
          console.log(`✓ PDF parsed successfully with ${lib.name}`);
          return this.cleanText(text);
        }
      } catch (error) {
        errors.push(`${lib.name} failed: ${error}`);
      }
    }

    throw new Error(`All PDF parsing libraries failed: ${errors.join('; ')}`);
  }

  /**
   * 使用pdf-parse-debugging-disabled解析
   */
  private async parseWithPdfParse(buffer: Buffer): Promise<string> {
    const pdfParse = require('pdf-parse-debugging-disabled');
    const data = await pdfParse(buffer);
    return data.text;
  }

  /**
   * 使用pdf-text-extract解析
   */
  private async parseWithPdfTextExtract(buffer: Buffer): Promise<string> {
    const pdfTextExtract = require('pdf-text-extract');
    const text = await pdfTextExtract(buffer);
    return Array.isArray(text) ? text.join('\n') : text;
  }

  /**
   * 使用pdf2txt解析
   */
  private async parseWithPdf2txt(buffer: Buffer): Promise<string> {
    const pdf2txt = require('pdf2txt');
    return await pdf2txt(buffer);
  }

  /**
   * Step 2: 将文本分割为行（模拟OpenResume的行分组）
   */
  private splitTextIntoLines(text: string): Line[] {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    return lines.map((line, index) => ({
      text: line.trim(),
      index,
      type: this.classifyLine(line.trim())
    }));
  }

  /**
   * Step 3: 将行分组为章节（基于OpenResume的章节分组算法）
   */
  private groupLinesIntoSections(lines: Line[]): Section[] {
    const sections: Section[] = [];
    let currentSection: Line[] = [];
    let currentSectionType = LineType.UNKNOWN;
    
    for (const line of lines) {
      // 如果行类型改变，开始新section
      if (line.type !== currentSectionType && line.type !== LineType.UNKNOWN) {
        if (currentSection.length > 0) {
          sections.push({
            type: currentSectionType,
            lines: currentSection,
            text: currentSection.map(l => l.text).join('\n')
          });
        }
        currentSection = [line];
        currentSectionType = line.type;
      } else {
        currentSection.push(line);
      }
    }
    
    // 添加最后一个section
    if (currentSection.length > 0) {
      sections.push({
        type: currentSectionType,
        lines: currentSection,
        text: currentSection.map(l => l.text).join('\n')
      });
    }
    
    return sections;
  }

  /**
   * Step 4: 从章节提取结构化信息（基于OpenResume的特征评分系统）
   */
  private extractResumeFromSections(sections: Section[]): string {
    const structuredData: any = {
      contact: '',
      summary: '',
      experience: '',
      education: '',
      skills: ''
    };
    
    for (const section of sections) {
      switch (section.type) {
        case LineType.CONTACT:
          structuredData.contact += section.text + '\n';
          break;
        case LineType.SUMMARY:
          structuredData.summary += section.text + '\n';
          break;
        case LineType.EXPERIENCE:
          structuredData.experience += section.text + '\n';
          break;
        case LineType.EDUCATION:
          structuredData.education += section.text + '\n';
          break;
        case LineType.SKILLS:
          structuredData.skills += section.text + '\n';
          break;
        default:
          // 对于未知类型，添加到summary
          structuredData.summary += section.text + '\n';
      }
    }
    
    // 组合成结构化文本
    let result = '';
    if (structuredData.contact) result += 'CONTACT INFORMATION:\n' + structuredData.contact + '\n';
    if (structuredData.summary) result += 'SUMMARY:\n' + structuredData.summary + '\n';
    if (structuredData.experience) result += 'EXPERIENCE:\n' + structuredData.experience + '\n';
    if (structuredData.education) result += 'EDUCATION:\n' + structuredData.education + '\n';
    if (structuredData.skills) result += 'SKILLS:\n' + structuredData.skills + '\n';
    
    return result.trim();
  }

  /**
   * 分类行类型 - 基于OpenResume的特征评分系统
   */
  private classifyLine(text: string): LineType {
    const lowerText = text.toLowerCase();
    
    // 联系信息特征
    if (this.hasContactFeatures(lowerText)) {
      return LineType.CONTACT;
    }
    
    // 经验特征
    if (this.hasExperienceFeatures(lowerText)) {
      return LineType.EXPERIENCE;
    }
    
    // 教育特征
    if (this.hasEducationFeatures(lowerText)) {
      return LineType.EDUCATION;
    }
    
    // 技能特征
    if (this.hasSkillsFeatures(lowerText)) {
      return LineType.SKILLS;
    }
    
    // 摘要特征
    if (this.hasSummaryFeatures(lowerText)) {
      return LineType.SUMMARY;
    }
    
    return LineType.UNKNOWN;
  }

  /**
   * 联系信息特征检测（基于OpenResume算法）
   */
  private hasContactFeatures(text: string): boolean {
    const contactPatterns = [
      /@.*\.(com|org|net|edu)/, // 邮箱
      /\+?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}/, // 电话
      /(linkedin\.com|github\.com)/, // 社交媒体
      /(street|avenue|road|drive|lane)/i, // 地址
      /(sydney|melbourne|brisbane|perth|adelaide)/i, // 城市
      /(phone|email|contact)/i, // 联系关键词
      /^[A-Za-z\s]+$/, // 纯姓名（只包含字母和空格）
    ];
    
    return contactPatterns.some(pattern => pattern.test(text));
  }

  /**
   * 经验特征检测（基于OpenResume算法）
   */
  private hasExperienceFeatures(text: string): boolean {
    const experiencePatterns = [
      /(experience|work history|employment|career)/i,
      /(senior|junior|lead|manager|director|ceo|cto|vp)/i,
      /(20\d{2}|19\d{2})/, // 年份
      /(january|february|march|april|may|june|july|august|september|october|november|december)/i,
      /(present|current)/i,
      /(responsibilities|achievements|duties)/i
    ];
    
    return experiencePatterns.some(pattern => pattern.test(text));
  }

  /**
   * 教育特征检测（基于OpenResume算法）
   */
  private hasEducationFeatures(text: string): boolean {
    const educationPatterns = [
      /(education|academic|degree|bachelor|master|phd|university|college|school)/i,
      /(gpa|grade point average)/i,
      /(graduated|graduation|diploma|certificate)/i,
      /(major|minor|concentration)/i
    ];
    
    return educationPatterns.some(pattern => pattern.test(text));
  }

  /**
   * 技能特征检测（基于OpenResume算法）
   */
  private hasSkillsFeatures(text: string): boolean {
    const skillsPatterns = [
      /(skills|technologies|programming|languages|tools)/i,
      /(javascript|python|java|c\+\+|react|angular|vue|node\.js|typescript)/i,
      /(aws|azure|gcp|docker|kubernetes|jenkins|git)/i,
      /(html|css|sql|mongodb|mysql|postgresql)/i,
      /(agile|scrum|jira|confluence)/i
    ];
    
    return skillsPatterns.some(pattern => pattern.test(text));
  }

  /**
   * 摘要特征检测（基于OpenResume算法）
   */
  private hasSummaryFeatures(text: string): boolean {
    const summaryPatterns = [
      /(summary|objective|profile|about|overview)/i,
      /(passionate|experienced|dedicated|motivated|skilled)/i,
      /(years of experience|expertise|specialized)/i
    ];
    
    return summaryPatterns.some(pattern => pattern.test(text));
  }

  /**
   * 清理文本
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // 合并多个空白字符
      .replace(/\n\s*\n/g, '\n') // 合并多个空行
      .trim();
  }
}

// 类型定义
interface Line {
  text: string;
  index: number;
  type: LineType;
}

interface Section {
  type: LineType;
  lines: Line[];
  text: string;
}

enum LineType {
  CONTACT = 'contact',
  SUMMARY = 'summary',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  UNKNOWN = 'unknown'
}

export default OpenResumeVercelSafe; 