import { useState } from 'react';
import { Gift, Trophy, Star, Target, Calendar, Award, Crown, Zap, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'coupon' | 'merchandise' | 'certificate' | 'access' | 'badge';
  xpRequired: number;
  icon: string;
  value?: string;
  isUnlocked: boolean;
  isClaimed: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  isCompleted: boolean;
  category: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  rewards: string[];
  isReached: boolean;
  progress: number;
}

const mockRewards: Reward[] = [
  {
    id: '1',
    name: '25% Course Discount',
    description: 'Get 25% off any premium course',
    type: 'coupon',
    xpRequired: 500,
    icon: '🎫',
    value: '25% OFF',
    isUnlocked: true,
    isClaimed: false,
    rarity: 'common'
  },
  {
    id: '2',
    name: 'Learning Platform T-Shirt',
    description: 'Exclusive community helper merchandise',
    type: 'merchandise',
    xpRequired: 1500,
    icon: '👕',
    isUnlocked: true,
    isClaimed: true,
    rarity: 'rare'
  },
  {
    id: '3',
    name: 'Expert Helper Certificate',
    description: 'Official recognition of your contribution',
    type: 'certificate',
    xpRequired: 2000,
    icon: '📜',
    isUnlocked: false,
    isClaimed: false,
    rarity: 'epic'
  },
  {
    id: '4',
    name: 'Early Course Access',
    description: 'Get access to new courses 1 week early',
    type: 'access',
    xpRequired: 3000,
    icon: '⚡',
    isUnlocked: false,
    isClaimed: false,
    rarity: 'epic'
  },
  {
    id: '5',
    name: 'Community Legend Badge',
    description: 'Ultra-rare recognition for top contributors',
    type: 'badge',
    xpRequired: 5000,
    icon: '👑',
    isUnlocked: false,
    isClaimed: false,
    rarity: 'legendary'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Helper',
    description: 'Answer your first question',
    icon: '🌟',
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    isCompleted: true,
    category: 'milestone'
  },
  {
    id: '2',
    name: 'Quick Responder',
    description: 'Answer 5 questions within 1 hour of posting',
    icon: '⚡',
    progress: 3,
    maxProgress: 5,
    xpReward: 100,
    isCompleted: false,
    category: 'speed'
  },
  {
    id: '3',
    name: 'Knowledge Sharer',
    description: 'Provide 25 helpful answers',
    icon: '📚',
    progress: 18,
    maxProgress: 25,
    xpReward: 200,
    isCompleted: false,
    category: 'quality'
  },
  {
    id: '4',
    name: 'Week Warrior',
    description: 'Help someone every day for 7 days',
    icon: '🔥',
    progress: 5,
    maxProgress: 7,
    xpReward: 150,
    isCompleted: false,
    category: 'consistency'
  }
];

const mockMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Helper Novice',
    description: 'Reach 500 XP to unlock your first rewards',
    xpRequired: 500,
    rewards: ['25% Course Discount', 'Helper Badge'],
    isReached: true,
    progress: 100
  },
  {
    id: '2',
    name: 'Community Contributor',
    description: 'Reach 1500 XP for exclusive merchandise',
    xpRequired: 1500,
    rewards: ['T-Shirt', 'Contributor Badge', '50% Course Discount'],
    isReached: true,
    progress: 100
  },
  {
    id: '3',
    name: 'Expert Helper',
    description: 'Reach 3000 XP for expert recognition',
    xpRequired: 3000,
    rewards: ['Expert Certificate', 'Early Access', 'Expert Badge'],
    isReached: false,
    progress: 60 // Current XP: 1800/3000
  },
  {
    id: '4',
    name: 'Community Legend',
    description: 'Reach 5000 XP for legendary status',
    xpRequired: 5000,
    rewards: ['Legend Badge', 'Lifetime Access', 'Custom Flair'],
    isReached: false,
    progress: 36 // Current XP: 1800/5000
  }
];

const currentUserXP = 1800; // Mock current user XP

export function RewardsPanel() {
  const [activeTab, setActiveTab] = useState('rewards');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-200';
      case 'rare': return 'text-blue-500 border-blue-200';
      case 'epic': return 'text-purple-500 border-purple-200';
      case 'legendary': return 'text-yellow-500 border-yellow-200';
      default: return 'text-gray-500 border-gray-200';
    }
  };

  const handleClaimReward = (rewardId: string) => {
    // TODO: Claim reward via backend
    console.log('Claiming reward:', rewardId);
  };

  return (
    <div className="space-y-6">
      {/* User Progress Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-600">{currentUserXP} XP</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Experience Points</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next reward at</p>
              <p className="font-semibold">3000 XP</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Expert Helper</span>
              <span>{currentUserXP}/3000 XP</span>
            </div>
            <Progress value={(currentUserXP / 3000) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">
            <Gift className="w-4 h-4 mr-2" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Target className="w-4 h-4 mr-2" />
            Milestones
          </TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className={`relative overflow-hidden border-2 ${getRarityColor(reward.rarity)}`}>
                <CardContent className="p-6">
                  {!reward.isUnlocked && (
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                      <div className="text-center text-white">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">Locked</p>
                        <p className="text-sm">{reward.xpRequired - currentUserXP} XP needed</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div>
                        <h3 className="font-semibold">{reward.name}</h3>
                        <Badge variant="outline" className={getRarityColor(reward.rarity)}>
                          {reward.rarity}
                        </Badge>
                      </div>
                    </div>
                    {reward.isClaimed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {reward.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy className="w-4 h-4" />
                      {reward.xpRequired} XP
                    </div>
                    
                    {reward.isUnlocked && !reward.isClaimed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleClaimReward(reward.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        Claim
                      </Button>
                    )}
                    
                    {reward.isClaimed && (
                      <Badge className="bg-green-500 text-white">Claimed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.isCompleted ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {achievement.isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Star className="w-4 h-4" />
                      +{achievement.xpReward} XP
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <div className="space-y-4">
            {mockMilestones.map((milestone, index) => (
              <Card key={milestone.id} className={milestone.isReached ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.isReached 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {milestone.isReached ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{milestone.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Trophy className="w-4 h-4" />
                          {milestone.xpRequired} XP
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {milestone.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Rewards:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.rewards.map((reward) => (
                            <Badge key={reward} variant="secondary" className="text-xs">
                              {reward}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Admin Panel Preview (Mock) */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Crown className="w-5 h-5" />
            Admin Rewards Panel (Preview)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">Monthly Top 3</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Automatically eligible for premium course access
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">Gift Distribution</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track merchandise and coupon delivery
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">XP Thresholds</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Configure reward unlock requirements
              </p>
            </div>
          </div>
          <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-4">
            * Admin features require elevated permissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}