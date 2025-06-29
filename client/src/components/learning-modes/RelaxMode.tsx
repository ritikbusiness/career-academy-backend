import React, { useState } from 'react';
import { Leaf, Coffee, PenTool, Lightbulb, Heart, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface RelaxSettings {
  enabled: boolean;
  showTips: boolean;
  autoSaveNotes: boolean;
  calmAnimations: boolean;
  extendedBreaks: boolean;
}

export function RelaxMode() {
  const [relaxSettings, setRelaxSettings] = useState<RelaxSettings>({
    enabled: false,
    showTips: true,
    autoSaveNotes: true,
    calmAnimations: true,
    extendedBreaks: true
  });

  const [showTipsModal, setShowTipsModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [relaxTips, setRelaxTips] = useState([
    "Take deep breaths between lessons",
    "Stay hydrated while learning",
    "Take notes to reinforce understanding",
    "It's okay to pause and reflect",
    "Learning is a journey, not a race"
  ]);

  // TODO: connect to backend - relax mode settings
  // const { data: relaxData, mutate: updateRelaxSettings } = useQuery({
  //   queryKey: ['/api/user/relax-settings'],
  //   enabled: !!user
  // });

  const handleSettingChange = (setting: keyof RelaxSettings, value: boolean) => {
    setRelaxSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // TODO: connect to backend - update settings
    // await updateRelaxSettings({
    //   url: '/api/user/relax-settings',
    //   method: 'PATCH',
    //   body: { [setting]: value }
    // });
  };

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      // TODO: connect to backend - save note
      // await mutate({
      //   url: '/api/notes',
      //   method: 'POST',
      //   body: { content: currentNote, mode: 'relax' }
      // });
      
      setCurrentNote('');
    }
  };

  if (relaxSettings.enabled) {
    return (
      <div className="space-y-6">
        {/* Relax Tips Modal */}
        {showTipsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="p-8 max-w-lg mx-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Relax & Learn</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Take your time and enjoy the learning process
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {relaxTips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowTipsModal(false)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                >
                  Continue Learning
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Relax Mode Active Header */}
        <Card className="p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Relax Mode Active</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Take your time, no pressure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                <Heart className="w-3 h-3 mr-1" />
                Mindful Learning
              </Badge>
              <Button
                onClick={() => handleSettingChange('enabled', false)}
                variant="outline"
                size="sm"
              >
                Exit Relax Mode
              </Button>
            </div>
          </div>
        </Card>

        {/* Always-Open Note Taking */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PenTool className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Learning Notes</h3>
            <Badge variant="outline" className="text-xs">Auto-save enabled</Badge>
          </div>
          <Textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Jot down your thoughts, questions, or key insights as you learn..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your notes are automatically saved every 30 seconds
            </p>
            <Button 
              onClick={handleSaveNote}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Note
            </Button>
          </div>
        </Card>

        {/* Mindful Learning Tips */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Mindful Learning Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-4 h-4 text-brown-500" />
                <h4 className="font-semibold text-sm">Take Breaks</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Every 25 minutes, take a 5-minute break to refresh your mind
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h4 className="font-semibold text-sm">Stay Present</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Focus on understanding, not speed. Quality over quantity
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-sm">Reflect & Write</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Writing helps consolidate learning and improve retention
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold text-sm">No Rush</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Learn at your own pace. There's no time pressure here
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowTipsModal(true)}
            variant="outline"
            className="w-full mt-4 border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Show All Relax Tips
          </Button>
        </Card>

        {/* Calm Progress Indicator */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Mindful Learning</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Mindful minutes</span>
              </div>
              <div className="text-green-600 dark:text-green-400 font-bold">45 min</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Notes taken</span>
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-bold">12</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Breaks taken</span>
              </div>
              <div className="text-purple-600 dark:text-purple-400 font-bold">3</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Relax Mode</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mindful learning with no time pressure
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={relaxSettings.enabled}
            onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            id="relax-mode"
          />
          <label htmlFor="relax-mode" className="text-sm font-medium">
            Enable
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <Leaf className="w-6 h-6 mx-auto mb-1 text-green-500" />
          <div className="font-semibold text-sm">Calm Theme</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Soothing colors</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <PenTool className="w-6 h-6 mx-auto mb-1 text-blue-500" />
          <div className="font-semibold text-sm">Note Taking</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Always available</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <Clock className="w-6 h-6 mx-auto mb-1 text-purple-500" />
          <div className="font-semibold text-sm">No Timers</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Learn at your pace</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <Heart className="w-6 h-6 mx-auto mb-1 text-pink-500" />
          <div className="font-semibold text-sm">Mindful Tips</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Gentle guidance</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold">Relax Mode Features:</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium text-sm">Show mindful tips</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Gentle reminders for healthy learning</div>
              </div>
            </div>
            <Switch
              checked={relaxSettings.showTips}
              onCheckedChange={(checked) => handleSettingChange('showTips', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <PenTool className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-sm">Auto-save notes</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Automatically save your learning notes</div>
              </div>
            </div>
            <Switch
              checked={relaxSettings.autoSaveNotes}
              onCheckedChange={(checked) => handleSettingChange('autoSaveNotes', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium text-sm">Calm animations</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Smooth, gentle transitions and effects</div>
              </div>
            </div>
            <Switch
              checked={relaxSettings.calmAnimations}
              onCheckedChange={(checked) => handleSettingChange('calmAnimations', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-amber-600" />
              <div>
                <div className="font-medium text-sm">Extended breaks</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Longer break suggestions between lessons</div>
              </div>
            </div>
            <Switch
              checked={relaxSettings.extendedBreaks}
              onCheckedChange={(checked) => handleSettingChange('extendedBreaks', checked)}
            />
          </div>
        </div>

        <Button
          onClick={() => handleSettingChange('enabled', true)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
        >
          <Leaf className="w-4 h-4 mr-2" />
          Start Relax Mode
        </Button>
      </div>
    </Card>
  );
}