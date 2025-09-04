import { GridFSBucket, ObjectId } from 'mongodb';
import { connectToProfileDB } from './profileDatabaseService';

/**
 * 上传PDF到GridFS
 * @param fileBuffer PDF文件的Buffer
 * @param filename 文件名
 * @returns GridFS的ObjectId字符串
 */
export async function uploadPDF(fileBuffer: Buffer, filename: string): Promise<string> {
  try {
    const { db } = await connectToProfileDB();
    const bucket = new GridFSBucket(db);
    
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'application/pdf',
      metadata: {
        uploadedAt: new Date(),
        fileType: 'resume'
      }
    });
    
    uploadStream.write(fileBuffer);
    uploadStream.end();
    
    console.log(`[GridFS] PDF uploaded successfully: ${filename}, ID: ${uploadStream.id}`);
    return uploadStream.id.toString();
  } catch (error) {
    console.error('[GridFS] Error uploading PDF:', error);
    throw error;
  }
}

/**
 * 从GridFS下载PDF
 * @param fileId GridFS的ObjectId字符串
 * @returns PDF文件的Buffer
 */
export async function downloadPDF(fileId: string): Promise<Buffer> {
  try {
    const { db } = await connectToProfileDB();
    const bucket = new GridFSBucket(db);
    
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      downloadStream.on('data', chunk => chunks.push(chunk));
      downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
      downloadStream.on('error', reject);
    });
  } catch (error) {
    console.error('[GridFS] Error downloading PDF:', error);
    throw error;
  }
}

/**
 * 获取GridFS文件元数据
 * @param fileId GridFS的ObjectId字符串
 * @returns 文件元数据
 */
export async function getPDFMetadata(fileId: string): Promise<{ filename: string; contentType: string } | null> {
  try {
    const { db } = await connectToProfileDB();
    const bucket = new GridFSBucket(db);
    
    const files = bucket.find({ _id: new ObjectId(fileId) });
    const fileArray = await files.toArray();
    
    if (fileArray.length === 0) {
      return null;
    }
    
    const file = fileArray[0];
    return {
      filename: file.filename || 'document.pdf',
      contentType: file.contentType || 'application/pdf'
    };
  } catch (error) {
    console.error('[GridFS] Error getting PDF metadata:', error);
    return null;
  }
}

/**
 * 删除GridFS中的PDF
 * @param fileId GridFS的ObjectId字符串
 * @returns 是否删除成功
 */
export async function deletePDF(fileId: string): Promise<boolean> {
  try {
    const { db } = await connectToProfileDB();
    const bucket = new GridFSBucket(db);
    
    await bucket.delete(new ObjectId(fileId));
    console.log(`[GridFS] PDF deleted successfully: ${fileId}`);
    return true;
  } catch (error) {
    console.error('[GridFS] Error deleting PDF:', error);
    return false;
  }
}
