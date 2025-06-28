
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Quiz, Question, QuizAttempt } from '@/types/quiz';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | number | boolean }>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [startTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (answer: string | number | boolean) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // TODO: connect to backend - calculate score and create attempt
    const score = Math.floor(Math.random() * 100); // Dummy score
    const passed = score >= quiz.passingScore;

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      userId: 'current-user-id', // TODO: get from auth context
      answers,
      score,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent
    };

    onComplete(attempt);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className="flex items-center gap-6">
                {timeRemaining && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg font-semibold">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={onExit}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  Exit Quiz
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
            <p className="text-blue-100 mt-3 text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 mb-8 overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'True or False'}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>
            
            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-5 text-left border-2 rounded-xl transition-all duration-200 group ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300 group-hover:border-blue-400'
                      }`}>
                        {answers[currentQuestion.id] === index && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-slate-700 font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* True/False Options */}
            {currentQuestion.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'True', value: true, color: 'green' },
                  { label: 'False', value: false, color: 'red' }
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`p-6 text-center border-2 rounded-xl transition-all duration-200 group ${
                      answers[currentQuestion.id] === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-sm`
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        answers[currentQuestion.id] === option.value
                          ? `border-${option.color}-500 bg-${option.color}-500`
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {answers[currentQuestion.id] === option.value && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-lg font-semibold text-slate-700">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 font-semibold"
              >
                Submit Quiz
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 font-semibold"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
