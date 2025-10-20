import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseResumeWithGPT } from '@/gpt-services/resume/parseResume';

export const runtime = 'nodejs'; // 确保不是 edge runtime

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      try {
        // 第一步：用pdf-lib修复PDF结构（解决XRef问题）
        console.log('Attempting to repair PDF structure...');
        const pdfLib = await import('pdf-lib');
        const pdfDoc = await pdfLib.PDFDocument.load(buffer, {
          ignoreEncryption: true,
          updateMetadata: false
        });
        const repairedBuffer = await pdfDoc.save();
        console.log('✓ PDF structure repaired successfully');
        
        // 第二步：用pdf-parse-lite解析修复后的PDF
        const pdfParse = (await import('pdf-parse-lite')).default;
        const data = await pdfParse(Buffer.from(repairedBuffer));
        extractedText = data.text || '';
        
        console.log('✓ PDF parsed successfully with pdf-parse-lite');
        
              } catch (error) {
          console.error('PDF repair/parsing failed:', error);
          
          // 如果修复失败，尝试直接解析原文件
          try {
            console.log('PDF repair failed, trying direct parse with pdf-parse-lite...');
            const pdfParse = (await import('pdf-parse-lite')).default;
            const data = await pdfParse(buffer);
            extractedText = data.text || '';
            console.log('✓ PDF parsed successfully with pdf-parse-lite');
            
          } catch (secondError) {
            console.log('pdf-parse-lite failed, trying pdf-parse-debugging-disabled...');
            
            try {
              // 备用方案：使用pdf-parse-debugging-disabled
              const pdfParseDebug = (await import('pdf-parse-debugging-disabled')).default;
              const data = await pdfParseDebug(buffer);
              extractedText = data.text || '';
              console.log('✓ PDF parsed successfully with pdf-parse-debugging-disabled');
              
            } catch (thirdError) {
              console.error('All PDF parsing methods failed:', {
                repair: error instanceof Error ? error.message : String(error),
                lite: secondError instanceof Error ? secondError.message : String(secondError),
                debug: thirdError instanceof Error ? thirdError.message : String(thirdError)
              });
              
              return NextResponse.json({ 
                error: 'Unable to extract text from this PDF. The file may be corrupted, password-protected, or contain only images. Please try uploading a different file or convert to DOCX format.' 
              }, { status: 400 });
            }
          }
        }
    } else if (fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || '';
    } else if (fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'Empty content extracted' }, { status: 400 });
    }

    const parsedData = await parseResumeWithGPT(extractedText);
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error('❌ Resume upload error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 