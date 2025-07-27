/// <reference path="../types/backblaze-b2.d.ts" />
import { B2 } from 'backblaze-b2';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID!,
  applicationKey: process.env.B2_APP_KEY!,
});

export async function uploadToB2(localDir: string, remoteBasePath: string): Promise<string> {
  try {
    await b2.authorize();
    const files = fs.readdirSync(localDir);
    let m3u8Url = '';

    for (const file of files) {
      const filePath = path.join(localDir, file);
      const fileData = fs.readFileSync(filePath);
      const fileName = `${remoteBasePath}/${file}`;

      const { data } = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID! });
      
      await b2.uploadFile({
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
        fileName,
        data: fileData,
      });

      if (file.endsWith('.m3u8')) {
        m3u8Url = `${process.env.CLOUDFLARE_BASE_URL}/${fileName}`;
      }
    }

    return m3u8Url;
  } catch (error) {
    console.error('B2 Upload Error:', error);
    throw new Error(`Failed to upload to B2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateSignedUrl(url: string): string {
  const expiry = Math.floor(Date.now() / 1000) + 6 * 3600; // 6 hours
  const token = crypto
    .createHmac('sha256', process.env.SIGNED_SECRET!)
    .update(url + expiry)
    .digest('hex');
  
  return `${url}?token=${token}&expires=${expiry}`;
}

export function verifySignedUrl(url: string, token: string, expires: string): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiryTime = parseInt(expires);
  
  if (currentTime > expiryTime) {
    return false; // URL expired
  }
  
  const expectedToken = crypto
    .createHmac('sha256', process.env.SIGNED_SECRET!)
    .update(url.split('?')[0] + expiryTime)
    .digest('hex');
  
  return token === expectedToken;
}

export async function deleteFromB2(fileName: string): Promise<void> {
  try {
    await b2.authorize();
    
    const { data: files } = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_ID!,
      prefix: fileName,
    });
    
    for (const file of files.files) {
      await b2.deleteFileVersion({
        fileId: file.fileId,
        fileName: file.fileName,
      });
    }
  } catch (error) {
    console.error('B2 Delete Error:', error);
    throw new Error(`Failed to delete from B2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}