
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Module, Lesson, CourseProgress } from '@/types/course';

interface CourseSidebarProps {
  modules: Module[];
  progress: CourseProgress;
  expandedModules: string[];
  selectedLesson: Lesson | null;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  modules,
  progress,
  expandedModules,
  selectedLesson,
  onToggleModule,
  onSelectLesson
}) => {
  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  return (
    <Card className="h-fit">
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
                onClick={() => onToggleModule(module.id)}
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
                        onClick={() => onSelectLesson(lesson)}
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
  );
};

export default CourseSidebar;
