
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, HelpCircle, Lightbulb, Search, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Q&A
          </Button>
        </div>

        {/* Header */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ask a Question</h1>
                <p className="text-blue-100">Get help from instructors and fellow students</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Search Existing Questions */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Check if your question already exists
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search existing questions before asking..."
                className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Someone might have already asked your question and received an answer!
            </p>
          </CardContent>
        </Card>

        {/* Question Form */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Ask Your Question
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Question Title*
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your main question? Be specific and clear."
                className="h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
              <p className="text-xs text-slate-500">
                <strong>Good example:</strong> "How to handle async operations in useEffect?"
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                Question Details*
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide more details...

• What you're trying to achieve
• What you've already tried  
• Any error messages you're seeing
• Relevant code snippets (if applicable)
• Which part of the lesson is unclear"
                rows={12}
                className="rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base leading-relaxed"
              />
              <p className="text-xs text-slate-500">
                The more context you provide, the better answers you'll receive.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Tips for getting great answers</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Search existing questions first to avoid duplicates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be specific about what you're trying to accomplish</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include relevant code, errors, or screenshots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Explain what you've already tried</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use proper formatting for code snippets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be patient and respectful with responses</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-8">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-8 py-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Posting Question...' : 'Post Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
