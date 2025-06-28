import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, MessageCircle, Users, StickyNote, Bookmark, 
  Video, FileText, BarChart3, Calendar, Award 
} from 'lucide-react';

// Import all the feature components
import CourseReviews from '@/components/reviews/CourseReviews';
import DiscussionForum from '@/components/forums/DiscussionForum';
import StudyGroups from '@/components/study-groups/StudyGroups';
import NoteTaking from '@/components/notes/NoteTaking';
import BookmarkSystem from '@/components/bookmarks/BookmarkSystem';
import LiveSessionScheduling from '@/components/live-sessions/LiveSessionScheduling';
import AssignmentManagement from '@/components/assignments/AssignmentManagement';
import StudentAnalyticsDashboard from '@/components/analytics/StudentAnalyticsDashboard';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'student' | 'instructor';
  component: React.ReactNode;
}

export default function FeatureDemo() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Mock data for demonstrations
  const mockCourses = [
    { id: '1', title: 'React Fundamentals' },
    { id: '2', title: 'Advanced JavaScript' },
    { id: '3', title: 'Node.js Backend Development' }
  ];

  const features: FeatureCard[] = [
    {
      id: 'reviews',
      title: 'Course Reviews & Ratings',
      description: 'Students can rate courses and provide detailed reviews with helpful voting system',
      icon: <Star className="w-6 h-6" />,
      category: 'student',
      component: (
        <CourseReviews
          courseId="1"
          averageRating={4.3}
          totalReviews={127}
          userHasReviewed={false}
        />
      )
    },
    {
      id: 'forums',
      title: 'Discussion Forums',
      description: 'Course-specific threaded discussions with voting, pinning, and moderation features',
      icon: <MessageCircle className="w-6 h-6" />,
      category: 'student',
      component: (
        <DiscussionForum
          courseId="1"
          isInstructor={false}
          currentUserId="user1"
        />
      )
    },
    {
      id: 'study-groups',
      title: 'Study Groups',
      description: 'Peer learning communities with group creation, joining, and management',
      icon: <Users className="w-6 h-6" />,
      category: 'student',
      component: (
        <StudyGroups
          userId="user1"
          enrolledCourses={mockCourses}
        />
      )
    },
    {
      id: 'notes',
      title: 'Note-Taking System',
      description: 'Rich text notes with timestamp linking and sidebar integration for lessons',
      icon: <StickyNote className="w-6 h-6" />,
      category: 'student',
      component: (
        <NoteTaking
          lessonId="lesson1"
          lessonTitle="Introduction to React Components"
          currentVideoTime={125}
          isInSidebar={false}
        />
      )
    },
    {
      id: 'bookmarks',
      title: 'Bookmarks System',
      description: 'Save important lessons and video timestamps for quick access',
      icon: <Bookmark className="w-6 h-6" />,
      category: 'student',
      component: (
        <BookmarkSystem
          userId="user1"
          currentLessonId="lesson1"
          currentVideoTime={125}
          isInSidebar={false}
        />
      )
    },
    {
      id: 'live-sessions',
      title: 'Live Session Scheduling',
      description: 'Schedule and manage live learning sessions with countdown timers and meeting links',
      icon: <Video className="w-6 h-6" />,
      category: 'instructor',
      component: (
        <LiveSessionScheduling
          instructorId="instructor1"
          courses={mockCourses}
        />
      )
    },
    {
      id: 'assignments',
      title: 'Assignment Management',
      description: 'Create, manage, and grade assignments with submission tracking and feedback',
      icon: <FileText className="w-6 h-6" />,
      category: 'instructor',
      component: (
        <AssignmentManagement
          instructorId="instructor1"
          courses={mockCourses}
        />
      )
    },
    {
      id: 'analytics',
      title: 'Student Analytics Dashboard',
      description: 'Comprehensive insights into student progress, engagement, and performance',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'instructor',
      component: (
        <StudentAnalyticsDashboard
          instructorId="instructor1"
          courses={mockCourses}
        />
      )
    }
  ];

  const studentFeatures = features.filter(f => f.category === 'student');
  const instructorFeatures = features.filter(f => f.category === 'instructor');

  if (selectedFeature) {
    const feature = features.find(f => f.id === selectedFeature);
    if (!feature) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedFeature(null)}
              >
                ← Back to Features
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
            <Badge variant={feature.category === 'student' ? 'default' : 'secondary'}>
              {feature.category === 'student' ? 'Student Feature' : 'Instructor Tool'}
            </Badge>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900">
          {feature.component}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Premium Learning Platform Features
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore the comprehensive suite of student engagement and instructor tools 
          designed to create an exceptional learning experience
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{studentFeatures.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Student Features</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{instructorFeatures.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Instructor Tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">8</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Features</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">100%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Implementation</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories */}
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="student" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Student Engagement Features
          </TabsTrigger>
          <TabsTrigger value="instructor" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Instructor Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="default" className="mt-2">Student Feature</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button className="w-full">
                    Explore Feature →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instructor">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">Instructor Tool</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button className="w-full">
                    Explore Tool →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Technical Implementation Notes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Student Engagement Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Interactive rating system with helpful vote tracking</li>
                <li>• Threaded discussions with moderation controls</li>
                <li>• Peer learning groups with discovery and management</li>
                <li>• Rich text note-taking with video timestamp integration</li>
                <li>• Smart bookmarking system with categorization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Instructor Tools
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Live session scheduling with countdown timers</li>
                <li>• Assignment creation with submission tracking</li>
                <li>• Comprehensive grading system with feedback</li>
                <li>• Student analytics with progress visualization</li>
                <li>• Performance insights and engagement metrics</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Ready for Backend Integration:</strong> All components include TODO comments 
              marking API integration points for seamless backend connectivity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}