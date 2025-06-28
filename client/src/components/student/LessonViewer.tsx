
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, PlayCircle, Lock, Sparkles, Brain, MessageCircle, Download } from 'lucide-react';
import { Lesson } from '@/types/course';
import LessonSummarizer from '@/components/ai/LessonSummarizer';
import PracticeQuestionsGenerator from '@/components/ai/PracticeQuestionsGenerator';
import StudyBuddy from '@/components/ai/StudyBuddy';

interface LessonViewerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: (lessonId: string) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  isCompleted,
  onComplete
}) => {
  // Mock lesson content for AI features - in real app, this would come from lesson data
  const lessonContent = `
    This lesson covers ${lesson.title}. 
    Key concepts include understanding the fundamentals, practical applications, and best practices.
    Students will learn to implement these concepts in real-world scenarios.
    The lesson includes demonstrations, examples, and hands-on exercises.
    By the end of this lesson, students should be able to apply these concepts effectively.
  `;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>Duration: {lesson.duration}</CardDescription>
            </div>
            {isCompleted && (
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
              {lesson.videoUrl ? (
                <div className="text-white text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                  <p>Video Player</p>
                  <p className="text-sm opacity-75">{lesson.videoUrl}</p>
                </div>
              ) : (
                <div className="text-white text-center">
                  <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Video not available</p>
                </div>
            )}
          </div>

          {/* Lesson Materials */}
          {lesson.materialsUrl && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2">Course Materials</h4>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Materials
              </Button>
            </div>
          )}

          {/* Complete Lesson Button */}
          {!isCompleted && (
            <Button 
              onClick={() => onComplete(lesson.id)}
              className="w-full"
            >
              Mark as Complete
            </Button>
          )}
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Learning Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Learning Assistant
          </CardTitle>
          <CardDescription>
            Enhance your learning with AI-powered tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Study Buddy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <LessonSummarizer
                lessonContent={lessonContent}
                lessonTitle={lesson.title}
              />
            </TabsContent>
            
            <TabsContent value="practice" className="mt-4">
              <PracticeQuestionsGenerator
                lessonContent={lessonContent}
                lessonTitle={lesson.title}
              />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-4">
              <StudyBuddy
                lessonContent={lessonContent}
                lessonTitle={lesson.title}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonViewer;
