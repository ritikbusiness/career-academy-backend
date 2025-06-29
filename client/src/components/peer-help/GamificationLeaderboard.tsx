import { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  badges: string[];
  questionsAnswered: number;
  helpfulRating: number;
  streak: number;
  category?: string;
  weeklyXP: number;
  monthlyXP: number;
}

const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    avatar: '/api/placeholder/40/40',
    xp: 3450,
    level: 12,
    rank: 1,
    badges: ['Expert Helper', 'Problem Solver', 'Quick Responder'],
    questionsAnswered: 156,
    helpfulRating: 4.9,
    streak: 23,
    weeklyXP: 485,
    monthlyXP: 1820
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: '/api/placeholder/40/40',
    xp: 3120,
    level: 11,
    rank: 2,
    badges: ['DevOps Master', 'Mentor', 'Community Star'],
    questionsAnswered: 98,
    helpfulRating: 4.8,
    streak: 15,
    category: 'devops',
    weeklyXP: 320,
    monthlyXP: 1450
  },
  {
    id: '3',
    name: 'Lisa Park',
    avatar: '/api/placeholder/40/40',
    xp: 2890,
    level: 10,
    rank: 3,
    badges: ['Python Expert', 'Code Reviewer'],
    questionsAnswered: 87,
    helpfulRating: 4.7,
    streak: 12,
    category: 'python',
    weeklyXP: 290,
    monthlyXP: 1230
  },
  {
    id: '4',
    name: 'Mike Rodriguez',
    avatar: '/api/placeholder/40/40',
    xp: 2650,
    level: 9,
    rank: 4,
    badges: ['Frontend Guru', 'UI Specialist'],
    questionsAnswered: 75,
    helpfulRating: 4.6,
    streak: 8,
    category: 'frontend',
    weeklyXP: 250,
    monthlyXP: 980
  },
  {
    id: '5',
    name: 'Emily Wang',
    avatar: '/api/placeholder/40/40',
    xp: 2400,
    level: 8,
    rank: 5,
    badges: ['Rising Star', 'Quick Learner'],
    questionsAnswered: 63,
    helpfulRating: 4.5,
    streak: 5,
    weeklyXP: 180,
    monthlyXP: 750
  }
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'devops', name: 'DevOps' },
  { id: 'python', name: 'Python' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'ai-ml', name: 'AI/ML' }
];

export function GamificationLeaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all-time');

  const filteredUsers = mockLeaderboardData.filter(user => 
    selectedCategory === 'all' || user.category === selectedCategory
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getLevelProgress = (xp: number, level: number) => {
    const currentLevelXP = (level - 1) * 250;
    const nextLevelXP = level * 250;
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {filteredUsers.slice(0, 3).map((user, index) => (
          <Card key={user.id} className={`text-center relative overflow-hidden ${
            index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' :
            index === 1 ? 'border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20' :
            'border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
          }`}>
            <CardContent className="p-6">
              <div className="absolute top-2 right-2">
                {getRankIcon(user.rank)}
              </div>
              
              <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-white dark:ring-gray-800">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <h3 className="font-bold text-lg mb-2">{user.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{user.xp} XP</span>
                </div>
                <Badge variant="outline" className="mx-auto">
                  Level {user.level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Answers</p>
                  <p className="font-semibold">{user.questionsAnswered}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <p className="font-semibold flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    {user.helpfulRating}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Full Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      Level {user.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {user.xp} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {user.helpfulRating}
                    </span>
                    <span>{user.questionsAnswered} answers</span>
                  </div>
                  
                  {/* Level Progress */}
                  <div className="mt-2">
                    <Progress value={getLevelProgress(user.xp, user.level)} className="h-2" />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{user.streak} day streak</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 justify-end">
                    {user.badges.slice(0, 2).map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    {user.badges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week's Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredUsers
              .sort((a, b) => b.weeklyXP - a.weeklyXP)
              .slice(0, 3)
              .map((user) => (
                <div key={user.id} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-sm">{user.name}</h4>
                  <p className="text-blue-600 font-bold">+{user.weeklyXP} XP</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}