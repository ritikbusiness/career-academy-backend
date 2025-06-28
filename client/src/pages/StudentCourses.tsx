import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import CourseBrowser from '@/components/student/CourseBrowser';
import CourseViewer from '@/components/student/CourseViewer';
import EnrolledCoursesGrid from '@/components/student/EnrolledCoursesGrid';
import { Course, Module, Enrollment, CourseProgress } from '@/types/course';
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

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger value="browse" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Browse Courses
            </TabsTrigger>
            <TabsTrigger value="enrolled" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              My Courses ({enrollments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <CourseBrowser
              courses={availableCourses}
              onEnroll={handleEnroll}
              enrolledCourses={enrolledCourseIds}
            />
          </TabsContent>

          <TabsContent value="enrolled">
            <EnrolledCoursesGrid
              enrollments={enrollments}
              availableCourses={availableCourses}
              courseProgress={courseProgress}
              onCourseSelect={setSelectedCourse}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentCourses;
