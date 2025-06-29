import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  coursesCompleted: number;
  weeklyXP: number;
  rank: number;
  isCurrentUser?: boolean;
}

export function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  // TODO: connect to backend - fetch leaderboard data
  // const { data: leaderboardData } = useQuery({
  //   queryKey: ['/api/leaderboard', selectedPeriod],
  //   enabled: true
  // });

  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      username: 'Alex Chen',
      avatar: '',
      xp: 15420,
      level: 28,
      coursesCompleted: 12,
      weeklyXP: 2850,
      rank: 1
    },
    {
      id: '2',
      username: 'Sarah Johnson',
      avatar: '',
      xp: 14890,
      level: 26,
      coursesCompleted: 11,
      weeklyXP: 2640,
      rank: 2
    },
    {
      id: '3',
      username: 'Mike Rodriguez',
      avatar: '',
      xp: 13750,
      level: 24,
      coursesCompleted: 10,
      weeklyXP: 2390,
      rank: 3
    },
    {
      id: '4',
      username: 'Emma Thompson',
      avatar: '',
      xp: 12940,
      level: 23,
      coursesCompleted: 9,
      weeklyXP: 2180,
      rank: 4
    },
    {
      id: '5',
      username: 'You',
      avatar: '',
      xp: 4750,
      level: 5,
      coursesCompleted: 3,
      weeklyXP: 890,
      rank: 5,
      isCurrentUser: true
    },
    {
      id: '6',
      username: 'David Kim',
      avatar: '',
      xp: 4200,
      level: 4,
      coursesCompleted: 2,
      weeklyXP: 720,
      rank: 6
    },
    {
      id: '7',
      username: 'Lisa Wang',
      avatar: '',
      xp: 3850,
      level: 4,
      coursesCompleted: 2,
      weeklyXP: 650,
      rank: 7
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h2>
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
          <TrendingUp className="w-3 h-3 mr-1" />
          Live Rankings
        </Badge>
      </div>

      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="allTime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          <div className="space-y-3">
            {mockLeaderboardData.map((entry, index) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                  entry.isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800'
                    : entry.rank <= 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={entry.avatar} alt={entry.username} />
                    <AvatarFallback className={getRankBadgeColor(entry.rank)}>
                      <span className="text-white font-bold">
                        {entry.username.charAt(0)}
                      </span>
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${
                        entry.isCurrentUser ? 'text-blue-700 dark:text-blue-300' : ''
                      }`}>
                        {entry.username}
                        {entry.isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getRankBadgeColor(entry.rank)}`}>
                        Level {entry.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {entry.xp.toLocaleString()} XP
                      </span>
                      <span>{entry.coursesCompleted} courses</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        +{entry.weeklyXP} this week
                      </span>
                    </div>
                  </div>

                  {/* Rank Change Indicator */}
                  <div className="flex-shrink-0">
                    {entry.rank <= 3 && (
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankBadgeColor(entry.rank)}`}>
                          {entry.rank}
                        </div>
                        {entry.rank === 1 && (
                          <div className="mt-1 flex">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star key={i} className="w-2 h-2 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Monthly rankings coming soon!</p>
            <p className="text-sm mt-2">Complete more lessons to climb the monthly leaderboard.</p>
          </div>
        </TabsContent>

        <TabsContent value="allTime" className="mt-6">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>All-time rankings coming soon!</p>
            <p className="text-sm mt-2">Keep learning to secure your place in history!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5th</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Your Rank</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">890</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Weekly XP</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rank Up</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">450</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">XP to Next</div>
        </div>
      </div>
    </Card>
  );
}