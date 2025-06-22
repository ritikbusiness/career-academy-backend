import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Course, Module, Lesson, CourseProgress } from '@/types/course';
import CourseSidebar from './CourseSidebar';
import LessonViewer from './LessonViewer';

interface CourseViewerProps {
  course: Course;
  modules: Module[];
  progress: CourseProgress;
  onLessonComplete: (lessonId: string) => void;
  onBack: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  modules,
  progress,
  onLessonComplete,
  onBack
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getNextUncompletedLesson = () => {
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (!isLessonCompleted(lesson.id)) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextUncompletedLesson();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={onBack} className="mb-2">
                ← Back to Courses
              </Button>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.instructor.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Progress: {progress.completedLessons.length}/{progress.totalLessons} lessons
              </div>
              <Progress value={progress.progress} className="w-48" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              modules={modules}
              progress={progress}
              expandedModules={expandedModules}
              selectedLesson={selectedLesson}
              onToggleModule={toggleModuleExpansion}
              onSelectLesson={setSelectedLesson}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <LessonViewer
                lesson={selectedLesson}
                isCompleted={isLessonCompleted(selectedLesson.id)}
                onComplete={onLessonComplete}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to {course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Course Progress</h4>
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(progress.progress)}%
                        </div>
                        <p className="text-sm text-gray-600">
                          {progress.completedLessons.length} of {progress.totalLessons} lessons completed
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Next Lesson</h4>
                        {nextLesson ? (
                          <div>
                            <p className="font-medium">{nextLesson.title}</p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setSelectedLesson(nextLesson)}
                            >
                              Continue Learning
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-green-600 font-medium">Course Completed! 🎉</p>
                            <p className="text-sm text-gray-600">
                              Congratulations on completing the course!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Course Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((module, index) => (
                          <Card key={module.id} className="p-4">
                            <h5 className="font-medium">Module {index + 1}: {module.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.lessons.length} lessons
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
