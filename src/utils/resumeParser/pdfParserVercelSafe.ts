import { PDFDocument } from 'pdf-lib';

// 纯JavaScript PDF解析器 - Vercel兼容
export class VercelSafePDFParser {
  private static instance: VercelSafePDFParser;
  
  private constructor() {}
  
  static getInstance(): VercelSafePDFParser {
    if (!VercelSafePDFParser.instance) {
      VercelSafePDFParser.instance = new VercelSafePDFParser();
    }
    return VercelSafePDFParser.instance;
  }

  /**
   * 主要PDF解析方法 - 使用多重fallback机制
   */
  async parsePDF(buffer: Buffer): Promise<string> {
    const errors: string[] = [];
    
    // 方法1: pdf-parse-debugging-disabled (主要方法)
    try {
      const pdfParse = require('pdf-parse-debugging-disabled');
      const data = await pdfParse(buffer);
      if (data.text && data.text.trim().length > 0) {
        console.log('✓ PDF parsed successfully with pdf-parse-debugging-disabled');
        return this.cleanText(data.text);
      }
    } catch (error) {
      errors.push(`pdf-parse-debugging-disabled failed: ${error}`);
    }

    // 方法2: pdf-text-extract (备用方法1)
    try {
      const pdfTextExtract = require('pdf-text-extract');
      const text = await pdfTextExtract(buffer);
      if (text && text.length > 0) {
        console.log('✓ PDF parsed successfully with pdf-text-extract');
        return this.cleanText(text.join('\n'));
      }
    } catch (error) {
      errors.push(`pdf-text-extract failed: ${error}`);
    }

    // 方法3: pdf2txt (备用方法2)
    try {
      const pdf2txt = require('pdf2txt');
      const text = await pdf2txt(buffer);
      if (text && text.trim().length > 0) {
        console.log('✓ PDF parsed successfully with pdf2txt');
        return this.cleanText(text);
      }
    } catch (error) {
      errors.push(`pdf2txt failed: ${error}`);
    }

    // 方法4: 尝试修复PDF后重新解析
    try {
      const fixedBuffer = await this.fixPDF(buffer);
      if (fixedBuffer) {
        const pdfParse = require('pdf-parse-debugging-disabled');
        const data = await pdfParse(fixedBuffer);
        if (data.text && data.text.trim().length > 0) {
          console.log('✓ PDF parsed successfully after fixing');
          return this.cleanText(data.text);
        }
      }
    } catch (error) {
      errors.push(`PDF fix and re-parse failed: ${error}`);
    }

    // 所有方法都失败
    console.error('All PDF parsing methods failed:', errors);
    throw new Error(`PDF parsing failed. All methods exhausted: ${errors.join('; ')}`);
  }



  /**
   * 尝试修复损坏的PDF
   */
  private async fixPDF(buffer: Buffer): Promise<Buffer | null> {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { 
        ignoreEncryption: true,
        updateMetadata: false 
      });
      
      // 如果PDF加载成功，重新保存以修复可能的损坏
      const fixedPdfBytes = await pdfDoc.save();
      return Buffer.from(fixedPdfBytes);
    } catch (error) {
      console.warn('PDF fix attempt failed:', error);
      return null;
    }
  }

  /**
   * 清理提取的文本
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // 合并多个空白字符
      .replace(/\n\s*\n/g, '\n') // 合并多个空行
      .trim();
  }

  /**
   * 检测PDF是否可解析
   */
  async isPDFParseable(buffer: Buffer): Promise<boolean> {
    try {
      await this.parsePDF(buffer);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default VercelSafePDFParser; 