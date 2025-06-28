
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { QuizResult } from '@/types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onContinue: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRetake, onContinue }) => {
  const { attempt, quiz, correctAnswers, feedback } = result;
  const isPassed = attempt.passed;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isPassed ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl mb-2">
            {isPassed ? 'Congratulations!' : 'Quiz Not Passed'}
          </CardTitle>
          
          <div className="flex justify-center gap-4 mb-4">
            <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-2">
              Score: {attempt.score}%
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Time: {formatTime(attempt.timeSpent)}
            </Badge>
          </div>

          <p className="text-gray-600">
            Passing score: {quiz.passingScore}% | Questions: {quiz.questions.length}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(attempt.answers).length}
              </div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(attempt.score * quiz.questions.length / 100)}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {quiz.questions.length - Math.floor(attempt.score * quiz.questions.length / 100)}
              </div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Question Review</h3>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id];
                const correctAnswer = correctAnswers[question.id];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <Card key={question.id} className="border-l-4 border-l-gray-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Your answer:</span>
                                <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                  {question.options[userAnswer as number]}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Correct answer:</span>
                                  <span className="text-green-600">
                                    {question.options[correctAnswer as number]}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Your answer:</span>
                                <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                  {userAnswer ? 'True' : 'False'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Correct answer:</span>
                                  <span className="text-green-600">
                                    {correctAnswer ? 'True' : 'False'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {feedback[question.id] && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">{feedback[question.id]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={onRetake} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button onClick={onContinue}>
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
