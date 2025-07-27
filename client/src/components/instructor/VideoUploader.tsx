import React, { useState, useCallback } from 'react';
import { Upload, Video, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadResult {
  url: string;
  originalUrl: string;
  duration: string;
  resolution: string;
  fileName: string;
}

interface VideoUploaderProps {
  onUploadComplete: (result: VideoUploadResult) => void;
  currentVideoUrl?: string;
  lessonId?: number;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  currentVideoUrl,
  lessonId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please select a valid video file (MP4, AVI, MOV, WMV, FLV)');
      return;
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('File size must be less than 500MB');
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');
    setUploadStatus('idle');
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const uploadProgress = Math.round((event.loaded / event.total) * 50); // 50% for upload
          setProgress(uploadProgress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setProgress(100);
          setUploadStatus('success');
          const result: VideoUploadResult = JSON.parse(xhr.responseText);
          onUploadComplete(result);
          
          toast({
            title: "Upload Successful",
            description: "Video has been uploaded and processed successfully.",
          });

          // Update lesson if lessonId is provided
          if (lessonId) {
            updateLessonVideo(lessonId, result);
          }
        } else {
          throw new Error(JSON.parse(xhr.responseText).error || 'Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error during upload');
      };

      // Simulate processing progress after upload
      xhr.addEventListener('loadstart', () => {
        setTimeout(() => {
          if (uploadStatus === 'uploading') {
            setUploadStatus('processing');
            setProgress(75); // Processing progress
          }
        }, 1000);
      });

      xhr.open('POST', '/api/upload/video');
      xhr.send(formData);

    } catch (error) {
      setUploadStatus('error');
      const message = error instanceof Error ? error.message : 'Upload failed';
      setErrorMessage(message);
      toast({
        title: "Upload Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [selectedFile, onUploadComplete, lessonId, toast, uploadStatus]);

  const updateLessonVideo = async (lessonId: number, result: VideoUploadResult) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/video`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: result.originalUrl,
          duration: result.duration,
          resolution: result.resolution,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson video');
      }
    } catch (error) {
      console.error('Error updating lesson video:', error);
      toast({
        title: "Warning",
        description: "Video uploaded but lesson update failed. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Video className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading video...';
      case 'processing':
        return 'Converting to HLS format...';
      case 'success':
        return 'Upload completed successfully!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Ready to upload';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Secure Video Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Video Status */}
        {currentVideoUrl && (
          <Alert>
            <Video className="h-4 w-4" />
            <AlertDescription>
              Current video is active. Uploading a new video will replace the existing one.
            </AlertDescription>
          </Alert>
        )}

        {/* File Selection */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : 'Choose video file'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP4, AVI, MOV, WMV, FLV (Max 500MB)
                </p>
              </div>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium">Selected file:</p>
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                Size: {Math.round(selectedFile.size / (1024 * 1024))} MB
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-gray-500">
              {uploadStatus === 'uploading' && 'Uploading to secure storage...'}
              {uploadStatus === 'processing' && 'Converting video for optimal streaming...'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {uploadStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Video uploaded successfully! It's now available for streaming with adaptive bitrates.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing...'}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </>
          )}
        </Button>

        {/* Upload Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Videos are automatically converted to HLS format for optimal streaming</p>
          <p>• All uploads are secured with time-limited access tokens</p>
          <p>• Supports adaptive bitrate streaming for all devices</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUploader;