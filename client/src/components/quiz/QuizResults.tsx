
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RotateCcw, Clock, Target, Award } from 'lucide-react';
import { QuizResult } from '@/types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onContinue: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRetake, onContinue }) => {
  const { attempt, quiz, correctAnswers, feedback } = result;
  const isPassed = attempt.passed;
  const correctCount = Math.floor(attempt.score * quiz.questions.length / 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 mb-8 overflow-hidden">
          <div className={`${isPassed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} px-8 py-8 text-white text-center`}>
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 ${isPassed ? 'bg-green-400' : 'bg-red-400'} rounded-full flex items-center justify-center shadow-lg`}>
                {isPassed ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : (
                  <XCircle className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              {isPassed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            
            <p className="text-lg opacity-90 mb-6">
              {isPassed ? 'You passed the quiz successfully!' : 'You can retake the quiz to improve your score'}
            </p>

            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{attempt.score}%</div>
                <div className="text-sm opacity-80">Your Score</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">{quiz.passingScore}%</div>
                <div className="text-sm opacity-80">Required</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{Object.keys(attempt.answers).length}</div>
            <div className="text-sm text-slate-600">Questions</div>
          </Card>
          
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{correctCount}</div>
            <div className="text-sm text-slate-600">Correct</div>
          </Card>
          
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{quiz.questions.length - correctCount}</div>
            <div className="text-sm text-slate-600">Incorrect</div>
          </Card>
          
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatTime(attempt.timeSpent)}</div>
            <div className="text-sm text-slate-600">Time Taken</div>
          </Card>
        </div>

        {/* Question Review */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id];
                const correctAnswer = correctAnswers[question.id];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div key={question.id} className="border border-slate-200 rounded-xl p-6 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 mb-4">
                          {index + 1}. {question.question}
                        </h4>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-600">Your answer:</span>
                              <Badge variant={isCorrect ? "default" : "destructive"} className="font-medium">
                                {question.options[userAnswer as number]}
                              </Badge>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-600">Correct answer:</span>
                                <Badge className="bg-green-100 text-green-800 font-medium">
                                  {question.options[correctAnswer as number]}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-600">Your answer:</span>
                              <Badge variant={isCorrect ? "default" : "destructive"} className="font-medium">
                                {userAnswer ? 'True' : 'False'}
                              </Badge>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-600">Correct answer:</span>
                                <Badge className="bg-green-100 text-green-800 font-medium">
                                  {correctAnswer ? 'True' : 'False'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        {feedback[question.id] && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800 font-medium">{feedback[question.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={onRetake} 
            className="px-8 py-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
          <Button 
            onClick={onContinue}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
