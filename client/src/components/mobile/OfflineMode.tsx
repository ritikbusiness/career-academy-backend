import { useState } from 'react';
import { Download, Check, X, RefreshCw, Wifi, WifiOff, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DownloadableLesson {
  id: string;
  title: string;
  duration: string;
  size: string;
  thumbnail: string;
  moduleTitle: string;
  downloadStatus: 'not-downloaded' | 'downloading' | 'downloaded' | 'failed';
  downloadProgress?: number;
}

interface OfflineModeProps {
  lessons?: DownloadableLesson[];
  onDownload?: (lessonId: string) => void;
  onRetryDownload?: (lessonId: string) => void;
  onRemoveDownload?: (lessonId: string) => void;
  onPlayOffline?: (lessonId: string) => void;
  className?: string;
}

export function OfflineMode({ 
  lessons, 
  onDownload, 
  onRetryDownload, 
  onRemoveDownload, 
  onPlayOffline,
  className 
}: OfflineModeProps) {
  const [view, setView] = useState<'available' | 'queue' | 'library'>('available');

  // Mock data
  const mockLessons: DownloadableLesson[] = lessons || [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      duration: '25:30',
      size: '150 MB',
      thumbnail: '/api/placeholder/300/200',
      moduleTitle: 'React Fundamentals',
      downloadStatus: 'not-downloaded'
    },
    {
      id: '2',
      title: 'State Management with Context',
      duration: '18:45',
      size: '120 MB',
      thumbnail: '/api/placeholder/300/200',
      moduleTitle: 'React Fundamentals',
      downloadStatus: 'downloading',
      downloadProgress: 65
    },
    {
      id: '3',
      title: 'Component Composition Patterns',
      duration: '32:15',
      size: '200 MB',
      thumbnail: '/api/placeholder/300/200',
      moduleTitle: 'Advanced React',
      downloadStatus: 'downloaded'
    },
    {
      id: '4',
      title: 'Performance Optimization',
      duration: '28:20',
      size: '180 MB',
      thumbnail: '/api/placeholder/300/200',
      moduleTitle: 'Advanced React',
      downloadStatus: 'failed'
    }
  ];

  const handleDownload = (lessonId: string) => {
    // TODO: Connect to backend
    onDownload?.(lessonId);
  };

  const handleRetry = (lessonId: string) => {
    // TODO: Connect to backend
    onRetryDownload?.(lessonId);
  };

  const handleRemove = (lessonId: string) => {
    // TODO: Connect to backend
    onRemoveDownload?.(lessonId);
  };

  const handlePlay = (lessonId: string) => {
    // TODO: Connect to backend
    onPlayOffline?.(lessonId);
  };

  const getFilteredLessons = () => {
    switch (view) {
      case 'queue':
        return mockLessons.filter(lesson => 
          lesson.downloadStatus === 'downloading' || lesson.downloadStatus === 'failed'
        );
      case 'library':
        return mockLessons.filter(lesson => lesson.downloadStatus === 'downloaded');
      default:
        return mockLessons;
    }
  };

  const getDownloadStats = () => {
    const downloaded = mockLessons.filter(l => l.downloadStatus === 'downloaded').length;
    const downloading = mockLessons.filter(l => l.downloadStatus === 'downloading').length;
    const failed = mockLessons.filter(l => l.downloadStatus === 'failed').length;
    
    return { downloaded, downloading, failed, total: mockLessons.length };
  };

  const stats = getDownloadStats();

  const renderLessonCard = (lesson: DownloadableLesson) => (
    <Card key={lesson.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={lesson.thumbnail} 
              alt={lesson.title}
              className="w-20 h-12 object-cover rounded"
            />
            {lesson.downloadStatus === 'downloaded' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded">
                <WifiOff className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{lesson.title}</h3>
            <p className="text-xs text-muted-foreground">{lesson.moduleTitle}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{lesson.size}</span>
            </div>
            
            {lesson.downloadStatus === 'downloading' && lesson.downloadProgress !== undefined && (
              <div className="mt-2">
                <Progress value={lesson.downloadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {lesson.downloadProgress}% downloaded
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {lesson.downloadStatus === 'not-downloaded' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(lesson.id)}
                className="h-8 px-3"
                aria-label={`Download ${lesson.title} for offline viewing`}
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
            
            {lesson.downloadStatus === 'downloading' && (
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Downloading
              </Badge>
            )}
            
            {lesson.downloadStatus === 'downloaded' && (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  onClick={() => handlePlay(lesson.id)}
                  className="h-8 px-3"
                  aria-label={`Play ${lesson.title} offline`}
                >
                  <Play className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(lesson.id)}
                  className="h-8 px-3"
                  aria-label={`Remove ${lesson.title} from offline storage`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {lesson.downloadStatus === 'failed' && (
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="destructive" className="text-xs">
                  Failed
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRetry(lesson.id)}
                  className="h-8 px-3"
                  aria-label={`Retry downloading ${lesson.title}`}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-4", className)}>
      {/* Header with Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <WifiOff className="h-5 w-5" />
            <span>Offline Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.downloaded}</div>
              <div className="text-sm text-muted-foreground">Downloaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.downloading}</div>
              <div className="text-sm text-muted-foreground">Downloading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        <Button
          variant={view === 'available' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('available')}
          className="flex-1"
        >
          <Wifi className="h-4 w-4 mr-2" />
          Available
        </Button>
        <Button
          variant={view === 'queue' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('queue')}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Queue ({stats.downloading + stats.failed})
        </Button>
        <Button
          variant={view === 'library' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('library')}
          className="flex-1"
        >
          <WifiOff className="h-4 w-4 mr-2" />
          Library ({stats.downloaded})
        </Button>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {getFilteredLessons().length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <WifiOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {view === 'library' ? 'No Downloaded Lessons' : 
                 view === 'queue' ? 'No Active Downloads' : 
                 'No Lessons Available'}
              </h3>
              <p className="text-muted-foreground">
                {view === 'library' ? 'Download lessons to watch them offline.' : 
                 view === 'queue' ? 'No downloads are currently in progress.' : 
                 'No lessons are available for download.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          getFilteredLessons().map(renderLessonCard)
        )}
      </div>

      {/* Download Settings Card */}
      {view === 'available' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Download Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Auto-download new lessons</div>
                <div className="text-xs text-muted-foreground">
                  Automatically download new lessons when on WiFi
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">WiFi only downloads</div>
                <div className="text-xs text-muted-foreground">
                  Only download when connected to WiFi
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Download quality</div>
                <div className="text-xs text-muted-foreground">
                  Choose video quality for downloads
                </div>
              </div>
              <Button variant="outline" size="sm">
                720p
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}