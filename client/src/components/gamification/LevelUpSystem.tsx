import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

interface LevelBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  xpRequired: number;
}

interface LevelUpSystemProps {
  onLevelUp?: (newLevel: number) => void;
}

export function LevelUpSystem({ onLevelUp }: LevelUpSystemProps) {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    currentLevel: 5,
    currentXP: 750,
    xpToNextLevel: 1000,
    totalXP: 4750
  });

  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState<number | null>(null);

  // TODO: connect to backend - fetch user level data
  // const { data: levelData } = useQuery({
  //   queryKey: ['/api/user/level'],
  //   enabled: !!user
  // });

  const badges: LevelBadge[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: <Star className="w-4 h-4" />,
      unlocked: true,
      xpRequired: 50
    },
    {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Reach level 5',
      icon: <Trophy className="w-4 h-4" />,
      unlocked: true,
      xpRequired: 500
    },
    {
      id: 'speed-learner',
      name: 'Speed Learner',
      description: 'Complete 5 lessons in Challenge Mode',
      icon: <Zap className="w-4 h-4" />,
      unlocked: false,
      xpRequired: 1000
    },
    {
      id: 'master',
      name: 'Master',
      description: 'Reach level 10',
      icon: <Crown className="w-4 h-4" />,
      unlocked: false,
      xpRequired: 2000
    }
  ];

  const progressPercentage = (userLevel.currentXP / userLevel.xpToNextLevel) * 100;

  const handleXPGain = (xp: number) => {
    setRecentXPGain(xp);
    setUserLevel(prev => {
      const newTotalXP = prev.totalXP + xp;
      const newCurrentXP = prev.currentXP + xp;
      
      if (newCurrentXP >= prev.xpToNextLevel) {
        setShowLevelUpAnimation(true);
        const newLevel = prev.currentLevel + 1;
        onLevelUp?.(newLevel);
        
        return {
          currentLevel: newLevel,
          currentXP: newCurrentXP - prev.xpToNextLevel,
          xpToNextLevel: prev.xpToNextLevel + 200, // Increase XP requirement
          totalXP: newTotalXP
        };
      }
      
      return {
        ...prev,
        currentXP: newCurrentXP,
        totalXP: newTotalXP
      };
    });

    // Clear recent XP gain after animation
    setTimeout(() => setRecentXPGain(null), 2000);
  };

  useEffect(() => {
    if (showLevelUpAnimation) {
      const timer = setTimeout(() => setShowLevelUpAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpAnimation]);

  return (
    <div className="space-y-6">
      {/* Level Up Animation */}
      {showLevelUpAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl animate-pulse">
            <div className="text-center text-white">
              <Crown className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold mb-2">LEVEL UP!</h2>
              <p className="text-xl">You're now Level {userLevel.currentLevel}!</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent XP Gain Notification */}
      {recentXPGain && (
        <div className="fixed top-4 right-4 z-40 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right">
          <span className="font-semibold">+{recentXPGain} XP</span>
        </div>
      )}

      {/* Level Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userLevel.currentLevel}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Level {userLevel.currentLevel}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userLevel.currentXP} / {userLevel.xpToNextLevel} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {userLevel.totalXP.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {userLevel.currentLevel + 1}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Quick XP Gain Button (for demo) */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleXPGain(50)}
            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            +50 XP (Demo)
          </button>
          <button
            onClick={() => handleXPGain(100)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            +100 XP (Demo)
          </button>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {badge.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {badge.description}
                </p>
                {badge.unlocked ? (
                  <Badge variant="default" className="bg-green-500 text-white">
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {badge.xpRequired} XP
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}