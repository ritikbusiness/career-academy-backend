import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Bell, 
  Eye, 
  Keyboard, 
  Type, 
  Palette, 
  Play,
  Settings,
  Accessibility
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Import our new components
import { MobileVideoPlayer } from '@/components/mobile/MobileVideoPlayer';
import { OfflineMode } from '@/components/mobile/OfflineMode';
import { NotificationSettings } from '@/components/mobile/NotificationSettings';
import { ResumePlayback } from '@/components/mobile/ResumePlayback';
import { SkipToContent, ScreenReaderOnly, AccessibleHeading } from '@/components/accessibility/SkipToContent';
import { ClosedCaptions } from '@/components/accessibility/ClosedCaptions';
import { useKeyboardNavigation, KeyboardNavItem } from '@/components/accessibility/KeyboardNavigation';

interface DemoFeature {
  id: string;
  title: string;
  description: string;
  category: 'mobile' | 'accessibility';
  icon: React.ReactNode;
  component: React.ReactNode;
  tags: string[];
}

export default function MobileAccessibilityDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('mobile-video');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const features: DemoFeature[] = [
    {
      id: 'mobile-video',
      title: 'Mobile Video Player',
      description: 'Touch-friendly video controls with fullscreen support, captions, and playback speed controls',
      category: 'mobile',
      icon: <Play className="h-5 w-5" />,
      tags: ['Video', 'Touch Controls', 'Fullscreen', 'Captions'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Experience our mobile-optimized video player with touch-friendly controls, 
            fullscreen support, and accessibility features.
          </p>
          <MobileVideoPlayer
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title="Sample Video: Mobile Development Best Practices"
            onProgress={(progress) => setCurrentVideoTime(progress)}
          />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Touch-friendly play/pause controls</li>
              <li>10-second skip forward/backward</li>
              <li>Volume slider with mute toggle</li>
              <li>Fullscreen mode with proper orientation handling</li>
              <li>Auto-hiding controls during playback</li>
              <li>Playback speed controls</li>
              <li>Closed captions with customizable styling</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'offline-mode',
      title: 'Offline Download System',
      description: 'Download lessons for offline viewing with queue management and background downloads',
      category: 'mobile',
      icon: <Download className="h-5 w-5" />,
      tags: ['Offline', 'Downloads', 'Storage', 'Queue'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Manage offline content with our comprehensive download system. 
            Download lessons for offline viewing and manage your storage efficiently.
          </p>
          <OfflineMode lessons={[]} />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>One-tap lesson downloads with progress tracking</li>
              <li>Download queue with retry functionality</li>
              <li>Offline library with downloaded content organization</li>
              <li>WiFi-only download settings</li>
              <li>Storage management and cache clearing</li>
              <li>Background download support</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Push Notification Settings',
      description: 'Comprehensive notification preferences and background download controls',
      category: 'mobile',
      icon: <Bell className="h-5 w-5" />,
      tags: ['Notifications', 'Settings', 'Mobile App'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Configure your notification preferences for learning reminders, 
            social interactions, and background download settings.
          </p>
          <NotificationSettings />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Granular notification controls by category</li>
              <li>Learning progress and assignment reminders</li>
              <li>Social notifications for study groups and forums</li>
              <li>Background download preferences</li>
              <li>Storage and data usage controls</li>
              <li>Notification testing and permission management</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'resume-playback',
      title: 'Resume Playback',
      description: 'Sticky resume bar and continue watching functionality',
      category: 'mobile',
      icon: <Play className="h-5 w-5" />,
      tags: ['Resume', 'Progress', 'UX'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Never lose your place! Our resume playback system remembers where you left off 
            and provides easy access to continue watching.
          </p>
          <ResumePlayback />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Sticky resume bar on mobile for quick access</li>
              <li>Progress tracking with visual indicators</li>
              <li>Time-based sorting of recent watch history</li>
              <li>One-tap resume from exact timestamp</li>
              <li>Dismissible resume suggestions</li>
              <li>Desktop and mobile optimized layouts</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'screen-reader',
      title: 'Screen Reader Support',
      description: 'Semantic HTML, ARIA labels, and skip-to-content functionality',
      category: 'accessibility',
      icon: <Eye className="h-5 w-5" />,
      tags: ['Screen Reader', 'ARIA', 'Semantic HTML'],
      component: (
        <div className="space-y-4">
          <SkipToContent />
          <ScreenReaderOnly>
            This content is only visible to screen readers and demonstrates our accessibility support.
          </ScreenReaderOnly>
          
          <p className="text-muted-foreground">
            Our platform provides comprehensive screen reader support with proper semantic markup 
            and ARIA labels throughout the interface.
          </p>
          
          <div className="space-y-4">
            <AccessibleHeading level={3} id="demo-heading">
              Screen Reader Features Demo
            </AccessibleHeading>
            
            <div className="bg-muted/50 rounded-lg p-4" role="region" aria-labelledby="demo-heading">
              <div className="space-y-3">
                <div>
                  <label htmlFor="demo-input" className="block text-sm font-medium mb-1">
                    Accessible Form Input
                  </label>
                  <input
                    id="demo-input"
                    type="text"
                    placeholder="This input has proper labeling"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    aria-describedby="demo-input-help"
                  />
                  <p id="demo-input-help" className="text-xs text-muted-foreground mt-1">
                    This help text is properly associated with the input
                  </p>
                </div>
                
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Demo button with descriptive label"
                >
                  Accessible Button
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Accessibility Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Skip-to-content link (press Tab to see it)</li>
              <li>Proper heading hierarchy (h1, h2, h3, etc.)</li>
              <li>ARIA labels and descriptions</li>
              <li>Form label associations</li>
              <li>Landmark regions and navigation</li>
              <li>Screen reader only content for context</li>
              <li>Live regions for dynamic content announcements</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'keyboard-nav',
      title: 'Keyboard Navigation',
      description: 'Full keyboard accessibility with focus management and navigation controls',
      category: 'accessibility',
      icon: <Keyboard className="h-5 w-5" />,
      tags: ['Keyboard', 'Focus', 'Navigation'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Navigate our entire platform using only your keyboard. 
            All interactive elements are accessible via Tab, Enter, and arrow keys.
          </p>
          
          <KeyboardNavigationDemo />
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Keyboard Navigation Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Tab navigation through all interactive elements</li>
              <li>Arrow key navigation in lists and grids</li>
              <li>Enter/Space activation for buttons and links</li>
              <li>Escape key to close modals and dropdowns</li>
              <li>Home/End keys for quick navigation</li>
              <li>Visible focus indicators with high contrast</li>
              <li>Focus trapping in modal dialogs</li>
              <li>Roving tabindex for radio groups</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'closed-captions',
      title: 'Closed Captions',
      description: 'Customizable video captions with VTT file support and styling options',
      category: 'accessibility',
      icon: <Type className="h-5 w-5" />,
      tags: ['Captions', 'VTT', 'Video', 'Accessibility'],
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Comprehensive closed caption system with customizable styling, 
            VTT file upload support, and real-time caption display.
          </p>
          <ClosedCaptions currentTime={currentVideoTime} />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Caption Features:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Real-time caption display synced with video playback</li>
              <li>Customizable font size, family, and colors</li>
              <li>Adjustable background opacity and positioning</li>
              <li>VTT file upload for custom captions</li>
              <li>Sample VTT file generation</li>
              <li>Screen reader announcements for caption text</li>
              <li>WCAG compliance for color contrast</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'color-contrast',
      title: 'Color Contrast & WCAG',
      description: 'WCAG-compliant color schemes with light/dark mode support',
      category: 'accessibility',
      icon: <Palette className="h-5 w-5" />,
      tags: ['WCAG', 'Contrast', 'Colors', 'Dark Mode'],
      component: (
        <ColorContrastDemo />
      )
    }
  ];

  const mobileFeatures = features.filter(f => f.category === 'mobile');
  const accessibilityFeatures = features.filter(f => f.category === 'accessibility');

  const { containerProps, focusIndex } = useKeyboardNavigation({
    itemCount: features.length,
    orientation: 'grid',
    gridColumns: 2,
    onActivate: (index) => setActiveDemo(features[index].id)
  });

  return (
    <main id="main-content" className="container mx-auto px-4 py-8 space-y-8" tabIndex={-1}>
      <SkipToContent />
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Smartphone className="h-8 w-8 text-blue-600" />
          <Accessibility className="h-8 w-8 text-green-600" />
        </div>
        <AccessibleHeading level={1} className="text-3xl font-bold">
          Mobile & Accessibility Features
        </AccessibleHeading>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive mobile optimization and accessibility features designed 
          for inclusive learning experiences across all devices and abilities.
        </p>
      </div>

      {/* Feature Categories */}
      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mobile" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Mobile Features ({mobileFeatures.length})</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center space-x-2">
            <Accessibility className="h-4 w-4" />
            <span>Accessibility ({accessibilityFeatures.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mobile" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" {...containerProps}>
            {mobileFeatures.map((feature, index) => (
              <KeyboardNavItem
                key={feature.id}
                index={index}
                className={`cursor-pointer transition-all duration-200 ${
                  activeDemo === feature.id 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setActiveDemo(feature.id)}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feature.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </KeyboardNavItem>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessibilityFeatures.map((feature, index) => (
              <KeyboardNavItem
                key={feature.id}
                index={index + mobileFeatures.length}
                className={`cursor-pointer transition-all duration-200 ${
                  activeDemo === feature.id 
                    ? 'ring-2 ring-blue-500 scale-[1.02]' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setActiveDemo(feature.id)}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feature.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </KeyboardNavItem>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Demo */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {features.find(f => f.id === activeDemo)?.icon}
            <span>{features.find(f => f.id === activeDemo)?.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {features.find(f => f.id === activeDemo)?.component}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>How to Test These Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Keyboard Navigation Testing</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Use Tab to navigate between interactive elements</li>
                <li>Use arrow keys to navigate within lists and grids</li>
                <li>Press Enter or Space to activate buttons</li>
                <li>Press Escape to close modals and dropdowns</li>
                <li>Use Home/End for quick navigation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Screen Reader Testing</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Enable VoiceOver (Mac) or NVDA/JAWS (Windows)</li>
                <li>Navigate using screen reader shortcuts</li>
                <li>Listen for proper announcements and context</li>
                <li>Test form interactions and error messages</li>
                <li>Verify heading hierarchy navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

// Keyboard Navigation Demo Component
function KeyboardNavigationDemo() {
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const items = ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'];

  const { containerProps } = useKeyboardNavigation({
    itemCount: items.length,
    orientation: 'vertical',
    onActivate: (index) => setSelectedItem(index)
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click in this area and use arrow keys to navigate, Enter to select:
      </p>
      <div {...containerProps} className="border rounded-lg p-4 space-y-2 bg-muted/20">
        {items.map((item, index) => (
          <KeyboardNavItem
            key={index}
            index={index}
            className={`p-3 rounded border ${
              selectedItem === index 
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300' 
                : 'bg-background border-border hover:bg-muted/50'
            }`}
            onClick={() => setSelectedItem(index)}
          >
            <div className="flex items-center justify-between">
              <span>{item}</span>
              {selectedItem === index && (
                <Badge variant="default" className="text-xs">Selected</Badge>
              )}
            </div>
          </KeyboardNavItem>
        ))}
      </div>
    </div>
  );
}

// Color Contrast Demo Component
function ColorContrastDemo() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Our design system follows WCAG 2.1 AA guidelines for color contrast ratios, 
        ensuring readability for users with visual impairments.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Light Theme Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Light Theme Contrast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 bg-white text-black border rounded">
                <span className="font-medium">Primary Text (21:1)</span>
                <p className="text-sm">High contrast for main content</p>
              </div>
              <div className="p-3 bg-white text-gray-600 border rounded">
                <span className="font-medium">Secondary Text (7:1)</span>
                <p className="text-sm">Good contrast for supporting content</p>
              </div>
              <div className="p-3 bg-blue-600 text-white rounded">
                <span className="font-medium">Primary Button (4.5:1)</span>
                <p className="text-sm">WCAG AA compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Theme Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dark Theme Contrast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 bg-gray-900 text-white border rounded">
                <span className="font-medium">Primary Text (21:1)</span>
                <p className="text-sm">High contrast for main content</p>
              </div>
              <div className="p-3 bg-gray-900 text-gray-300 border rounded">
                <span className="font-medium">Secondary Text (7:1)</span>
                <p className="text-sm">Good contrast for supporting content</p>
              </div>
              <div className="p-3 bg-blue-500 text-white rounded">
                <span className="font-medium">Primary Button (4.5:1)</span>
                <p className="text-sm">WCAG AA compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">WCAG Compliance Features:</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Minimum 4.5:1 contrast ratio for normal text</li>
          <li>Minimum 3:1 contrast ratio for large text</li>
          <li>High contrast mode support</li>
          <li>Reduced motion preferences</li>
          <li>Focus indicators with 3:1 contrast minimum</li>
          <li>Color is not the only visual indicator</li>
          <li>Touch targets minimum 44x44px (48x48px on mobile)</li>
        </ul>
      </div>
    </div>
  );
}