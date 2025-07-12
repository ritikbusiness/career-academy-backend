import React from 'react';
import { Trophy, Star, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  className?: string;
}

export function LevelProgress({
  currentLevel,
  currentXP,
  xpToNextLevel,
  totalXP,
  className = ""
}: LevelProgressProps) {
  const progressPercentage = (currentXP / xpToNextLevel) * 100;
  
  // Simple reward calculation based on level
  const nextRewardLevel = Math.ceil(currentLevel / 5) * 5;
  const hasReward = currentLevel >= 2;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-primary" />
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {currentLevel}
            </div>
            <div>
              <p className="font-semibold">Level {currentLevel}</p>
              <p className="text-sm text-muted-foreground">
                {currentXP} / {xpToNextLevel} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="font-bold text-primary">
              {totalXP.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Next Reward Preview */}
        {nextRewardLevel > currentLevel && (
          <div className="p-3 bg-gradient-to-r from-accent/50 to-accent/30 rounded-lg border border-accent">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Next Reward at Level {nextRewardLevel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {nextRewardLevel === 5 ? 'Exclusive Study Materials' :
               nextRewardLevel === 10 ? '25% Off Bundle Deal' :
               nextRewardLevel === 15 ? 'Master Learner Certificate' :
               'Special Reward'}
            </p>
          </div>
        )}

        {/* Current Rewards */}
        {hasReward && (
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Rewards Available:</span>
            {currentLevel >= 2 && (
              <Badge variant="secondary" className="text-xs">
                10% OFF
              </Badge>
            )}
            {currentLevel >= 5 && (
              <Badge variant="secondary" className="text-xs">
                Premium Content
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}