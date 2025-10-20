import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // 如果已经是PDF，直接返回
    if (fileExtension === 'pdf') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      return NextResponse.json({
        success: true,
        pdfUrl: `/uploads/${fileName}`,
        filename: fileName
      });
    }

    // 如果是DOCX/DOC，需要转换为PDF
    if (['docx', 'doc'].includes(fileExtension || '')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      // 保存原始文件
      const originalFilePath = join(uploadDir, fileName);
      await writeFile(originalFilePath, buffer);
      
      // 生成PDF文件名
      const pdfFileName = fileName.replace(/\.(docx|doc)$/i, '.pdf');
      const pdfFilePath = join(uploadDir, pdfFileName);
      
      try {
        // 使用libreoffice转换文件
        await execAsync(`libreoffice --headless --convert-to pdf "${originalFilePath}" --outdir "${uploadDir}"`);
        
        return NextResponse.json({
          success: true,
          pdfUrl: `/uploads/${pdfFileName}`,
          filename: pdfFileName,
          originalFile: fileName
        });
      } catch (conversionError) {
        console.error('File conversion error:', conversionError);
        
        // 如果转换失败，返回原始文件信息
        return NextResponse.json({
          success: true,
          pdfUrl: `/uploads/${fileName}`,
          filename: fileName,
          note: 'File conversion failed, original file preserved'
        });
      }
    }

    // 不支持的文件类型
    return NextResponse.json(
      { success: false, error: 'Unsupported file type' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('[Convert File API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




