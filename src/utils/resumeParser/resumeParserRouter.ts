/**
 * 简历解析分流控制器
 * 根据文件类型选择不同的处理路径
 */

import { ZamzarConverter } from './zamzarConverter';
import { UnifiedResumeParser } from './unifiedResumeParser';
import { ConvertedPdfParser } from './convertedPdfParser';

export class ResumeParserRouter {
  private zamzarConverter: ZamzarConverter;
  private pdfParser: UnifiedResumeParser;
  private convertedPdfParser: ConvertedPdfParser;

  constructor() {
    this.zamzarConverter = new ZamzarConverter();
    this.pdfParser = UnifiedResumeParser.getInstance();
    this.convertedPdfParser = ConvertedPdfParser.getInstance();
  }

  /**
   * 获取支持的文件类型
   */
  getSupportedFileTypes(): string[] {
    const zamzarFormats = Object.keys(this.zamzarConverter.getSupportedFormats());
    const directFormats = ['pdf', 'docx', 'txt'];
    
    // 合并所有支持的格式，去重
    return [...new Set([...directFormats, ...zamzarFormats])];
  }

  /**
   * 检查文件类型是否支持
   */
  isFileTypeSupported(fileName: string): boolean {
    const fileType = this.getFileExtension(fileName);
    return this.getSupportedFileTypes().includes(fileType);
  }

  /**
   * 统一简历解析入口
   */
  async parseResume(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();
    const fileType = this.getFileExtension(fileName);

    console.log(`Starting resume parsing for file: ${fileName} (type: ${fileType})`);

    // 检查文件类型是否支持
    if (!this.isFileTypeSupported(fileName)) {
      const supportedTypes = this.getSupportedFileTypes().join(', ');
      throw new Error(`Unsupported file type: ${fileType}. Supported types: ${supportedTypes}`);
    }

    try {
      // 分流处理
      switch (fileType) {
        case 'pdf':
          // 路径1: 直接PDF解析
          console.log('○ Processing PDF file directly...');
          return await this.parsePDFDirectly(file);

        case 'docx':
        case 'txt':
          // 路径2: 直接解析（已有支持）
          console.log(`○ Processing ${fileType} file directly...`);
          return await this.pdfParser.parseResume(file);

        default:
          // 路径3: 转换后PDF解析
          console.log(`○ Converting ${fileType} to PDF for processing...`);
          return await this.parseWithConversion(file);
      }
    } catch (error) {
      console.error('Resume parsing failed:', error);
      throw new Error(`Failed to parse resume: ${error}`);
    }
  }

  /**
   * 直接PDF解析
   */
  private async parsePDFDirectly(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await this.pdfParser.parsePDFWithOpenResume(buffer);
  }

  /**
   * 转换后解析
   */
  private async parseWithConversion(file: File): Promise<string> {
    // 检查Zamzar是否可用
    if (!this.zamzarConverter.isAvailable()) {
      throw new Error('File conversion service not available. Please contact support.');
    }

    // 检查格式是否支持转换
    const fileType = this.getFileExtension(file.name);
    if (!this.zamzarConverter.isFormatSupported(fileType, 'pdf')) {
      throw new Error(`Format ${fileType} is not supported for conversion to PDF`);
    }

    // 使用Zamzar转换为PDF
    const pdfBuffer = await this.zamzarConverter.convertToPDF(file);
    console.log(`✓ File converted to PDF (${pdfBuffer.length} bytes)`);

    // 使用专门的转换后PDF解析器
    try {
      const result = await this.convertedPdfParser.parseConvertedPDF(pdfBuffer);
      if (result && result.trim().length > 0) {
        console.log('✓ Converted PDF parsed successfully with specialized parser');
        return result;
      } else {
        throw new Error('Converted PDF parser returned empty result');
      }
    } catch (error) {
      console.warn('Converted PDF parsing failed, attempting intelligent fallback...');
      return await this.parseWithIntelligentFallback(pdfBuffer, file.name);
    }
  }

  /**
   * 智能fallback解析
   */
  private async parseWithIntelligentFallback(pdfBuffer: Buffer, originalFileName: string): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    console.log('○ Attempting intelligent fallback parsing...');
    
    // 方法1: 使用pdf-parse-debugging-disabled (最稳定)
    try {
      const pdfParse = require('pdf-parse-debugging-disabled');
      const data = await pdfParse(pdfBuffer);
      if (data.text && data.text.trim().length > 0) {
        console.log('✓ Fallback successful with pdf-parse-debugging-disabled');
        return this.cleanText(data.text);
      }
    } catch (error) {
      console.log('○ pdf-parse-debugging-disabled fallback failed:', error instanceof Error ? error.message : String(error));
    }

    // 方法2: 使用临时文件进行pdf-text-extract
    try {
      const pdfTextExtract = require('pdf-text-extract');
      const tempFile = path.join(os.tmpdir(), `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`);
      
      fs.writeFileSync(tempFile, pdfBuffer);
      
      try {
        const text = await pdfTextExtract(tempFile);
        const result = Array.isArray(text) ? text.join('\n') : text;
        
        if (result && result.trim().length > 0) {
          console.log('✓ Fallback successful with pdf-text-extract');
          return this.cleanText(result);
        }
      } finally {
        // 清理临时文件
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          // 忽略清理错误
        }
      }
    } catch (error) {
      console.log('○ pdf-text-extract fallback failed:', error instanceof Error ? error.message : String(error));
    }

    // 方法3: 检查pdf2txt依赖路径，如果存在则尝试
    try {
      const utilJsPath = path.join(process.cwd(), '.next/server/vendor-chunks/../base/shared/util.js');
      if (fs.existsSync(utilJsPath)) {
        const pdf2txt = require('pdf2txt');
        const tempFile = path.join(os.tmpdir(), `fallback_pdf2txt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`);
        
        fs.writeFileSync(tempFile, pdfBuffer);
        
        try {
          const text = await pdf2txt(tempFile);
          if (text && text.trim().length > 0) {
            console.log('✓ Fallback successful with pdf2txt');
            return this.cleanText(text);
          }
        } finally {
          // 清理临时文件
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            // 忽略清理错误
          }
        }
      } else {
        console.log('○ pdf2txt dependency path not found, skipping');
      }
    } catch (error) {
      console.log('○ pdf2txt fallback failed:', error instanceof Error ? error.message : String(error));
    }

    // 所有fallback方法都失败
    console.warn('All fallback methods failed, returning user-friendly message');
    return `Successfully converted ${originalFileName} to PDF, but could not extract text content. The file may be image-based or password-protected. Please try uploading a different format or contact support.`;
  }

  /**
   * 清理文本
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * 获取文件扩展名
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * 获取支持格式的详细信息
   */
  getFormatDetails(): Record<string, any> {
    const zamzarFormats = this.zamzarConverter.getSupportedFormats();
    const directFormats = {
      'pdf': { description: 'Portable Document Format', conversion: 'Direct parsing' },
      'docx': { description: 'Microsoft Word Document', conversion: 'Direct parsing' },
      'txt': { description: 'Plain Text File', conversion: 'Direct parsing' }
    };

    const zamzarDetails: Record<string, any> = {};
    Object.entries(zamzarFormats).forEach(([format, targets]) => {
      zamzarDetails[format] = {
        description: `${format.toUpperCase()} Document`,
        conversion: `Convert to ${targets.join(', ')} via Zamzar`
      };
    });

    return {
      ...directFormats,
      ...zamzarDetails
    };
  }
} 