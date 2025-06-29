import { useState } from 'react';
import { Bell, BellRing, Smartphone, Wifi, Download, Clock, MessageSquare, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'learning' | 'social' | 'system';
}

interface DownloadSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  options?: string[];
  selectedOption?: string;
}

interface NotificationSettingsProps {
  onSettingChange?: (settingId: string, enabled: boolean) => void;
  onDownloadSettingChange?: (settingId: string, enabled: boolean, option?: string) => void;
  className?: string;
}

export function NotificationSettings({ 
  onSettingChange, 
  onDownloadSettingChange,
  className 
}: NotificationSettingsProps) {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'new-course',
      title: 'New Course Available',
      description: 'Get notified when new courses are published in your areas of interest',
      icon: <BookOpen className="h-4 w-4" />,
      enabled: true,
      category: 'learning'
    },
    {
      id: 'assignment-due',
      title: 'Assignment Due Soon',
      description: 'Receive reminders 24 hours before assignment deadlines',
      icon: <Clock className="h-4 w-4" />,
      enabled: true,
      category: 'learning'
    },
    {
      id: 'quiz-available',
      title: 'New Quiz Available',
      description: 'Get notified when quizzes become available for your enrolled courses',
      icon: <Bell className="h-4 w-4" />,
      enabled: true,
      category: 'learning'
    },
    {
      id: 'course-completion',
      title: 'Course Completion',
      description: 'Celebrate when you complete a course or module',
      icon: <BellRing className="h-4 w-4" />,
      enabled: true,
      category: 'learning'
    },
    {
      id: 'group-messages',
      title: 'Study Group Messages',
      description: 'Get notified about new messages in your study groups',
      icon: <MessageSquare className="h-4 w-4" />,
      enabled: false,
      category: 'social'
    },
    {
      id: 'forum-replies',
      title: 'Forum Replies',
      description: 'Receive notifications when someone replies to your forum posts',
      icon: <MessageSquare className="h-4 w-4" />,
      enabled: true,
      category: 'social'
    },
    {
      id: 'live-sessions',
      title: 'Live Session Reminders',
      description: 'Get reminded 15 minutes before live sessions start',
      icon: <Clock className="h-4 w-4" />,
      enabled: true,
      category: 'learning'
    }
  ]);

  const [downloadSettings, setDownloadSettings] = useState<DownloadSetting[]>([
    {
      id: 'background-downloads',
      title: 'Background Downloads',
      description: 'Allow downloads to continue when the app is in the background',
      icon: <Download className="h-4 w-4" />,
      enabled: true
    },
    {
      id: 'wifi-only',
      title: 'WiFi Only Downloads',
      description: 'Only download content when connected to WiFi',
      icon: <Wifi className="h-4 w-4" />,
      enabled: true
    },
    {
      id: 'auto-download',
      title: 'Auto-download New Lessons',
      description: 'Automatically download new lessons from enrolled courses',
      icon: <Download className="h-4 w-4" />,
      enabled: false
    },
    {
      id: 'download-quality',
      title: 'Download Quality',
      description: 'Choose video quality for offline downloads',
      icon: <Smartphone className="h-4 w-4" />,
      enabled: true,
      options: ['360p', '720p', '1080p', 'Auto'],
      selectedOption: '720p'
    },
    {
      id: 'storage-limit',
      title: 'Storage Limit',
      description: 'Maximum storage space for offline content',
      icon: <Download className="h-4 w-4" />,
      enabled: true,
      options: ['1 GB', '2 GB', '5 GB', '10 GB', 'Unlimited'],
      selectedOption: '5 GB'
    }
  ]);

  const handleNotificationToggle = (settingId: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    
    const setting = notificationSettings.find(s => s.id === settingId);
    if (setting) {
      // TODO: Connect to backend
      onSettingChange?.(settingId, !setting.enabled);
    }
  };

  const handleDownloadToggle = (settingId: string) => {
    setDownloadSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    
    const setting = downloadSettings.find(s => s.id === settingId);
    if (setting) {
      // TODO: Connect to backend
      onDownloadSettingChange?.(settingId, !setting.enabled, setting.selectedOption);
    }
  };

  const handleOptionChange = (settingId: string, option: string) => {
    setDownloadSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, selectedOption: option }
          : setting
      )
    );
    
    const setting = downloadSettings.find(s => s.id === settingId);
    if (setting) {
      // TODO: Connect to backend
      onDownloadSettingChange?.(settingId, setting.enabled, option);
    }
  };

  const getNotificationsByCategory = (category: string) => {
    return notificationSettings.filter(setting => setting.category === category);
  };

  const getEnabledCount = (category: string) => {
    return getNotificationsByCategory(category).filter(setting => setting.enabled).length;
  };

  const renderNotificationSetting = (setting: NotificationSetting) => (
    <div key={setting.id} className="flex items-center justify-between py-3">
      <div className="flex items-start space-x-3 flex-1">
        <div className="mt-1 text-muted-foreground">
          {setting.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{setting.title}</div>
          <div className="text-xs text-muted-foreground">{setting.description}</div>
        </div>
      </div>
      <Switch
        checked={setting.enabled}
        onCheckedChange={() => handleNotificationToggle(setting.id)}
        aria-label={`Toggle ${setting.title} notifications`}
      />
    </div>
  );

  const renderDownloadSetting = (setting: DownloadSetting) => (
    <div key={setting.id} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="mt-1 text-muted-foreground">
            {setting.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{setting.title}</div>
            <div className="text-xs text-muted-foreground">{setting.description}</div>
          </div>
        </div>
        <Switch
          checked={setting.enabled}
          onCheckedChange={() => handleDownloadToggle(setting.id)}
          aria-label={`Toggle ${setting.title}`}
        />
      </div>
      
      {setting.options && setting.enabled && (
        <div className="ml-7 space-y-2">
          <div className="flex flex-wrap gap-2">
            {setting.options.map(option => (
              <Button
                key={option}
                variant={setting.selectedOption === option ? "default" : "outline"}
                size="sm"
                onClick={() => handleOptionChange(setting.id, option)}
                className="h-7 px-3 text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-4 space-y-6", className)}>
      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Learning & Progress</h3>
                <Badge variant="secondary" className="text-xs">
                  {getEnabledCount('learning')} enabled
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              {getNotificationsByCategory('learning').map(renderNotificationSetting)}
            </div>
          </div>

          <Separator />

          {/* Social Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Social & Community</h3>
                <Badge variant="secondary" className="text-xs">
                  {getEnabledCount('social')} enabled
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              {getNotificationsByCategory('social').map(renderNotificationSetting)}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setNotificationSettings(prev => 
                  prev.map(setting => ({ ...setting, enabled: true }))
                );
              }}
            >
              Enable All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setNotificationSettings(prev => 
                  prev.map(setting => ({ ...setting, enabled: false }))
                );
              }}
            >
              Disable All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Download Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Background Downloads</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {downloadSettings.map(renderDownloadSetting)}
          
          <Separator />
          
          {/* Storage Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Storage Usage</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Downloaded content: 2.3 GB</div>
              <div>Available space: 12.7 GB</div>
              <div>Cache: 150 MB</div>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Test */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // TODO: Send test notification
                console.log('Test notification sent');
              }}
            >
              Send Test Notification
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // TODO: Check notification permissions
                console.log('Checking permissions');
              }}
            >
              Check Permissions
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure notifications are enabled in your device settings for the best experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}