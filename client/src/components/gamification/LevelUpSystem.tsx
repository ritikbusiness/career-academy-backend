import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Crown, Gift, Percent, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

interface LevelReward {
  id: string;
  name: string;
  type: 'discount' | 'content' | 'badge' | 'certificate';
  value: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  levelRequired: number;
  discountCode?: string;
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

  const rewards: LevelReward[] = [
    {
      id: 'welcome-discount',
      name: '10% Off Next Course',
      type: 'discount',
      value: '10',
      description: 'Get 10% discount on your next course purchase',
      icon: <Percent className="w-4 h-4" />,
      unlocked: userLevel.currentLevel >= 2,
      levelRequired: 2,
      discountCode: 'LEVEL2'
    },
    {
      id: 'exclusive-content',
      name: 'Exclusive Study Materials',
      type: 'content',
      value: 'premium',
      description: 'Access to premium study guides and resources',
      icon: <BookOpen className="w-4 h-4" />,
      unlocked: userLevel.currentLevel >= 5,
      levelRequired: 5
    },
    {
      id: 'big-discount',
      name: '25% Off Bundle Deal',
      type: 'discount',
      value: '25',
      description: 'Huge savings on course bundles',
      icon: <Gift className="w-4 h-4" />,
      unlocked: userLevel.currentLevel >= 10,
      levelRequired: 10,
      discountCode: 'LEVEL10'
    },
    {
      id: 'master-certificate',
      name: 'Master Learner Certificate',
      type: 'certificate',
      value: 'master',
      description: 'Official certificate of learning mastery',
      icon: <Award className="w-4 h-4" />,
      unlocked: userLevel.currentLevel >= 15,
      levelRequired: 15
    }
  ];

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
      unlocked: userLevel.currentLevel >= 5,
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
      unlocked: userLevel.currentLevel >= 10,
      xpRequired: 2000
    }
  ];

  const nextReward = rewards.find(reward => !reward.unlocked);
  const nextXPGoal = nextReward ? (nextReward.levelRequired * 1000) - userLevel.totalXP : null;

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
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              {userLevel.currentLevel}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Level {userLevel.currentLevel}</h3>
              <p className="text-sm text-muted-foreground">
                {userLevel.currentXP} / {userLevel.xpToNextLevel} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-lg font-bold text-primary">
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
            className="h-3"
          />
        </div>

        {/* Next Reward Preview */}
        {nextReward && (
          <div className="mt-4 p-3 bg-gradient-to-r from-accent/50 to-accent/30 rounded-lg border border-accent">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Next Reward at Level {nextReward.levelRequired}</span>
            </div>
            <p className="text-sm text-muted-foreground">{nextReward.name}</p>
            {nextXPGoal && nextXPGoal > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {nextXPGoal.toLocaleString()} XP to go!
              </p>
            )}
          </div>
        )}

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

      {/* Rewards Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Level Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  reward.unlocked
                    ? 'bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-700'
                    : 'bg-muted/50 border-border opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reward.unlocked
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {reward.unlocked ? (
                        <>
                          <Badge variant="default" className="bg-green-500 text-white">
                            Unlocked
                          </Badge>
                          {reward.discountCode && (
                            <Badge variant="secondary" className="text-xs">
                              Code: {reward.discountCode}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Level {reward.levelRequired}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  badge.unlocked
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700 shadow-lg'
                    : 'bg-muted/50 border-border opacity-60'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
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
        </CardContent>
      </Card>
    </div>
  );
}