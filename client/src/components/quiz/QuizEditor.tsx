import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, BookOpen, Clock, Target, HelpCircle } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';
import QuestionForm from './QuestionForm';

interface QuizEditorProps {
  lessonId: string;
  existingQuiz?: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ lessonId, existingQuiz, onSave, onCancel }) => {
  const [quiz, setQuiz] = useState<Quiz>(existingQuiz || {
    id: '',
    lessonId,
    title: '',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = quiz.questions[questionIndex];
    if (question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionIndex, { options: newOptions });
    }
  };

  const handleSave = () => {
    // TODO: connect to backend
    const savedQuiz = {
      ...quiz,
      id: quiz.id || Date.now().toString(),
      updatedAt: new Date().toISOString()
    };
    onSave(savedQuiz);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-white">
            <div className="flex items-center gap-4">
              <BookOpen className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">{existingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                <p className="text-indigo-100 text-lg">Design engaging assessments for your students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Settings */}
        <Card className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <CardHeader className="border-b border-gray-100 px-8 py-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Quiz Title</Label>
                <Input
                  id="title"
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter an engaging quiz title"
                  className="h-12 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Limit (minutes)
                </Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={quiz.timeLimit || ''}
                  onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                  placeholder="30"
                  className="h-12 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="passingScore" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Passing Score (%)
                </Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={quiz.passingScore}
                  onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                  className="h-12 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description (Optional)</Label>
              <Textarea
                id="description"
                value={quiz.description || ''}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide context about what this quiz covers..."
                rows={3}
                className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <CardHeader className="border-b border-gray-100 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <HelpCircle className="w-7 h-7 text-blue-600" />
                  Questions ({quiz.questions.length})
                </CardTitle>
                <p className="text-gray-600 mt-2 text-lg">Create engaging questions to test student knowledge</p>
              </div>
              <Button 
                onClick={addQuestion} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {quiz.questions.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No questions yet</h3>
                <p className="text-gray-500 mb-8 text-lg">Start by adding your first question to the quiz</p>
                <Button 
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-4 font-semibold text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {quiz.questions.map((question, index) => (
                  <QuestionForm
                    key={question.id}
                    question={question}
                    questionIndex={index}
                    onUpdate={(updates) => updateQuestion(index, updates)}
                    onDelete={() => deleteQuestion(index)}
                    onOptionUpdate={(optionIndex, value) => updateQuestionOption(index, optionIndex, value)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-8">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-10 py-4 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
