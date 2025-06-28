
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Quiz, QuizAttempt } from '@/types/quiz';
import QuizQuestion from './QuizQuestion';
import QuizTimer from './QuizTimer';

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
    const score = Math.floor(Math.random() * 100);
    const passed = score >= quiz.passingScore;

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      userId: 'current-user-id',
      answers,
      score,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent
    };

    onComplete(attempt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                <p className="text-blue-100 text-lg">Stay focused and do your best!</p>
              </div>
              <div className="flex items-center gap-6">
                {timeRemaining && <QuizTimer timeRemaining={timeRemaining} />}
                <Button 
                  variant="outline" 
                  onClick={onExit}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  Exit Quiz
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Progress value={progress} className="h-4 bg-white/20" />
              <div className="flex justify-between text-blue-100 text-sm font-medium">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <QuizQuestion
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={quiz.questions.length}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-8 py-4 rounded-2xl border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 font-semibold text-lg"
              >
                Submit Quiz
                <CheckCircle className="w-5 h-5 ml-3" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 font-semibold text-lg"
              >
                Next Question
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
