
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{existingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={quiz.timeLimit || ''}
                onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                value={quiz.passingScore}
                onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={quiz.description || ''}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Quiz description..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Questions ({quiz.questions.length})</h3>
              <Button onClick={addQuestion} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Question Type</Label>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Question Text</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(index, { question: e.target.value })}
                          placeholder="Enter your question..."
                          rows={2}
                        />
                      </div>

                      {question.type === 'multiple-choice' && question.options && (
                        <div>
                          <Label>Answer Options</Label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-3">
                                <Input
                                  value={option}
                                  onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateQuestion(index, { correctAnswer: optionIndex })}
                                  />
                                  <Label className="text-sm">Correct</Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div>
                          <Label>Correct Answer</Label>
                          <Select
                            value={question.correctAnswer?.toString()}
                            onValueChange={(value) => updateQuestion(index, { correctAnswer: value === 'true' })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                          placeholder="Explain the correct answer..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizEditor;
