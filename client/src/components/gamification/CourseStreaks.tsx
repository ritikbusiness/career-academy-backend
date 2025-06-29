import React, { useState } from 'react';
import { Flame, Calendar, Shield, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakFreezesUsed: number;
  maxStreakFreezes: number;
}

interface StreakDay {
  date: string;
  completed: boolean;
  frozen: boolean;
}

export function CourseStreaks() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 7,
    longestStreak: 15,
    lastActivityDate: new Date().toISOString().split('T')[0],
    streakFreezesUsed: 1,
    maxStreakFreezes: 3
  });

  const [showStreakReward, setShowStreakReward] = useState(false);
  const [showStreakCalendar, setShowStreakCalendar] = useState(false);

  // TODO: connect to backend - fetch streak data
  // const { data: streakData } = useQuery({
  //   queryKey: ['/api/user/streaks'],
  //   enabled: !!user
  // });

  // Generate last 30 days of streak data
  const generateStreakDays = (): StreakDay[] => {
    const days: StreakDay[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayIndex = 29 - i;
      days.push({
        date: date.toISOString().split('T')[0],
        completed: dayIndex >= 22 || (dayIndex >= 10 && dayIndex <= 20), // Mock pattern
        frozen: dayIndex === 18 // One frozen day
      });
    }
    
    return days;
  };

  const streakDays = generateStreakDays();

  const handleCompleteLesson = () => {
    // Simulate completing a lesson and maintaining streak
    setShowStreakReward(true);
    setTimeout(() => setShowStreakReward(false), 3000);
    
    // TODO: connect to backend - update streak data
    // await mutate({
    //   url: '/api/user/streaks/complete',
    //   method: 'POST'
    // });
  };

  const handleUseStreakFreeze = () => {
    if (streakData.streakFreezesUsed < streakData.maxStreakFreezes) {
      setStreakData(prev => ({
        ...prev,
        streakFreezesUsed: prev.streakFreezesUsed + 1
      }));
      
      // TODO: connect to backend - use streak freeze
      // await mutate({
      //   url: '/api/user/streaks/freeze',
      //   method: 'POST'
      // });
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '💪';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '✨';
    return '🌱';
  };

  return (
    <div className="space-y-6">
      {/* Streak Reward Animation */}
      {showStreakReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 rounded-2xl shadow-2xl animate-bounce">
            <div className="text-center text-white">
              <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Streak Achieved!</h2>
              <p className="text-lg">+5 XP for maintaining your streak!</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl">
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {streakData.currentStreak} Day Streak
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Longest: {streakData.longestStreak} days
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              <Flame className="w-3 h-3 mr-1" />
              Active Streak
            </Badge>
            <p className="text-xs text-gray-500">
              Last activity: Today
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <Button
            onClick={handleCompleteLesson}
            className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
          >
            <Zap className="w-4 h-4 mr-2" />
            Complete Lesson (+5 XP)
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowStreakCalendar(!showStreakCalendar)}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>

        {/* Streak Freezes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Streak Freezes</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {streakData.maxStreakFreezes - streakData.streakFreezesUsed} remaining
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Protect your streak when you can't complete a lesson
          </p>
          <div className="flex gap-2">
            {Array.from({ length: streakData.maxStreakFreezes }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  index < streakData.streakFreezesUsed
                    ? 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    : 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                }`}
              >
                <Shield className={`w-4 h-4 ${
                  index < streakData.streakFreezesUsed ? 'text-gray-500' : 'text-blue-500'
                }`} />
              </div>
            ))}
          </div>
          {streakData.streakFreezesUsed < streakData.maxStreakFreezes && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseStreakFreeze}
              className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Use Streak Freeze
            </Button>
          )}
        </div>
      </Card>

      {/* Streak Calendar */}
      {showStreakCalendar && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            30-Day Streak Calendar
          </h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((day, index) => {
              const dayOfWeek = new Date(day.date).getDay();
              const isToday = day.date === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={day.date}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    day.completed
                      ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                      : day.frozen
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                  } ${isToday ? 'ring-2 ring-orange-400' : ''}`}
                >
                  {day.completed ? (
                    <Flame className="w-4 h-4" />
                  ) : day.frozen ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    new Date(day.date).getDate()
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded flex items-center justify-center">
                <Flame className="w-3 h-3 text-orange-600" />
              </div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded flex items-center justify-center">
                <Shield className="w-3 h-3 text-blue-600" />
              </div>
              <span>Frozen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
              <span>Missed</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}