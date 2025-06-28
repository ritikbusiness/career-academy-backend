import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import CourseBrowser from '@/components/student/CourseBrowser';
import CourseViewer from '@/components/student/CourseViewer';
import EnrolledCoursesGrid from '@/components/student/EnrolledCoursesGrid';
import AdvancedCourseSearch from '@/components/course/AdvancedCourseSearch';
import LearningAnalyticsDashboard from '@/components/analytics/LearningAnalyticsDashboard';
import { Course, Module, Enrollment, CourseProgress } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, BookOpen, Heart } from 'lucide-react';

const StudentCourses = () => {
  const { toast } = useToast();
  
  // Mock data - replace with actual API calls
  const [availableCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete React Development',
      description: 'Learn React from basics to advanced concepts including hooks, context, and performance optimization.',
      domain: 'web-development',
      instructor: { id: '1', name: 'John Smith' },
      price: 2999,
      duration: '15 hours',
      level: 'intermediate',
      enrolledCount: 1250,
      rating: 4.8,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Master Python programming for data analysis, visualization, and machine learning.',
      domain: 'data-science',
      instructor: { id: '2', name: 'Sarah Johnson' },
      price: 3499,
      duration: '20 hours',
      level: 'beginner',
      enrolledCount: 890,
      rating: 4.9,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'DevOps Fundamentals',
      description: 'Learn Docker, Kubernetes, CI/CD, and cloud deployment strategies.',
      domain: 'devops',
      instructor: { id: '3', name: 'Mike Wilson' },
      price: 0,
      duration: '12 hours',
      level: 'intermediate',
      enrolledCount: 2100,
      rating: 4.7,
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-08T00:00:00Z'
    }
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseModules] = useState<{ [courseId: string]: Module[] }>({
    '1': [
      {
        id: 'm1',
        courseId: '1',
        title: 'React Fundamentals',
        position: 1,
        lessons: [
          { id: 'l1', moduleId: 'm1', title: 'Introduction to React', position: 1, duration: '15 min', videoUrl: 'https://example.com/video1' },
          { id: 'l2', moduleId: 'm1', title: 'Components and JSX', position: 2, duration: '20 min', videoUrl: 'https://example.com/video2' }
        ]
      },
      {
        id: 'm2',
        courseId: '1',
        title: 'Advanced Concepts',
        position: 2,
        lessons: [
          { id: 'l3', moduleId: 'm2', title: 'Hooks in Detail', position: 1, duration: '25 min', videoUrl: 'https://example.com/video3' },
          { id: 'l4', moduleId: 'm2', title: 'Context API', position: 2, duration: '18 min', videoUrl: 'https://example.com/video4' }
        ]
      }
    ]
  });

  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: CourseProgress }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(availableCourses);
  const [searchStats, setSearchStats] = useState<any>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['React', 'Python', 'Data Science']);

  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const handleEnroll = (courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return;

    if (course.price > 0) {
      toast({
        title: "Payment Required",
        description: `This course costs ₹${course.price}. Payment integration will be added in Phase 4.`,
      });
      return;
    }

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId: 'currentUser',
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      lastAccessedAt: new Date().toISOString()
    };

    setEnrollments(prev => [...prev, newEnrollment]);

    const modules = courseModules[courseId] || [];
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        courseId,
        totalLessons,
        completedLessons: [],
        progress: 0
      }
    }));

    toast({
      title: "Successfully Enrolled!",
      description: `You have been enrolled in ${course.title}`,
    });
  };

  const handleFilteredResults = (courses: Course[], stats: any) => {
    setFilteredCourses(courses);
    setSearchStats(stats);
  };

  const handleAddToWishlist = (courseId: string) => {
    setWishlist(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
    
    const course = availableCourses.find(c => c.id === courseId);
    toast({
      title: wishlist.includes(courseId) ? "Removed from wishlist" : "Added to wishlist",
      description: course ? `"${course.title}" ${wishlist.includes(courseId) ? 'removed from' : 'added to'} your wishlist.` : '',
    });
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!selectedCourse) return;

    const currentProgress = courseProgress[selectedCourse.id];
    if (!currentProgress) return;

    const updatedCompletedLessons = [...currentProgress.completedLessons];
    if (!updatedCompletedLessons.includes(lessonId)) {
      updatedCompletedLessons.push(lessonId);
    }

    const newProgress = (updatedCompletedLessons.length / currentProgress.totalLessons) * 100;

    setCourseProgress(prev => ({
      ...prev,
      [selectedCourse.id]: {
        ...currentProgress,
        completedLessons: updatedCompletedLessons,
        progress: newProgress
      }
    }));

    setEnrollments(prev => prev.map(enrollment =>
      enrollment.courseId === selectedCourse.id
        ? { ...enrollment, progress: newProgress, completedLessons: updatedCompletedLessons }
        : enrollment
    ));

    toast({
      title: "Lesson Completed!",
      description: "Great job! Keep up the learning momentum.",
    });
  };

  if (selectedCourse) {
    const modules = courseModules[selectedCourse.id] || [];
    const progress = courseProgress[selectedCourse.id] || {
      courseId: selectedCourse.id,
      totalLessons: modules.reduce((sum, module) => sum + module.lessons.length, 0),
      completedLessons: [],
      progress: 0
    };

    return (
      <CourseViewer
        course={selectedCourse}
        modules={modules}
        progress={progress}
        onLessonComplete={handleLessonComplete}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-600">Explore courses and track your progress</p>
        </div>

        <Tabs defaultValue="enrolled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="enrolled" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Courses ({enrollments.length})
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Advanced Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled">
            <EnrolledCoursesGrid
              enrollments={enrollments}
              availableCourses={availableCourses}
              courseProgress={courseProgress}
              onCourseSelect={setSelectedCourse}
            />
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-6">
              {searchStats.total > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{searchStats.total}</div>
                        <div className="text-sm text-gray-600">Total Courses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{searchStats.free}</div>
                        <div className="text-sm text-gray-600">Free Courses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{searchStats.averageRating?.toFixed(1) || '0'}</div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{searchStats.totalEnrollments || 0}</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <CourseBrowser
                courses={filteredCourses.length > 0 ? filteredCourses : availableCourses}
                onEnroll={handleEnroll}
                enrolledCourses={enrolledCourseIds}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <LearningAnalyticsDashboard
              enrollments={enrollments}
              courses={availableCourses}
              courseProgress={courseProgress}
              quizResults={[]}
            />
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  My Wishlist
                </CardTitle>
                <CardDescription>
                  Courses you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">Save courses you're interested in to access them quickly later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map(courseId => {
                      const course = availableCourses.find(c => c.id === courseId);
                      if (!course) return null;
                      
                      return (
                        <Card key={courseId} className="relative">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{course.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{course.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">
                                {course.price === 0 ? 'Free' : `₹${course.price}`}
                              </span>
                              <button
                                onClick={() => handleAddToWishlist(courseId)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Heart className="w-5 h-5 fill-current" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <AdvancedCourseSearch
              courses={availableCourses}
              onFilteredResults={handleFilteredResults}
              recentSearches={recentSearches}
              onAddToWishlist={handleAddToWishlist}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentCourses;
