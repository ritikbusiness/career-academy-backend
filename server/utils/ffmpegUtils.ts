import { spawn } from 'child_process';
import fs from 'fs';

export function convertToHLS(inputPath: string, outputDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outputDir, { recursive: true });

    const args = [
      '-i', inputPath,
      '-profile:v', 'baseline',
      '-level', '3.0',
      '-start_number', '0',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-f', 'hls',
      `${outputDir}/index.m3u8`,
    ];

    const ffmpeg = spawn('ffmpeg', args);
    
    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data.toString()}`);
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg conversion failed with code ${code}`));
      }
    });
    
    ffmpeg.on('error', (error) => {
      reject(new Error(`FFmpeg spawn error: ${error.message}`));
    });
  });
}

export function getVideoInfo(inputPath: string): Promise<{ duration: string; resolution: string }> {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-hide_banner',
      '-v', 'quiet',
      '-show_entries', 'format=duration',
      '-show_entries', 'stream=width,height',
      '-of', 'csv=p=0'
    ];

    const ffprobe = spawn('ffprobe', args);
    let output = '';
    
    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ffprobe.on('close', (code) => {
      if (code === 0) {
        const lines = output.trim().split('\n');
        const duration = lines.find(line => !isNaN(parseFloat(line))) || '0';
        const dimensions = lines.find(line => line.includes(',')) || '0,0';
        const [width, height] = dimensions.split(',');
        
        resolve({
          duration: Math.round(parseFloat(duration)).toString(),
          resolution: `${width}x${height}`
        });
      } else {
        reject(new Error(`FFprobe failed with code ${code}`));
      }
    });
  });
}