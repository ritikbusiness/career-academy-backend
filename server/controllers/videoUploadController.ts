import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

import { uploadToB2, generateSignedUrl, verifySignedUrl } from '../utils/b2Utils';
import { convertToHLS, getVideoInfo } from '../utils/ffmpegUtils';
import { db } from '../db';
import { lessons } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: { id: number; role: string };
}

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'temp/',
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});

export const handleSecureVideoUpload = [
  upload.single('video'),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const localPath = req.file.path;
      const baseName = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.-]/g, '');
      const hlsDir = `temp/hls/${baseName}`;

      console.log('Starting video processing for:', req.file.originalname);

      // Get video information
      const videoInfo = await getVideoInfo(localPath);
      console.log('Video info:', videoInfo);

      // Convert to HLS
      console.log('Converting to HLS...');
      await convertToHLS(localPath, hlsDir);

      // Upload to B2
      console.log('Uploading to B2...');
      const uploadedBasePath = `videos/${baseName}`;
      const m3u8Url = await uploadToB2(hlsDir, uploadedBasePath);

      // Clean up temporary files
      fs.rmSync(localPath, { force: true });
      fs.rmSync(hlsDir, { recursive: true, force: true });

      // Generate signed URL
      const signedUrl = generateSignedUrl(m3u8Url);

      console.log('Video upload completed successfully');

      res.status(200).json({ 
        url: signedUrl,
        originalUrl: m3u8Url,
        duration: videoInfo.duration,
        resolution: videoInfo.resolution,
        fileName: baseName
      });
    } catch (error) {
      console.error('Video upload error:', error);
      
      // Clean up on error
      if (req.file?.path) {
        fs.rmSync(req.file.path, { force: true });
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Video upload failed' 
      });
    }
  }
];

export const verifyVideoAccess = async (req: Request, res: Response) => {
  try {
    const { url, token, expires } = req.query;
    
    if (!url || !token || !expires) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const isValid = verifySignedUrl(url as string, token as string, expires as string);
    
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid or expired video URL' });
    }

    // Check if user is enrolled in the course (additional security)
    const userId = req.user?.id; // Assuming you have user auth middleware
    if (userId) {
      // You can add enrollment verification here
      // const enrollment = await db.select().from(enrollments).where(...)
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Video access verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

export const updateLessonVideo = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { videoUrl, duration, resolution } = req.body;

    if (!lessonId || !videoUrl) {
      return res.status(400).json({ error: 'Lesson ID and video URL are required' });
    }

    await db
      .update(lessons)
      .set({ 
        videoUrl,
        duration: duration || null,
      })
      .where(eq(lessons.id, parseInt(lessonId)));

    res.status(200).json({ message: 'Lesson video updated successfully' });
  } catch (error) {
    console.error('Update lesson video error:', error);
    res.status(500).json({ error: 'Failed to update lesson video' });
  }
};

export const regenerateVideoUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    const signedUrl = generateSignedUrl(originalUrl);
    
    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error('Regenerate video URL error:', error);
    res.status(500).json({ error: 'Failed to regenerate video URL' });
  }
};