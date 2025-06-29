import { useState, useEffect } from 'react';
import { Play, X, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WatchProgress {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  thumbnail: string;
  currentTime: number;
  duration: number;
  lastWatched: Date;
  progress: number; // 0-100
}

interface ResumePlaybackProps {
  watchHistory?: WatchProgress[];
  onResumeLesson?: (lessonId: string, timestamp: number) => void;
  onDismiss?: (lessonId: string) => void;
  maxItems?: number;
  className?: string;
}

export function ResumePlayback({ 
  watchHistory = [], 
  onResumeLesson, 
  onDismiss,
  maxItems = 3,
  className 
}: ResumePlaybackProps) {
  const [recentProgress, setRecentProgress] = useState<WatchProgress[]>([]);
  const [showResumeBar, setShowResumeBar] = useState(false);

  // Mock data for recent watch progress
  const mockWatchHistory: WatchProgress[] = watchHistory.length > 0 ? watchHistory : [
    {
      lessonId: '1',
      lessonTitle: 'Introduction to React Hooks',
      courseTitle: 'React Fundamentals',
      thumbnail: '/api/placeholder/120/80',
      currentTime: 420, // 7 minutes
      duration: 1530, // 25.5 minutes
      lastWatched: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      progress: 27
    },
    {
      lessonId: '2',
      lessonTitle: 'State Management with Context',
      courseTitle: 'React Fundamentals',
      thumbnail: '/api/placeholder/120/80',
      currentTime: 680, // 11 minutes
      duration: 1125, // 18.75 minutes
      lastWatched: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      progress: 60
    },
    {
      lessonId: '3',
      lessonTitle: 'Component Composition Patterns',
      courseTitle: 'Advanced React',
      thumbnail: '/api/placeholder/120/80',
      currentTime: 1200, // 20 minutes
      duration: 1935, // 32.25 minutes
      lastWatched: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      progress: 62
    }
  ];

  useEffect(() => {
    // Filter and sort recent progress
    const filtered = mockWatchHistory
      .filter(item => item.progress > 5 && item.progress < 95) // Only show partially watched
      .sort((a, b) => b.lastWatched.getTime() - a.lastWatched.getTime())
      .slice(0, maxItems);
    
    setRecentProgress(filtered);
    setShowResumeBar(filtered.length > 0);
  }, [maxItems, mockWatchHistory]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const handleResume = (item: WatchProgress) => {
    // TODO: Connect to backend
    onResumeLesson?.(item.lessonId, item.currentTime);
  };

  const handleDismiss = (lessonId: string) => {
    setRecentProgress(prev => prev.filter(item => item.lessonId !== lessonId));
    // TODO: Connect to backend
    onDismiss?.(lessonId);
    
    // Hide resume bar if no items left
    if (recentProgress.length <= 1) {
      setShowResumeBar(false);
    }
  };

  if (!showResumeBar || recentProgress.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Sticky Resume Bar for Mobile */}
      <div className="lg:hidden sticky top-16 z-40 bg-background border-b">
        <div className="p-4">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img 
                    src={recentProgress[0].thumbnail} 
                    alt={recentProgress[0].lessonTitle}
                    className="w-16 h-10 object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {recentProgress[0].lessonTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {recentProgress[0].courseTitle}
                  </p>
                  <div className="mt-1">
                    <Progress 
                      value={recentProgress[0].progress} 
                      className="h-1.5 w-full" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(recentProgress[0].currentTime)} / {formatTime(recentProgress[0].duration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleResume(recentProgress[0])}
                    className="h-8 px-3"
                    aria-label={`Resume ${recentProgress[0].lessonTitle}`}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(recentProgress[0].lessonId)}
                    className="h-8 w-8 p-0"
                    aria-label={`Dismiss ${recentProgress[0].lessonTitle}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Resume Cards */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold">Continue Watching</h2>
            </div>
            
            <div className="space-y-4">
              {recentProgress.map((item) => (
                <div key={item.lessonId} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.lessonTitle}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="relative -mt-1">
                      <Progress 
                        value={item.progress} 
                        className="h-1 w-20" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.lessonTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.courseTitle}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(item.currentTime)} / {formatTime(item.duration)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {getTimeAgo(item.lastWatched)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleResume(item)}
                      aria-label={`Resume ${item.lessonTitle}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(item.lessonId)}
                      aria-label={`Dismiss ${item.lessonTitle}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {recentProgress.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No recent progress to resume</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}