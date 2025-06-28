import { useState } from 'react';
import { TrendingUp, Users, Clock, Award, Filter, Download, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StudentProgress {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  enrolledCourses: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  lastActivity: string;
  totalStudyTime: number; // in minutes
  currentStreak: number;
  assignments: {
    completed: number;
    total: number;
    averageGrade: number;
  };
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrolledStudents: number;
  activeStudents: number;
  completionRate: number;
  averageProgress: number;
  averageScore: number;
  totalWatchTime: number;
}

interface StudentAnalyticsDashboardProps {
  instructorId: string;
  courses: Array<{ id: string; title: string }>;
}

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const StudentCard = ({ student }: { student: StudentProgress }) => {
  const progressPercentage = student.totalLessons > 0 
    ? Math.round((student.completedLessons / student.totalLessons) * 100) 
    : 0;
    
  const assignmentProgress = student.assignments.total > 0
    ? Math.round((student.assignments.completed / student.assignments.total) * 100)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={student.avatar} />
            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {student.enrolledCourses} courses
              </Badge>
              <Badge variant="outline" className="text-xs">
                {student.currentStreak} day streak
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Lesson Progress</span>
              <span>{student.completedLessons} / {student.totalLessons}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Assignment Progress</span>
              <span>{student.assignments.completed} / {student.assignments.total}</span>
            </div>
            <Progress value={assignmentProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="font-semibold">{student.averageScore}%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Study Time</p>
              <p className="font-semibold">{formatTime(student.totalStudyTime)}</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Last active: {new Date(student.lastActivity).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CourseOverviewCard = ({ course }: { course: CourseAnalytics }) => {
  const engagementRate = course.enrolledStudents > 0 
    ? Math.round((course.activeStudents / course.enrolledStudents) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{course.courseName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {course.enrolledStudents}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Enrolled</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {course.activeStudents}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">Active</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Completion Rate</span>
              <span>{course.completionRate}%</span>
            </div>
            <Progress value={course.completionRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Avg Progress</span>
              <span>{course.averageProgress}%</span>
            </div>
            <Progress value={course.averageProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="font-semibold">{course.averageScore}%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Engagement</p>
              <p className="font-semibold">{engagementRate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StudentAnalyticsDashboard({ instructorId, courses }: StudentAnalyticsDashboardProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [sortBy, setSortBy] = useState<string>('progress');

  // Mock data - TODO: connect to backend
  const [students] = useState<StudentProgress[]>([]);
  const [courseAnalytics] = useState<CourseAnalytics[]>([]);

  // Mock chart data
  const engagementData = [
    { date: '2024-01-01', activeUsers: 45, newEnrollments: 12 },
    { date: '2024-01-02', activeUsers: 52, newEnrollments: 8 },
    { date: '2024-01-03', activeUsers: 48, newEnrollments: 15 },
    { date: '2024-01-04', activeUsers: 61, newEnrollments: 10 },
    { date: '2024-01-05', activeUsers: 55, newEnrollments: 18 },
    { date: '2024-01-06', activeUsers: 67, newEnrollments: 7 },
    { date: '2024-01-07', activeUsers: 59, newEnrollments: 13 }
  ];

  const performanceData = [
    { course: 'React Fundamentals', avgScore: 87, completionRate: 73 },
    { course: 'Advanced JavaScript', avgScore: 82, completionRate: 68 },
    { course: 'Node.js Backend', avgScore: 90, completionRate: 81 },
    { course: 'Database Design', avgScore: 85, completionRate: 76 }
  ];

  const activityDistribution = [
    { name: 'Video Watching', value: 45, color: '#3B82F6' },
    { name: 'Quiz Taking', value: 25, color: '#10B981' },
    { name: 'Assignment Work', value: 20, color: '#F59E0B' },
    { name: 'Discussion Forums', value: 10, color: '#8B5CF6' }
  ];

  const filteredStudents = students.filter(student => {
    if (selectedCourse === 'all') return true;
    // TODO: filter by course enrollment
    return true;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.completedLessons / b.totalLessons) - (a.completedLessons / a.totalLessons);
      case 'score':
        return b.averageScore - a.averageScore;
      case 'activity':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(s => {
    const daysSinceActivity = (Date.now() - new Date(s.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActivity <= 7;
  }).length;
  const avgCompletion = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + (s.completedLessons / s.totalLessons * 100), 0) / students.length)
    : 0;
  const avgScore = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Student Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor student progress, engagement, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="score">Average Score</SelectItem>
            <SelectItem value="activity">Last Activity</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
                <p className="text-2xl font-bold">{activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Completion</p>
                <p className="text-2xl font-bold">{avgCompletion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Line type="monotone" dataKey="activeUsers" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="newEnrollments" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3B82F6" />
                <Bar dataKey="completionRate" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {activityDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseAnalytics.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No course data available</p>
                </div>
              ) : (
                courseAnalytics.map((course) => (
                  <CourseOverviewCard key={course.courseId} course={course} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Progress</CardTitle>
            <Badge variant="secondary">
              {sortedStudents.length} students
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sortedStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No student data available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Student analytics will appear here once students start engaging with your courses.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}