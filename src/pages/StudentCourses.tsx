
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import CourseBrowser from '@/components/student/CourseBrowser';
import CourseViewer from '@/components/student/CourseViewer';
import { Course, Module, Enrollment, CourseProgress } from '@/types/course';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const handleEnroll = (courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return;

    if (course.price > 0) {
      // Redirect to payment in real app
      toast({
        title: "Payment Required",
        description: `This course costs ₹${course.price}. Payment integration will be added in Phase 4.`,
      });
      return;
    }

    // Free enrollment
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

    // Initialize progress
    const modules = courseModules[courseId] || [];
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        courseId,
        totalLessons,
        completedLessons: 0,
        progress: 0
      }
    }));

    toast({
      title: "Successfully Enrolled!",
      description: `You have been enrolled in ${course.title}`,
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
        completedLessons: updatedCompletedLessons.length,
        progress: newProgress
      }
    }));

    // Update enrollment
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

  const getEnrolledCourses = () => {
    return enrollments.map(enrollment => {
      const course = availableCourses.find(c => c.id === enrollment.courseId);
      return course ? { ...course, enrollment } : null;
    }).filter(Boolean) as (Course & { enrollment: Enrollment })[];
  };

  if (selectedCourse) {
    const modules = courseModules[selectedCourse.id] || [];
    const progress = courseProgress[selectedCourse.id] || {
      courseId: selectedCourse.id,
      totalLessons: modules.reduce((sum, module) => sum + module.lessons.length, 0),
      completedLessons: 0,
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

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses ({enrollments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <CourseBrowser
              courses={availableCourses}
              onEnroll={handleEnroll}
              enrolledCourses={enrolledCourseIds}
            />
          </TabsContent>

          <TabsContent value="enrolled">
            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
                  <p className="text-gray-600 mb-4">Start learning by browsing our available courses</p>
                  <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getEnrolledCourses().map((course) => {
                  const progress = courseProgress[course.id] || { progress: 0, completedLessons: 0, totalLessons: 0 };
                  
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.instructor.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{Math.round(progress.progress)}%</span>
                            </div>
                            <Progress value={progress.progress} />
                            <p className="text-xs text-gray-600 mt-1">
                              {progress.completedLessons} of {progress.totalLessons} lessons completed
                            </p>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => setSelectedCourse(course)}
                          >
                            {progress.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentCourses;
