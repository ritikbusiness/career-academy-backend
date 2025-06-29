import React, { useState } from 'react';
import { Play, SkipForward, FastForward, Pause, Volume2, Settings, Tv, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface BingeSettings {
  enabled: boolean;
  autoplay: boolean;
  skipIntro: boolean;
  playbackSpeed: number;
  autoSkipQuiz: boolean;
  marathonMode: boolean;
}

interface Episode {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  progress: number;
  type: 'lesson' | 'quiz' | 'assignment';
}

export function BingeMode() {
  const [bingeSettings, setBingeSettings] = useState<BingeSettings>({
    enabled: false,
    autoplay: true,
    skipIntro: false,
    playbackSpeed: 1.25,
    autoSkipQuiz: false,
    marathonMode: false
  });

  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [marathonProgress, setMarathonProgress] = useState(0);

  // TODO: connect to backend - binge mode settings
  // const { data: bingeData, mutate: updateBingeSettings } = useQuery({
  //   queryKey: ['/api/user/binge-settings'],
  //   enabled: !!user
  // });

  const mockEpisodes: Episode[] = [
    {
      id: 'ep1',
      title: 'Introduction to React Components',
      duration: '12:34',
      isCompleted: true,
      progress: 100,
      type: 'lesson'
    },
    {
      id: 'ep2', 
      title: 'JSX and Props Deep Dive',
      duration: '15:42',
      isCompleted: true,
      progress: 100,
      type: 'lesson'
    },
    {
      id: 'ep3',
      title: 'Quiz: Component Basics',
      duration: '5:00',
      isCompleted: true,
      progress: 100,
      type: 'quiz'
    },
    {
      id: 'ep4',
      title: 'State Management with useState',
      duration: '18:30',
      isCompleted: false,
      progress: 65,
      type: 'lesson'
    },
    {
      id: 'ep5',
      title: 'Effect Hooks and Side Effects',
      duration: '22:15',
      isCompleted: false,
      progress: 0,
      type: 'lesson'
    },
    {
      id: 'ep6',
      title: 'Advanced Hooks Patterns',
      duration: '25:45',
      isCompleted: false,
      progress: 0,
      type: 'lesson'
    }
  ];

  const handleSettingChange = (setting: keyof BingeSettings, value: boolean | number) => {
    setBingeSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // TODO: connect to backend - update settings
    // await updateBingeSettings({
    //   url: '/api/user/binge-settings',
    //   method: 'PATCH',
    //   body: { [setting]: value }
    // });
  };

  const handlePlayNext = () => {
    if (currentEpisode < mockEpisodes.length - 1) {
      setCurrentEpisode(prev => prev + 1);
      setIsPlaying(true);
      setMarathonProgress(prev => prev + (100 / mockEpisodes.length));
      
      // TODO: connect to backend - track episode progress
      // await mutate({
      //   url: '/api/progress/episode',
      //   method: 'POST',
      //   body: { episodeId: mockEpisodes[currentEpisode + 1].id }
      // });
    }
  };

  const handleSkipIntro = () => {
    // Simulate skipping intro
    // TODO: connect to backend - skip to main content
  };

  const completedEpisodes = mockEpisodes.filter(ep => ep.isCompleted).length;
  const totalDuration = mockEpisodes.reduce((acc, ep) => {
    const [mins, secs] = ep.duration.split(':').map(Number);
    return acc + mins + (secs / 60);
  }, 0);

  if (bingeSettings.enabled) {
    return (
      <div className="space-y-6">
        {/* Netflix-style Binge Header */}
        <Card className="p-6 bg-gradient-to-r from-red-900 via-purple-900 to-black text-white border-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Binge Mode</h2>
                <p className="text-red-200">React Fundamentals Series</p>
              </div>
            </div>
            <Button
              onClick={() => handleSettingChange('enabled', false)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Exit Binge Mode
            </Button>
          </div>

          {/* Episode Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Episode {currentEpisode + 1} of {mockEpisodes.length}</span>
              <span>{completedEpisodes} completed</span>
            </div>
            <Progress 
              value={(currentEpisode / mockEpisodes.length) * 100} 
              className="h-2 bg-white/20"
            />
          </div>

          {/* Current Episode Info */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{mockEpisodes[currentEpisode].title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                  <span>{mockEpisodes[currentEpisode].duration}</span>
                  <Badge variant="outline" className="border-red-400 text-red-300">
                    {mockEpisodes[currentEpisode].type}
                  </Badge>
                  <span>Speed: {bingeSettings.playbackSpeed}x</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/20 hover:bg-white/30"
                  size="sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handlePlayNext}
                  className="bg-white/20 hover:bg-white/30"
                  size="sm"
                  disabled={currentEpisode >= mockEpisodes.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Skip Intro Button */}
        {bingeSettings.skipIntro && isPlaying && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              onClick={handleSkipIntro}
              className="bg-black/80 hover:bg-black text-white border border-white/20"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Intro
            </Button>
          </div>
        )}

        {/* Next Episode Preview */}
        {showNextEpisode && currentEpisode < mockEpisodes.length - 1 && (
          <div className="fixed bottom-4 left-4 z-50">
            <Card className="p-4 bg-black/80 text-white border border-white/20 max-w-sm">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-300">Next Episode</p>
                  <h4 className="font-semibold">{mockEpisodes[currentEpisode + 1].title}</h4>
                  <p className="text-xs text-gray-400">{mockEpisodes[currentEpisode + 1].duration}</p>
                </div>
              </div>
              <Button
                onClick={handlePlayNext}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Play Now
              </Button>
            </Card>
          </div>
        )}

        {/* Binge Controls */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Binge Controls
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Playback Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Playback Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Autoplay next episode</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Automatically start the next episode</p>
                </div>
                <Switch
                  checked={bingeSettings.autoplay}
                  onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Skip intro</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Show skip intro button during lessons</p>
                </div>
                <Switch
                  checked={bingeSettings.skipIntro}
                  onCheckedChange={(checked) => handleSettingChange('skipIntro', checked)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Playback Speed: {bingeSettings.playbackSpeed}x</label>
                <Slider
                  value={[bingeSettings.playbackSpeed]}
                  onValueChange={([value]) => handleSettingChange('playbackSpeed', value)}
                  min={0.5}
                  max={2}
                  step={0.25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>1.5x</span>
                  <span>2x</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto-skip quizzes</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Skip simple quizzes in binge mode</p>
                </div>
                <Switch
                  checked={bingeSettings.autoSkipQuiz}
                  onCheckedChange={(checked) => handleSettingChange('autoSkipQuiz', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Marathon mode</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Minimal breaks between episodes</p>
                </div>
                <Switch
                  checked={bingeSettings.marathonMode}
                  onCheckedChange={(checked) => handleSettingChange('marathonMode', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Episode List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Episodes</h3>
          <div className="space-y-3">
            {mockEpisodes.map((episode, index) => (
              <div
                key={episode.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  index === currentEpisode
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : episode.isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                }`}
                onClick={() => setCurrentEpisode(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentEpisode
                      ? 'bg-red-500 text-white'
                      : episode.isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {index === currentEpisode ? (
                      isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />
                    ) : episode.isCompleted ? (
                      '✓'
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{episode.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{episode.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {episode.type}
                      </Badge>
                      {episode.progress > 0 && episode.progress < 100 && (
                        <span className="text-blue-600 dark:text-blue-400">{episode.progress}% complete</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {episode.progress > 0 && episode.progress < 100 && (
                  <div className="mt-3">
                    <Progress value={episode.progress} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Binge Stats */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <h3 className="text-lg font-semibold mb-4">Your Binge Session</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {completedEpisodes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Episodes Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(totalDuration)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {bingeSettings.playbackSpeed}x
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.round((completedEpisodes / mockEpisodes.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Course Progress</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-red-50 via-purple-50 to-pink-50 dark:from-red-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Binge Mode</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Watch lessons like your favorite series
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={bingeSettings.enabled}
            onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            id="binge-mode"
          />
          <label htmlFor="binge-mode" className="text-sm font-medium">
            Enable
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <Play className="w-6 h-6 mx-auto mb-1 text-red-500" />
          <div className="font-semibold text-sm">Autoplay</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Continuous viewing</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <SkipForward className="w-6 h-6 mx-auto mb-1 text-blue-500" />
          <div className="font-semibold text-sm">Skip Intro</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Jump to content</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <FastForward className="w-6 h-6 mx-auto mb-1 text-purple-500" />
          <div className="font-semibold text-sm">Speed Control</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Faster playback</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <Clock className="w-6 h-6 mx-auto mb-1 text-green-500" />
          <div className="font-semibold text-sm">Marathon</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Minimal breaks</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2">What you get in Binge Mode:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Automatic episode progression</li>
          <li>• Netflix-style interface with episode thumbnails</li>
          <li>• Skip intro and outro sections</li>
          <li>• Adjustable playback speed (0.5x to 2x)</li>
          <li>• Episode progress tracking</li>
          <li>• Marathon mode for intensive learning sessions</li>
        </ul>
      </div>

      <Button
        onClick={() => handleSettingChange('enabled', true)}
        className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white"
      >
        <Tv className="w-4 h-4 mr-2" />
        Start Binge Mode
      </Button>
    </Card>
  );
}