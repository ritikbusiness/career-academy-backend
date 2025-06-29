import { useState, useRef, useEffect } from 'react';
import { Upload, Type, Eye, EyeOff, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CaptionCue {
  start: number;
  end: number;
  text: string;
  id: string;
}

interface CaptionSettings {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  opacity: number;
  position: 'bottom' | 'top';
  enabled: boolean;
}

interface ClosedCaptionsProps {
  currentTime: number;
  captions?: CaptionCue[];
  onCaptionUpload?: (file: File) => void;
  onSettingsChange?: (settings: CaptionSettings) => void;
  className?: string;
}

export function ClosedCaptions({ 
  currentTime, 
  captions = [], 
  onCaptionUpload, 
  onSettingsChange,
  className 
}: ClosedCaptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captionSettings, setCaptionSettings] = useState<CaptionSettings>({
    fontSize: 16,
    fontFamily: 'Arial',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    opacity: 80,
    position: 'bottom',
    enabled: true
  });

  // Mock captions data in VTT format
  const mockCaptions: CaptionCue[] = captions.length > 0 ? captions : [
    {
      id: '1',
      start: 0,
      end: 4,
      text: 'Welcome to this comprehensive lesson on mobile accessibility.'
    },
    {
      id: '2',
      start: 4,
      end: 8,
      text: 'Today we\'ll explore how to make mobile apps accessible to everyone.'
    },
    {
      id: '3',
      start: 8,
      end: 12,
      text: 'We\'ll cover screen readers, keyboard navigation, and visual accessibility.'
    },
    {
      id: '4',
      start: 12,
      end: 16,
      text: 'Let\'s start by understanding the importance of semantic HTML.'
    },
    {
      id: '5',
      start: 16,
      end: 20,
      text: 'Proper ARIA labels and roles are essential for screen reader users.'
    },
    {
      id: '6',
      start: 20,
      end: 24,
      text: 'Color contrast and text size ensure readability for all users.'
    },
    {
      id: '7',
      start: 24,
      end: 28,
      text: 'Focus management helps keyboard users navigate efficiently.'
    },
    {
      id: '8',
      start: 28,
      end: 32,
      text: 'Remember to test your app with actual assistive technologies.'
    }
  ];

  const [currentCaption, setCurrentCaption] = useState<CaptionCue | null>(null);

  // Find current caption based on video time
  useEffect(() => {
    if (!captionSettings.enabled) {
      setCurrentCaption(null);
      return;
    }

    const caption = mockCaptions.find(
      cap => currentTime >= cap.start && currentTime <= cap.end
    );
    setCurrentCaption(caption || null);
  }, [currentTime, captionSettings.enabled, mockCaptions]);

  const updateSettings = (newSettings: Partial<CaptionSettings>) => {
    const updated = { ...captionSettings, ...newSettings };
    setCaptionSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.vtt')) {
      // TODO: Parse VTT file and extract captions
      onCaptionUpload?.(file);
      console.log('VTT file uploaded:', file.name);
    }
  };

  const generateVTTFile = () => {
    let vttContent = 'WEBVTT\n\n';
    
    mockCaptions.forEach((caption, index) => {
      const startTime = formatVTTTime(caption.start);
      const endTime = formatVTTTime(caption.end);
      
      vttContent += `${index + 1}\n`;
      vttContent += `${startTime} --> ${endTime}\n`;
      vttContent += `${caption.text}\n\n`;
    });

    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.vtt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatVTTTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const getCaptionStyle = () => ({
    fontSize: `${captionSettings.fontSize}px`,
    fontFamily: captionSettings.fontFamily,
    backgroundColor: `${captionSettings.backgroundColor}${Math.round(captionSettings.opacity * 2.55).toString(16).padStart(2, '0')}`,
    color: captionSettings.textColor,
    bottom: captionSettings.position === 'bottom' ? '80px' : 'auto',
    top: captionSettings.position === 'top' ? '20px' : 'auto'
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Caption Display */}
      {currentCaption && captionSettings.enabled && (
        <div 
          className="absolute left-4 right-4 text-center p-3 rounded-lg max-w-4xl mx-auto pointer-events-none"
          style={getCaptionStyle()}
        >
          <p className="leading-relaxed">
            {currentCaption.text}
          </p>
        </div>
      )}

      {/* Caption Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="h-5 w-5" />
            <span>Closed Captions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Captions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {captionSettings.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="font-medium">Show Captions</span>
            </div>
            <Switch
              checked={captionSettings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
              aria-label="Toggle captions"
            />
          </div>

          <Separator />

          {/* Caption Settings */}
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Size: {captionSettings.fontSize}px
              </label>
              <Slider
                value={[captionSettings.fontSize]}
                onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                min={12}
                max={32}
                step={2}
                className="w-full"
                aria-label="Caption font size"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <Select 
                value={captionSettings.fontFamily} 
                onValueChange={(fontFamily) => updateSettings({ fontFamily })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Opacity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Background Opacity: {captionSettings.opacity}%
              </label>
              <Slider
                value={[captionSettings.opacity]}
                onValueChange={(value) => updateSettings({ opacity: value[0] })}
                min={0}
                max={100}
                step={10}
                className="w-full"
                aria-label="Caption background opacity"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <Select 
                value={captionSettings.position} 
                onValueChange={(position: 'bottom' | 'top') => updateSettings({ position })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={captionSettings.textColor}
                    onChange={(e) => updateSettings({ textColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                    aria-label="Caption text color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {captionSettings.textColor}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={captionSettings.backgroundColor}
                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                    aria-label="Caption background color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {captionSettings.backgroundColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="font-medium">Upload Caption File</h3>
            <p className="text-sm text-muted-foreground">
              Upload a VTT (WebVTT) file to provide custom captions for this video.
            </p>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload VTT File
              </Button>
              
              <Button
                variant="outline"
                onClick={generateVTTFile}
                title="Download sample VTT file"
              >
                <Download className="h-4 w-4 mr-2" />
                Sample VTT
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".vtt"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload caption file"
            />
          </div>

          {/* Caption Preview */}
          <div className="space-y-2">
            <h3 className="font-medium">Preview</h3>
            <div 
              className="p-4 rounded-lg text-center"
              style={{
                fontSize: `${captionSettings.fontSize}px`,
                fontFamily: captionSettings.fontFamily,
                backgroundColor: `${captionSettings.backgroundColor}${Math.round(captionSettings.opacity * 2.55).toString(16).padStart(2, '0')}`,
                color: captionSettings.textColor
              }}
            >
              This is how your captions will appear
            </div>
          </div>

          {/* Accessibility Tips */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Accessibility Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ensure high contrast between text and background colors</li>
              <li>Use fonts that are easy to read on small screens</li>
              <li>Test captions with different screen sizes and orientations</li>
              <li>Provide speaker identification for multiple speakers</li>
              <li>Include sound effects and music descriptions when relevant</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current Caption for Screen Readers */}
      {currentCaption && (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {currentCaption.text}
        </div>
      )}
    </div>
  );
}