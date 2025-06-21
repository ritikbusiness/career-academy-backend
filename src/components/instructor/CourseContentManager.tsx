
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Module, Lesson } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

interface CourseContentManagerProps {
  courseId: string;
  modules: Module[];
  onUpdateModules: (modules: Module[]) => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({
  courseId,
  modules,
  onUpdateModules
}) => {
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { toast } = useToast();

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      courseId,
      title: 'New Module',
      position: modules.length + 1,
      lessons: []
    };
    onUpdateModules([...modules, newModule]);
    setEditingModule(newModule.id);
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    const updatedModules = modules.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    );
    onUpdateModules(updatedModules);
    setEditingModule(null);
  };

  const deleteModule = (moduleId: string) => {
    const updatedModules = modules.filter(module => module.id !== moduleId);
    onUpdateModules(updatedModules);
    toast({
      title: "Module deleted",
      description: "The module has been removed successfully",
    });
  };

  const addLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: Date.now().toString(),
      moduleId,
      title: 'New Lesson',
      position: module.lessons.length + 1,
      duration: '5 min'
    };

    const updatedModules = modules.map(m =>
      m.id === moduleId
        ? { ...m, lessons: [...m.lessons, newLesson] }
        : m
    );
    onUpdateModules(updatedModules);
    setEditingLesson(newLesson.id);
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    const updatedModules = modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, ...updates } : lesson
            )
          }
        : module
    );
    onUpdateModules(updatedModules);
    setEditingLesson(null);
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
          }
        : module
    );
    onUpdateModules(updatedModules);
    toast({
      title: "Lesson deleted",
      description: "The lesson has been removed successfully",
    });
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Content</h3>
        <Button onClick={addModule}>
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <Card key={module.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModuleExpansion(module.id)}
                  >
                    {expandedModules.includes(module.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  {editingModule === module.id ? (
                    <Input
                      value={module.title}
                      onChange={(e) => updateModule(module.id, { title: e.target.value })}
                      onBlur={() => setEditingModule(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingModule(null)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <h4 className="font-medium">Module {moduleIndex + 1}: {module.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingModule(module.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteModule(module.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedModules.includes(module.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(module.id)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Button>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        {editingLesson === lesson.id ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              value={lesson.title}
                              onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                              placeholder="Lesson title"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={lesson.videoUrl || ''}
                                onChange={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                                placeholder="Video URL"
                              />
                              <Input
                                value={lesson.duration}
                                onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                placeholder="Duration"
                              />
                            </div>
                            <Input
                              value={lesson.materialsUrl || ''}
                              onChange={(e) => updateLesson(module.id, lesson.id, { materialsUrl: e.target.value })}
                              placeholder="Materials URL"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => setEditingLesson(null)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingLesson(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="font-medium">
                                Lesson {lessonIndex + 1}: {lesson.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Duration: {lesson.duration}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingLesson(lesson.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLesson(module.id, lesson.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseContentManager;
