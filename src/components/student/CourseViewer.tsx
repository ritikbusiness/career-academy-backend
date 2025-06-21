
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { Course, Module, Lesson, CourseProgress } from '@/types/course';

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
                Progress: {progress.completedLessons}/{progress.totalLessons} lessons
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
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {modules.length} modules • {progress.totalLessons} lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <div
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b"
                        onClick={() => toggleModuleExpansion(module.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedModules.includes(module.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <div>
                            <h4 className="font-medium">Module {moduleIndex + 1}</h4>
                            <p className="text-sm text-gray-600">{module.title}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {module.lessons.length} lessons
                        </span>
                      </div>

                      {expandedModules.includes(module.id) && (
                        <div className="bg-gray-50">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const isCompleted = isLessonCompleted(lesson.id);
                            const isSelected = selectedLesson?.id === lesson.id;
                            
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center gap-3 p-3 pl-8 cursor-pointer hover:bg-gray-100 ${
                                  isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                }`}
                                onClick={() => setSelectedLesson(lesson)}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-gray-400" />
                                )}
                                <div className="flex-1 text-sm">
                                  <p className={`font-medium ${isCompleted ? 'text-green-700' : ''}`}>
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500">{lesson.duration}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedLesson.title}</CardTitle>
                      <CardDescription>Duration: {selectedLesson.duration}</CardDescription>
                    </div>
                    {isLessonCompleted(selectedLesson.id) && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      {selectedLesson.videoUrl ? (
                        <div className="text-white text-center">
                          <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                          <p>Video Player</p>
                          <p className="text-sm opacity-75">{selectedLesson.videoUrl}</p>
                        </div>
                      ) : (
                        <div className="text-white text-center">
                          <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Video not available</p>
                        </div>
                      )}
                    </div>

                    {/* Lesson Actions */}
                    <div className="flex gap-4">
                      {!isLessonCompleted(selectedLesson.id) && (
                        <Button onClick={() => onLessonComplete(selectedLesson.id)}>
                          Mark as Complete
                        </Button>
                      )}
                      
                      {selectedLesson.materialsUrl && (
                        <Button variant="outline" asChild>
                          <a href={selectedLesson.materialsUrl} target="_blank" rel="noopener noreferrer">
                            Download Materials
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                          {progress.completedLessons} of {progress.totalLessons} lessons completed
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
