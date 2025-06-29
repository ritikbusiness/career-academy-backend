import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle, PlayCircle, Star, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuizNode {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  requiredScore: number;
  userScore?: number;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  unlocks: string[];
}

interface ContentNode {
  id: string;
  title: string;
  type: 'lesson' | 'module';
  isUnlocked: boolean;
  isCompleted: boolean;
  requiredQuiz: string;
}

export function PuzzleQuizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizNode | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  // TODO: connect to backend - fetch quiz chain data
  // const { data: quizChainData } = useQuery({
  //   queryKey: ['/api/quiz-chain'],
  //   enabled: true
  // });

  const mockQuizNodes: QuizNode[] = [
    {
      id: 'quiz-1',
      title: 'Introduction to React',
      description: 'Test your basic React knowledge',
      isUnlocked: true,
      isCompleted: true,
      isActive: false,
      requiredScore: 80,
      userScore: 95,
      xpReward: 100,
      difficulty: 'easy',
      unlocks: ['quiz-2', 'lesson-2']
    },
    {
      id: 'quiz-2',
      title: 'React Hooks Mastery',
      description: 'Advanced hooks concepts and patterns',
      isUnlocked: true,
      isCompleted: false,
      isActive: true,
      requiredScore: 85,
      xpReward: 150,
      difficulty: 'medium',
      unlocks: ['quiz-3', 'module-2']
    },
    {
      id: 'quiz-3',
      title: 'State Management',
      description: 'Context, Redux, and advanced patterns',
      isUnlocked: false,
      isCompleted: false,
      isActive: false,
      requiredScore: 90,
      xpReward: 200,
      difficulty: 'hard',
      unlocks: ['quiz-4', 'module-3']
    },
    {
      id: 'quiz-4',
      title: 'Performance Optimization',
      description: 'React performance best practices',
      isUnlocked: false,
      isCompleted: false,
      isActive: false,
      requiredScore: 85,
      xpReward: 180,
      difficulty: 'hard',
      unlocks: ['module-4']
    }
  ];

  const mockContentNodes: ContentNode[] = [
    {
      id: 'lesson-2',
      title: 'JSX Deep Dive',
      type: 'lesson',
      isUnlocked: true,
      isCompleted: false,
      requiredQuiz: 'quiz-1'
    },
    {
      id: 'module-2',
      title: 'Advanced React Patterns',
      type: 'module',
      isUnlocked: false,
      isCompleted: false,
      requiredQuiz: 'quiz-2'
    },
    {
      id: 'module-3',
      title: 'React Ecosystem',
      type: 'module',
      isUnlocked: false,
      isCompleted: false,
      requiredQuiz: 'quiz-3'
    },
    {
      id: 'module-4',
      title: 'Production Ready React',
      type: 'module',
      isUnlocked: false,
      isCompleted: false,
      requiredQuiz: 'quiz-4'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const handleStartQuiz = (quiz: QuizNode) => {
    setSelectedQuiz(quiz);
    // TODO: connect to backend - start quiz session
    // await mutate({
    //   url: `/api/quiz/${quiz.id}/start`,
    //   method: 'POST'
    // });
  };

  const handleCompleteQuiz = (quizId: string, score: number) => {
    // Simulate quiz completion and unlocking
    const quiz = mockQuizNodes.find(q => q.id === quizId);
    if (quiz && score >= quiz.requiredScore) {
      setShowUnlockAnimation(quizId);
      setTimeout(() => setShowUnlockAnimation(null), 3000);
      
      // TODO: connect to backend - complete quiz
      // await mutate({
      //   url: `/api/quiz/${quizId}/complete`,
      //   method: 'POST',
      //   body: { score }
      // });
    }
  };

  const getConnectionPath = (fromIndex: number, toIndex: number) => {
    const isNext = toIndex === fromIndex + 1;
    if (isNext) {
      return 'M 50 100 L 50 120 L 150 120 L 150 0';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Unlock Animation */}
      {showUnlockAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-2xl shadow-2xl animate-bounce">
            <div className="text-center text-white">
              <Unlock className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Content Unlocked!</h2>
              <p className="text-lg">You can now access the next level!</p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Chain Progress */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Quiz Learning Path
        </h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((mockQuizNodes.filter(q => q.isCompleted).length / mockQuizNodes.length) * 100)}%</span>
          </div>
          <Progress value={(mockQuizNodes.filter(q => q.isCompleted).length / mockQuizNodes.length) * 100} className="h-2" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete quizzes to unlock new lessons and modules. Maintain high scores to unlock advanced content!
        </p>
      </Card>

      {/* Quiz Chain Visualization */}
      <Card className="p-6">
        <div className="relative">
          <div className="grid gap-6">
            {mockQuizNodes.map((quiz, index) => (
              <div key={quiz.id} className="relative">
                {/* Connection Line to Next Quiz */}
                {index < mockQuizNodes.length - 1 && (
                  <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gray-300 dark:bg-gray-600 transform -translate-x-0.5 z-0"></div>
                )}
                
                {/* Quiz Node */}
                <div
                  className={`relative z-10 p-4 rounded-lg border-2 transition-all duration-300 ${
                    quiz.isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-lg'
                      : quiz.isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : quiz.isUnlocked
                      ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Quiz Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      quiz.isCompleted
                        ? 'bg-green-500 text-white'
                        : quiz.isUnlocked
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {quiz.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : quiz.isUnlocked ? (
                        <PlayCircle className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>

                    {/* Quiz Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        {quiz.isCompleted && quiz.userScore && (
                          <Badge variant="default" className="bg-green-500 text-white">
                            {quiz.userScore}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {quiz.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Required: {quiz.requiredScore}%</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {quiz.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {quiz.isCompleted ? (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : quiz.isUnlocked ? (
                        <Button
                          onClick={() => handleStartQuiz(quiz)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Unlocks Preview */}
                  {quiz.unlocks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Unlocks:</p>
                      <div className="flex flex-wrap gap-2">
                        {quiz.unlocks.map(unlockId => {
                          const content = mockContentNodes.find(c => c.id === unlockId);
                          const unlockedQuiz = mockQuizNodes.find(q => q.id === unlockId);
                          const item = content || unlockedQuiz;
                          
                          if (!item) return null;
                          
                          return (
                            <Badge
                              key={unlockId}
                              variant="outline"
                              className={`text-xs ${
                                quiz.isCompleted
                                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {item.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Completion Button */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            Demo: Complete the active quiz to unlock next content
          </p>
          <Button
            onClick={() => handleCompleteQuiz('quiz-2', 90)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            size="sm"
          >
            Complete Quiz 2 (90% Score)
          </Button>
        </div>
      </Card>

      {/* Locked Content Warning */}
      <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            You must complete Quiz 2 to unlock Module 3
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Achieve at least 85% to unlock advanced React patterns and the next module.
          </p>
        </div>
      </Card>
    </div>
  );
}