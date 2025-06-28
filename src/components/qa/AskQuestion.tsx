
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, HelpCircle } from 'lucide-react';
import { Question } from '@/types/qa';

interface AskQuestionProps {
  lessonId: string;
  onSubmit: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AskQuestion: React.FC<AskQuestionProps> = ({ lessonId, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    // TODO: connect to backend - create question
    const question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'> = {
      lessonId,
      userId: 'current-user-id',
      userType: 'student', // TODO: get from auth context
      userName: 'Current User', // TODO: get from auth context
      title: title.trim(),
      content: content.trim(),
      upvotes: 0,
      isResolved: false
    };

    setTimeout(() => {
      onSubmit(question);
      setIsSubmitting(false);
    }, 1000);
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Q&A
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Ask a Question
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get help from instructors and fellow students. Be specific and provide context.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Question Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your main question? Be specific and clear."
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Good example: "How to handle async operations in useEffect?"
            </p>
          </div>

          <div>
            <Label htmlFor="content">Question Details*</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question. Include:
• What you're trying to achieve
• What you've already tried
• Any error messages you're seeing
• Relevant code snippets (if applicable)"
              rows={10}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              The more context you provide, the better answers you'll receive.
            </p>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Tips for getting great answers:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Search existing questions first to avoid duplicates</li>
              <li>• Be specific about what you're trying to accomplish</li>
              <li>• Include relevant code, error messages, or screenshots</li>
              <li>• Explain what you've already tried</li>
              <li>• Use proper formatting for code snippets</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskQuestion;
