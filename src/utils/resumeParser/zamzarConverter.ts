/**
 * Zamzar API 文件转换器
 * 支持多种格式转换为PDF，用于简历解析
 */
import FormData from 'form-data';
import fetch from 'node-fetch';

export class ZamzarConverter {
  private apiKey: string;
  private baseUrl = 'https://api.zamzar.com/v1';

  constructor() {
    this.apiKey = process.env.ZAMZAR_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Zamzar API key not found. File conversion will be disabled.');
    }
  }

  /**
   * 检查API是否可用
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * 获取支持转换的格式列表
   */
  getSupportedFormats(): Record<string, string[]> {
    return {
      // 输入格式 -> 输出格式
      'doc': ['pdf', 'docx', 'txt'],
      'docx': ['pdf', 'txt'],
      'rtf': ['pdf', 'docx', 'txt'],
      'txt': ['pdf'],
      'odt': ['pdf', 'docx'],
      'wps': ['pdf', 'docx'],
      'wpd': ['pdf', 'docx'],
      'abw': ['pdf', 'docx'],
      'fodt': ['pdf', 'docx'],
      'sxw': ['pdf', 'docx'],
      'uot': ['pdf', 'docx'],
      'xml': ['pdf', 'docx'],
      'html': ['pdf'],
      'htm': ['pdf'],
      'mht': ['pdf'],
      'mhtml': ['pdf']
    };
  }

  /**
   * 检查文件格式是否支持转换
   */
  isFormatSupported(inputFormat: string, outputFormat: string = 'pdf'): boolean {
    const supported = this.getSupportedFormats();
    return supported[inputFormat]?.includes(outputFormat) || false;
  }

  /**
   * 将文件转换为PDF
   */
  async convertToPDF(file: File): Promise<Buffer> {
    if (!this.isAvailable()) {
      throw new Error('Zamzar API not available');
    }

    const inputFormat = this.getFileExtension(file.name);
    if (!this.isFormatSupported(inputFormat, 'pdf')) {
      throw new Error(`Unsupported format: ${inputFormat} -> pdf`);
    }

    console.log(`○ Converting ${inputFormat} to PDF using Zamzar...`);

    try {
      // 1. 上传文件
      const uploadResult = await this.uploadFile(file);
      console.log(`✓ File uploaded to Zamzar (ID: ${uploadResult.id})`);

      // 2. 创建转换任务
      const jobResult = await this.createConversionJob(uploadResult.id, inputFormat, 'pdf');
      console.log(`✓ Conversion job created (ID: ${jobResult.id})`);

      // 3. 等待转换完成
      const convertedFile = await this.waitForConversion(jobResult.id);
      console.log(`✓ File converted successfully (ID: ${convertedFile.id})`);

      // 4. 下载转换后的文件
      const pdfBuffer = await this.downloadFile(convertedFile.id);
      console.log(`✓ PDF downloaded (${pdfBuffer.length} bytes)`);

      return pdfBuffer;
    } catch (error) {
      console.error('Zamzar conversion failed:', error);
      throw new Error(`File conversion failed: ${error}`);
    }
  }

  /**
   * 上传文件到Zamzar
   */
  async uploadFile(file: File): Promise<{ id: number }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`○ Debug: File size: ${buffer.length} bytes`);
    console.log(`○ Debug: File name: ${file.name}`);
    console.log(`○ Debug: File type: ${file.type}`);

    const form = new FormData();
    form.append('content', buffer, {
      filename: file.name,
      contentType: file.type || 'application/octet-stream'
    });

    console.log(`○ Debug: FormData headers:`, form.getHeaders());

    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`○ Debug: Response status: ${response.status}`);
      console.log(`○ Debug: Response error: ${error}`);
      throw new Error(`Upload failed: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  /**
   * 创建转换任务
   */
  private async createConversionJob(fileId: number, fromFormat: string, toFormat: string): Promise<{ id: number }> {
    console.log(`○ Debug: Creating conversion job with fileId: ${fileId}, target_format: ${toFormat}`);
    
    const form = new FormData();
    form.append('source_file', fileId.toString());
    form.append('target_format', toFormat);
    
    console.log(`○ Debug: FormData for job creation:`, {
      source_file: fileId.toString(),
      target_format: toFormat
    });
    
    const response = await fetch(`${this.baseUrl}/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`○ Debug: Job creation failed - Status: ${response.status}, Error: ${error}`);
      throw new Error(`Job creation failed: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  /**
   * 等待转换完成
   */
  private async waitForConversion(jobId: number): Promise<{ id: number }> {
    let result;
    while (!result) {
      await new Promise((res) => setTimeout(res, 2000));
      const poll = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
        }
      });
      const status = await poll.json();
      if (status.status === 'successful') {
        result = status.target_files[0];
      } else if (status.status === 'failed') {
        throw new Error(`Conversion failed: ${status.failure?.message || 'Unknown error'}`);
      }
      console.log(`○ Waiting for conversion... (status: ${status.status})`);
    }
    return result;
  }



  /**
   * 下载文件
   */
  private async downloadFile(fileId: number): Promise<Buffer> {
    const fileRes = await fetch(`${this.baseUrl}/files/${fileId}/content`, {
      headers: {
        Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
      }
    });

    if (!fileRes.ok) {
      const error = await fileRes.text();
      throw new Error(`Download failed: ${fileRes.status} - ${error}`);
    }

    return Buffer.from(await fileRes.arrayBuffer());
  }

  /**
   * 获取文件扩展名
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
} 