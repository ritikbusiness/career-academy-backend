
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { Lesson } from '@/types/course';

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
  return (
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

          {/* Lesson Actions */}
          <div className="flex gap-4">
            {!isCompleted && (
              <Button onClick={() => onComplete(lesson.id)}>
                Mark as Complete
              </Button>
            )}
            
            {lesson.materialsUrl && (
              <Button variant="outline" asChild>
                <a href={lesson.materialsUrl} target="_blank" rel="noopener noreferrer">
                  Download Materials
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonViewer;
