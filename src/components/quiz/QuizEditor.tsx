
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, BookOpen, Clock, Target, HelpCircle } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">{existingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                <p className="text-indigo-100">Design engaging assessments for your students</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quiz Settings */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Quiz Settings</CardTitle>
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
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  Questions ({quiz.questions.length})
                </CardTitle>
                <p className="text-slate-600 mt-1">Create engaging questions to test student knowledge</p>
              </div>
              <Button 
                onClick={addQuestion} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {quiz.questions.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No questions yet</h3>
                <p className="text-slate-500 mb-6">Start by adding your first question to the quiz</p>
                <Button 
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {quiz.questions.map((question, index) => (
                  <Card key={question.id} className="border-2 border-blue-100 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-slate-800">Question {index + 1}</h4>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(index)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: 'multiple-choice' | 'true-false') => 
                            updateQuestion(index, { 
                              type: value,
                              options: value === 'true-false' ? undefined : ['', '', '', ''],
                              correctAnswer: value === 'true-false' ? true : 0
                            })
                          }
                        >
                          <SelectTrigger className="h-12 rounded-lg border-slate-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Question Text</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(index, { question: e.target.value })}
                          placeholder="Enter your question here..."
                          rows={3}
                          className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-700">Answer Options</Label>
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="h-12 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateQuestion(index, { correctAnswer: optionIndex })}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <Label className="text-sm font-medium text-slate-600">Correct</Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-700">Correct Answer</Label>
                          <Select
                            value={String(question.correctAnswer)}
                            onValueChange={(value) => updateQuestion(index, { correctAnswer: value === 'true' })}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                          placeholder="Explain why this is the correct answer..."
                          rows={2}
                          className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
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
            className="px-8 py-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
