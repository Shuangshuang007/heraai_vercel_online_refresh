import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * 专门用于解析转换后PDF的解析器
 * 独立于现有的PDF解析程序，不影响直接PDF解析
 */
export class ConvertedPdfParser {
  private static instance: ConvertedPdfParser;

  private constructor() {}

  static getInstance(): ConvertedPdfParser {
    if (!ConvertedPdfParser.instance) {
      ConvertedPdfParser.instance = new ConvertedPdfParser();
    }
    return ConvertedPdfParser.instance;
  }

  /**
   * 解析转换后的PDF，使用多个方法兜底
   */
  async parseConvertedPDF(pdfBuffer: Buffer): Promise<string> {
    console.log('○ Parsing converted PDF with specialized parser...');
    console.log('→ PDF Buffer size:', pdfBuffer.length, 'bytes');
    console.log('→ PDF Buffer first 100 bytes:', pdfBuffer.slice(0, 100).toString('hex'));
    
    const errors: string[] = [];

    // 方法1: pdf-parse-debugging-disabled
    try {
      console.log('→ Trying: pdf-parse-debugging-disabled...');
      const pdfParse = require('pdf-parse-debugging-disabled');
      const data = await pdfParse(pdfBuffer);
      console.log('→ pdf-parse-debugging-disabled result:', data ? 'has data' : 'no data', data?.text ? `text length: ${data.text.length}` : 'no text');
      if (data?.text) {
        console.log('→ Raw text content:', data.text.substring(0, 200) + (data.text.length > 200 ? '...' : ''));
      }
      if (data?.text?.trim()) {
        console.log('✓ Parsed with pdf-parse-debugging-disabled');
        return this.cleanText(data.text);
      } else {
        console.log('✗ pdf-parse-debugging-disabled returned empty result');
        errors.push('pdf-parse-debugging-disabled returned empty result');
      }
    } catch (err: any) {
      console.error('✗ Error in pdf-parse-debugging-disabled:', err);
      errors.push(`pdf-parse-debugging-disabled failed: ${err?.message || err}`);
    }

    // 方法2: pdf-text-extract + 临时文件
    try {
      console.log('→ Trying: pdf-text-extract...');
      const pdfTextExtract = require('pdf-text-extract');
      const tempFile = path.join(os.tmpdir(), `converted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`);
      fs.writeFileSync(tempFile, pdfBuffer);
      console.log('→ Created temp file:', tempFile);

      try {
        const text = await pdfTextExtract(tempFile);
        const result = Array.isArray(text) ? text.join('\n') : text;
        console.log('→ pdf-text-extract result:', result ? `text length: ${result.length}` : 'no text');
        if (result?.trim()) {
          console.log('✓ Parsed with pdf-text-extract');
          return this.cleanText(result);
        } else {
          console.log('✗ pdf-text-extract returned empty result');
          errors.push('pdf-text-extract returned empty result');
        }
      } finally {
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          console.warn('⚠ Failed to clean temp file:', e);
        }
      }
    } catch (err: any) {
      console.error('✗ Error in pdf-text-extract:', err);
      errors.push(`pdf-text-extract failed: ${err?.message || err}`);
    }

    // 方法3: 可选的 pdf2txt（建议注释掉）
    try {
      const utilJsPath = path.join(process.cwd(), '.next/server/vendor-chunks/../base/shared/util.js');
      if (fs.existsSync(utilJsPath)) {
        console.log('→ Trying: pdf2txt...');
        const pdf2txt = require('pdf2txt');
        const tempFile = path.join(os.tmpdir(), `converted_pdf2txt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`);
        fs.writeFileSync(tempFile, pdfBuffer);

        try {
          const text = await pdf2txt(tempFile);
          if (text?.trim()) {
            console.log('✓ Parsed with pdf2txt');
            return this.cleanText(text);
          } else {
            errors.push('pdf2txt returned empty result');
          }
        } finally {
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            console.warn('⚠ Failed to clean temp file (pdf2txt):', e);
          }
        }
      } else {
        console.log('○ pdf2txt dependency path not found, skipping');
      }
    } catch (err: any) {
      console.error('✗ Error in pdf2txt:', err);
      errors.push(`pdf2txt failed: ${err?.message || err}`);
    }

    console.error('✗ All converted PDF parsing methods failed');
    console.error('✗ Error details:', errors);
    throw new Error(`Converted PDF parsing failed. Errors: ${errors.join(' | ')}`);
  }

  /**
   * 清理文本
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
}

export default ConvertedPdfParser; 