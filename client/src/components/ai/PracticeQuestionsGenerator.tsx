import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Loader2, CheckCircle, XCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface PracticeQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PracticeQuestionsGeneratorProps {
  lessonContent: string;
  lessonTitle: string;
  onQuestionsGenerated?: (questions: PracticeQuestion[]) => void;
}

const PracticeQuestionsGenerator: React.FC<PracticeQuestionsGeneratorProps> = ({
  lessonContent,
  lessonTitle,
  onQuestionsGenerated
}) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | boolean }>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ content, title, count }: { content: string; title: string; count: number }) => {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonContent: content,
          lessonTitle: title,
          count
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      return response.json();
    },
    onSuccess: (data: { questions: PracticeQuestion[] }) => {
      setQuestions(data.questions);
      setSelectedAnswers({});
      setShowResults(false);
      onQuestionsGenerated?.(data.questions);
    },
  });

  const handleGenerateQuestions = () => {
    generateQuestionsMutation.mutate({
      content: lessonContent,
      title: lessonTitle,
      count: questionCount
    });
  };

  const handleAnswerSelect = (questionId: string, answer: string | boolean) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnswerIcon = (questionId: string, isCorrect: boolean) => {
    if (!showResults) return null;
    return isCorrect ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  const correctAnswersCount = questions.filter(q => 
    selectedAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Practice Questions
        </CardTitle>
        <CardDescription>
          Generate custom practice questions to test your understanding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.length === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                className="w-32 mt-1"
              />
            </div>
            
            <Button 
              onClick={handleGenerateQuestions}
              disabled={generateQuestionsMutation.isPending || !lessonContent}
              className="w-full"
            >
              {generateQuestionsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Practice Questions
                </>
              )}
            </Button>
          </div>
        )}

        {generateQuestionsMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Failed to generate questions. Please try again.
            </p>
          </div>
        )}

        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Practice Quiz</h3>
              <div className="flex items-center gap-2">
                {showResults && (
                  <Badge variant="outline" className="text-sm">
                    Score: {correctAnswersCount}/{questions.length}
                  </Badge>
                )}
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                const hasAnswer = selectedAnswers[question.id] !== undefined;

                return (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Q{index + 1}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        {hasAnswer && getAnswerIcon(question.id, isCorrect)}
                      </div>

                      <h4 className="font-medium mb-3 text-gray-900">
                        {question.question}
                      </h4>

                      <div className="space-y-2">
                        {question.type === 'multiple-choice' && question.options && (
                          <>
                            {question.options.map((option, optionIndex) => (
                              <label
                                key={optionIndex}
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedAnswers[question.id] === option
                                    ? showResults
                                      ? option === question.correctAnswer
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-red-50 border-red-300'
                                      : 'bg-blue-50 border-blue-300'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={selectedAnswers[question.id] === option}
                                  onChange={() => handleAnswerSelect(question.id, option)}
                                  disabled={showResults}
                                  className="mr-3"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </>
                        )}

                        {question.type === 'true-false' && (
                          <div className="space-y-2">
                            {[true, false].map((value) => (
                              <label
                                key={value.toString()}
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedAnswers[question.id] === value
                                    ? showResults
                                      ? value === question.correctAnswer
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-red-50 border-red-300'
                                      : 'bg-blue-50 border-blue-300'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={value.toString()}
                                  checked={selectedAnswers[question.id] === value}
                                  onChange={() => handleAnswerSelect(question.id, value)}
                                  disabled={showResults}
                                  className="mr-3"
                                />
                                <span className="text-sm">{value ? 'True' : 'False'}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {showResults && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                              <p className="text-sm text-blue-800">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {!showResults && (
              <Button 
                onClick={handleCheckAnswers}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className="w-full"
              >
                Check Answers
              </Button>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateQuestions}
                variant="outline"
                disabled={generateQuestionsMutation.isPending}
                className="flex-1"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate New Questions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeQuestionsGenerator;