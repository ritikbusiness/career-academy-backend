import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Loader2, Monitor, HardDrive, Wifi, Settings,
  BarChart3, Clock, Database, Image, Video, Globe
} from 'lucide-react';

interface PerformanceSettings {
  lazyLoading: boolean;
  videoQuality: 'auto' | '360p' | '720p' | '1080p' | '4k';
  compressionLevel: 'low' | 'medium' | 'high';
  cacheEnabled: boolean;
  cdnEnabled: boolean;
  preloadContent: boolean;
  adaptiveStreaming: boolean;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  videoLoadTime: number;
  cacheHitRate: number;
  bandwidth: number;
  compressionRatio: number;
  cdnLatency: number;
}

interface PerformanceOptimizationProps {
  userRole: 'student' | 'instructor' | 'admin';
  currentSettings?: PerformanceSettings;
}

export default function PerformanceOptimization({ userRole, currentSettings }: PerformanceOptimizationProps) {
  const [settings, setSettings] = useState<PerformanceSettings>(currentSettings || {
    lazyLoading: true,
    videoQuality: 'auto',
    compressionLevel: 'medium',
    cacheEnabled: true,
    cdnEnabled: true,
    preloadContent: false,
    adaptiveStreaming: true
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [metrics] = useState<PerformanceMetrics>({
    pageLoadTime: 2.3,
    videoLoadTime: 1.8,
    cacheHitRate: 87,
    bandwidth: 45.2,
    compressionRatio: 68,
    cdnLatency: 12
  });

  const handleSettingChange = (key: keyof PerformanceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: connect to backend - update performance settings
  };

  const handleOptimizePerformance = async () => {
    setIsOptimizing(true);
    // TODO: connect to backend - run performance optimization
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
  };

  const getPerformanceScore = () => {
    let score = 0;
    if (settings.lazyLoading) score += 15;
    if (settings.cacheEnabled) score += 20;
    if (settings.cdnEnabled) score += 25;
    if (settings.adaptiveStreaming) score += 20;
    if (settings.compressionLevel === 'high') score += 15;
    else if (settings.compressionLevel === 'medium') score += 10;
    if (settings.videoQuality === 'auto') score += 5;
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Improvement' };
  };

  const performanceScore = getPerformanceScore();
  const scoreBadge = getScoreBadge(performanceScore);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Optimization
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Optimize content delivery and user experience
          </p>
        </div>
        
        <Button 
          onClick={handleOptimizePerformance}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
        </Button>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Score
            </span>
            <Badge variant={scoreBadge.variant}>
              {scoreBadge.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {performanceScore}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ 100</span>
            </div>
            <Progress value={performanceScore} className="h-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on current optimization settings and content delivery configuration
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.pageLoadTime}s
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Page Load</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.videoLoadTime}s
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Video Load</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.cacheHitRate}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Cache Hit</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Wifi className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.bandwidth}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Mbps</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <HardDrive className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.compressionRatio}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Compression</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {metrics.cdnLatency}ms
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">CDN Latency</div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Loading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5" />
              Content Loading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Lazy Loading</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Load content as users scroll
                </p>
              </div>
              <Switch
                checked={settings.lazyLoading}
                onCheckedChange={(checked) => handleSettingChange('lazyLoading', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Preload Content</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Preload next lessons and resources
                </p>
              </div>
              <Switch
                checked={settings.preloadContent}
                onCheckedChange={(checked) => handleSettingChange('preloadContent', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Adaptive Streaming</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Adjust quality based on connection
                </p>
              </div>
              <Switch
                checked={settings.adaptiveStreaming}
                onCheckedChange={(checked) => handleSettingChange('adaptiveStreaming', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Video & Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video & Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Video Quality</h4>
              <Select 
                value={settings.videoQuality} 
                onValueChange={(value: any) => handleSettingChange('videoQuality', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Recommended)</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4k">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Compression Level</h4>
              <Select 
                value={settings.compressionLevel} 
                onValueChange={(value: any) => handleSettingChange('compressionLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Best Quality)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Fastest Loading)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Caching & CDN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Caching & Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Browser Caching</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cache resources locally
                </p>
              </div>
              <Switch
                checked={settings.cacheEnabled}
                onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">CDN Acceleration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Global content delivery network
                </p>
              </div>
              <Switch
                checked={settings.cdnEnabled}
                onCheckedChange={(checked) => handleSettingChange('cdnEnabled', checked)}
              />
            </div>

            {settings.cacheEnabled && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Cache Status</div>
                  <div className="text-blue-700 dark:text-blue-300">
                    Hit Rate: {metrics.cacheHitRate}% | Size: 2.3 GB
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">CPU Usage</span>
                <span className="font-medium">23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                <span className="font-medium">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Network Load</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!settings.lazyLoading && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                    Enable Lazy Loading
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Improve initial page load time by loading content as needed
                  </p>
                </div>
              </div>
            )}

            {!settings.cdnEnabled && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Enable CDN
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Reduce latency and improve global content delivery speed
                  </p>
                </div>
              </div>
            )}

            {settings.videoQuality !== 'auto' && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <Video className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Use Auto Video Quality
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Let the system choose optimal quality based on user's connection
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}