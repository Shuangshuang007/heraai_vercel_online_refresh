import VercelSafePDFParser from './pdfParserVercelSafe';
import OpenResumeVercelSafe from './openResumeVercelSafe';
import FileConverter from './fileConverter';
import mammoth from 'mammoth';
import { ZamzarConverter } from './zamzarConverter';

// 统一简历解析器
export class UnifiedResumeParser {
  private static instance: UnifiedResumeParser;
  private pdfParser: VercelSafePDFParser;
  private openResumeParser: OpenResumeVercelSafe;
  private fileConverter: FileConverter;
  private zamzarConverter: ZamzarConverter;
  
  private constructor() {
    this.pdfParser = VercelSafePDFParser.getInstance();
    this.openResumeParser = OpenResumeVercelSafe.getInstance();
    this.fileConverter = FileConverter.getInstance();
    this.zamzarConverter = new ZamzarConverter();
  }
  
  static getInstance(): UnifiedResumeParser {
    if (!UnifiedResumeParser.instance) {
      UnifiedResumeParser.instance = new UnifiedResumeParser();
    }
    return UnifiedResumeParser.instance;
  }

  /**
   * 统一简历解析入口
   */
  async parseResume(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();
    const fileType = this.fileConverter.detectFileType(fileName);

    console.log(`Starting resume parsing for file: ${fileName} (type: ${fileType})`);

    try {
      // 检查文件类型是否支持
      if (!this.fileConverter.isFileTypeSupported(fileName)) {
        throw new Error(`Unsupported file type: ${fileType}. Only PDF, DOCX, and TXT files are supported.`);
      }

      // 根据文件类型选择解析方法
      switch (fileType) {
        case 'pdf':
          const buffer = await this.fileToBuffer(file);
          return await this.parsePDFWithOpenResume(buffer);
        case 'docx':
          return await this.parseDocx(file);
        case 'txt':
          return await this.parseTxt(file);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Resume parsing failed:', error);
      throw new Error(`Failed to parse resume: ${error}`);
    }
  }

  /**
   * 使用OpenResume算法解析PDF文件
   */
  async parsePDFWithOpenResume(buffer: Buffer): Promise<string> {
    try {
      // 首先尝试OpenResume算法
      try {
        const structuredText = await this.openResumeParser.parsePDF(buffer);
        console.log('✓ PDF parsed successfully with OpenResume algorithm');
        return structuredText;
      } catch (openResumeError) {
        console.warn('OpenResume parsing failed, falling back to standard parser:', openResumeError);
        
        // 如果OpenResume失败，回退到标准解析器
        const text = await this.pdfParser.parsePDF(buffer);
        
        if (!text || text.trim().length === 0) {
          throw new Error('PDF parsing returned empty text');
        }
        
        console.log('✓ PDF parsed successfully with fallback parser');
        return text;
      }
    } catch (error) {
      console.error('PDF parsing failed:', error);
      throw new Error(`PDF parsing failed: ${error}`);
    }
  }

  /**
   * 解析DOCX文件
   */
  private async parseDocx(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX parsing returned empty text');
      }
      
      console.log('✓ DOCX parsed successfully');
      return result.value;
    } catch (error) {
      console.error('DOCX parsing failed:', error);
      console.log('○ Attempting Zamzar fallback for DOCX...');
      
      // Zamzar fallback
      try {
        if (this.zamzarConverter.isAvailable()) {
          console.log('○ Converting DOCX to PDF using Zamzar...');
          const pdfBuffer = await this.zamzarConverter.convertToPDF(file);
          console.log(`✓ DOCX converted to PDF (${pdfBuffer.length} bytes)`);
          
          // 使用PDF解析器解析转换后的文件
          const text = await this.parsePDFWithOpenResume(pdfBuffer);
          console.log('✓ DOCX parsed successfully via Zamzar conversion');
          return text;
        } else {
          throw new Error('Zamzar API not available for fallback');
        }
      } catch (zamzarError) {
        console.error('Zamzar fallback failed:', zamzarError);
        throw new Error(`DOCX parsing failed: ${error}. Zamzar fallback also failed: ${zamzarError}`);
      }
    }
  }

  /**
   * 解析TXT文件
   */
  private async parseTxt(file: File): Promise<string> {
    try {
      const text = await file.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('TXT parsing returned empty text');
      }
      
      console.log('✓ TXT parsed successfully');
      return text;
    } catch (error) {
      console.error('TXT parsing failed:', error);
      throw new Error(`TXT parsing failed: ${error}`);
    }
  }

  /**
   * 将File转换为Buffer
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 获取支持的文件类型
   */
  getSupportedFileTypes(): string[] {
    return ['pdf', 'docx', 'doc', 'txt', 'pages'];
  }

  /**
   * 检查文件类型是否支持
   */
  isFileTypeSupported(fileName: string): boolean {
    const fileType = this.fileConverter.detectFileType(fileName);
    return this.getSupportedFileTypes().includes(fileType);
  }
}

export default UnifiedResumeParser; 