export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { parseResumeWithGPT } from '@/gpt-services/resume/parseResume';
import { ResumeParserRouter } from '@/utils/resumeParser/resumeParserRouter';

/**
 * 统一简历解析API - 支持多种格式文件
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function POST(request: Request) {
  try {
    console.log('○ Starting unified resume parsing process');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('❌ Error: No file received');
      return NextResponse.json(
        { error: 'Please upload a resume file' },
        { status: 400 }
      );
    }

    console.log(`✓ Received file: ${file.name} (${file.type})`);

    // 使用分流控制器
    const router = new ResumeParserRouter();
    
    // 检查文件类型是否支持
    if (!router.isFileTypeSupported(file.name)) {
      const supportedTypes = router.getSupportedFileTypes().join(', ');
      console.log(`❌ Error: Unsupported file type. Supported types: ${supportedTypes}`);
      return NextResponse.json(
        { 
          error: `Unsupported file type. Please upload one of: ${supportedTypes}` 
        },
        { status: 400 }
      );
    }

    // 使用分流控制器解析文件
    console.log('○ Extracting text from file using router...');
    const text = await router.parseResume(file);
    console.log(`✓ Extracted ${text.length} characters of text`);
    console.log('Text preview:\n' + text.substring(0, 200));

    // 保留原有的GPT解析服务调用
    console.log('○ Parsing resume with GPT...');
    const parsed = await parseResumeWithGPT(text);
    console.log('✓ Resume parsed successfully with GPT');
    
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('❌ Error: Failed to process resume');
    console.error('Error details:\n' + error.stack);
    return NextResponse.json(
      { error: 'Failed to process resume, please try again' },
      { status: 500 }
    );
  }
} 
