import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar, 
  BookOpen, 
  Brain,
  Zap,
  Trophy,
  Star,
  Flame,
  BarChart3
} from 'lucide-react';
import { Course, Enrollment, CourseProgress } from '@/types/course';
import SkillGapAnalyzer from '@/components/ai/SkillGapAnalyzer';

interface LearningStats {
  totalLessonsCompleted: number;
  totalStudyTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  coursesCompleted: number;
  averageScore: number;
  skillsLearned: string[];
  weeklyProgress: { week: string; lessons: number; time: number }[];
  monthlyProgress: { month: string; courses: number; time: number }[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: 'streak' | 'completion' | 'time' | 'score' | 'milestone';
}

interface LearningAnalyticsDashboardProps {
  enrollments: Enrollment[];
  courses: Course[];
  courseProgress: { [courseId: string]: CourseProgress };
  quizResults: any[];
}

const LearningAnalyticsDashboard: React.FC<LearningAnalyticsDashboardProps> = ({
  enrollments,
  courses,
  courseProgress,
  quizResults
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Calculate learning statistics
  const learningStats: LearningStats = useMemo(() => {
    const completedLessons = Object.values(courseProgress).reduce(
      (total, progress) => total + progress.completedLessons.length, 0
    );

    // Mock data for demonstration - in real app, this would come from actual tracking
    const mockStats: LearningStats = {
      totalLessonsCompleted: completedLessons,
      totalStudyTime: 1680, // 28 hours
      currentStreak: 7,
      longestStreak: 15,
      coursesCompleted: enrollments.filter(e => e.progress === 100).length,
      averageScore: 87.5,
      skillsLearned: ['React', 'TypeScript', 'Node.js', 'Python', 'Data Analysis'],
      weeklyProgress: [
        { week: 'Week 1', lessons: 8, time: 240 },
        { week: 'Week 2', lessons: 12, time: 360 },
        { week: 'Week 3', lessons: 15, time: 450 },
        { week: 'Week 4', lessons: 10, time: 300 },
      ],
      monthlyProgress: [
        { month: 'Jan', courses: 2, time: 1200 },
        { month: 'Feb', courses: 3, time: 1800 },
        { month: 'Mar', courses: 1, time: 900 },
      ],
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎯',
          unlockedAt: '2024-01-15',
          type: 'milestone'
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Maintain a 7-day learning streak',
          icon: '🔥',
          unlockedAt: '2024-01-22',
          type: 'streak'
        },
        {
          id: '3',
          title: 'Perfect Score',
          description: 'Score 100% on a quiz',
          icon: '💯',
          unlockedAt: '2024-01-28',
          type: 'score'
        },
        {
          id: '4',
          title: 'Speed Learner',
          description: 'Complete 5 lessons in one day',
          icon: '⚡',
          unlockedAt: '2024-02-03',
          type: 'completion'
        }
      ]
    };

    return mockStats;
  }, [enrollments, courseProgress]);

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    return '📚';
  };

  const getAchievementTypeColor = (type: Achievement['type']) => {
    switch (type) {
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'completion': return 'bg-blue-100 text-blue-800';
      case 'time': return 'bg-green-100 text-green-800';
      case 'score': return 'bg-purple-100 text-purple-800';
      case 'milestone': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-900">
                  {learningStats.currentStreak}
                </p>
                <p className="text-xs text-gray-500">
                  Best: {learningStats.longestStreak} days
                </p>
              </div>
              <div className="text-3xl">
                {getStreakIcon(learningStats.currentStreak)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.floor(learningStats.totalStudyTime / 60)}h
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(learningStats.totalStudyTime)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {learningStats.totalLessonsCompleted}
                </p>
                <p className="text-xs text-gray-500">
                  Across {enrollments.length} courses
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {learningStats.averageScore}%
                </p>
                <p className="text-xs text-gray-500">
                  Based on {quizResults.length} quizzes
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Learning Progress
              </CardTitle>
              <CardDescription>
                Your learning activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningStats.weeklyProgress.map((week, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{week.week}</span>
                      <span className="text-gray-600">
                        {week.lessons} lessons • {formatTime(week.time)}
                      </span>
                    </div>
                    <Progress value={(week.lessons / 20) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Your progress across enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  const progress = courseProgress[enrollment.courseId];
                  
                  if (!course || !progress) return null;

                  return (
                    <div key={enrollment.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-600">
                            {progress.completedLessons.length} of {progress.totalLessons} lessons
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(progress.progress)}%
                        </Badge>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your learning milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningStats.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge className={getAchievementTypeColor(achievement.type)}>
                            {achievement.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Next Achievements
              </CardTitle>
              <CardDescription>
                Keep learning to unlock these achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">🎓</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Course Master</h4>
                      <p className="text-sm text-gray-600">Complete 5 courses</p>
                      <Progress value={60} className="h-2 mt-2" />
                      <p className="text-xs text-gray-500 mt-1">3 of 5 completed</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">🏃</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Marathon Learner</h4>
                      <p className="text-sm text-gray-600">Maintain 30-day streak</p>
                      <Progress value={23} className="h-2 mt-2" />
                      <p className="text-xs text-gray-500 mt-1">7 of 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Skills Learned
              </CardTitle>
              <CardDescription>
                Skills you've acquired through your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {learningStats.skillsLearned.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <SkillGapAnalyzer
            completedLessons={Object.values(courseProgress).flatMap(p => p.completedLessons)}
            quizResults={quizResults}
            targetSkills={learningStats.skillsLearned}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Velocity</CardTitle>
                <CardDescription>
                  Your learning speed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Lessons per week</span>
                    <span className="font-semibold">11.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hours per week</span>
                    <span className="font-semibold">5.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completion rate</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quiz accuracy</span>
                    <span className="font-semibold">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>
                  When you learn best
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Best learning day</span>
                      <span className="font-semibold">Tuesday</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Most active time</span>
                      <span className="font-semibold">7-9 PM</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Preferred session length</span>
                      <span className="font-semibold">45 mins</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningAnalyticsDashboard;