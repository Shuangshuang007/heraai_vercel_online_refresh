// 文件转换工具 - 支持DOCX、PDF和TXT文件解析
export class FileConverter {
  private static instance: FileConverter;
  
  private constructor() {}
  
  static getInstance(): FileConverter {
    if (!FileConverter.instance) {
      FileConverter.instance = new FileConverter();
    }
    return FileConverter.instance;
  }

  /**
   * 检测文件类型
   */
  detectFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop() || '';
    return extension;
  }

  /**
   * 将File转换为Buffer
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 统一文件转换入口 - 只支持DOCX、PDF和TXT
   */
  async convertFileToPdf(file: File): Promise<{ buffer: Buffer; originalType: string }> {
    const fileName = file.name.toLowerCase();
    const originalType = this.detectFileType(fileName);

    console.log(`Processing file: ${fileName} (type: ${originalType})`);

    switch (originalType) {
      case 'pdf':
        const buffer = await this.fileToBuffer(file);
        return {
          buffer: buffer,
          originalType: 'pdf'
        };
      case 'docx':
        const docxBuffer = await this.fileToBuffer(file);
        return {
          buffer: docxBuffer,
          originalType: 'docx'
        };
      case 'txt':
        const txtBuffer = await this.fileToBuffer(file);
        return {
          buffer: txtBuffer,
          originalType: 'txt'
        };
      default:
        throw new Error(`Unsupported file type: ${originalType}. Only PDF, DOCX, and TXT files are supported.`);
    }
  }

  /**
   * 检查文件是否需要转换为PDF
   */
  needsPdfConversion(fileName: string): boolean {
    const extension = this.detectFileType(fileName);
    return ['docx', 'txt'].includes(extension);
  }

  /**
   * 获取支持的文件类型
   */
  getSupportedFileTypes(): string[] {
    return ['pdf', 'docx', 'txt'];
  }

  /**
   * 检查文件类型是否支持
   */
  isFileTypeSupported(fileName: string): boolean {
    const fileType = this.detectFileType(fileName);
    return this.getSupportedFileTypes().includes(fileType);
  }
}

export default FileConverter; 