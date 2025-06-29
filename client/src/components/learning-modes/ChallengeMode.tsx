import React, { useState, useEffect } from 'react';
import { Zap, Clock, Focus, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface ChallengeSession {
  id: string;
  isActive: boolean;
  timeLimit: number;
  timeRemaining: number;
  questionsCompleted: number;
  totalQuestions: number;
  currentStreak: number;
  bestTime: number;
  accuracy: number;
}

export function ChallengeMode() {
  const [challengeMode, setChallengeMode] = useState(false);
  const [session, setSession] = useState<ChallengeSession>({
    id: 'challenge-1',
    isActive: false,
    timeLimit: 300, // 5 minutes
    timeRemaining: 300,
    questionsCompleted: 0,
    totalQuestions: 10,
    currentStreak: 0,
    bestTime: 0,
    accuracy: 100
  });

  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);

  // TODO: connect to backend - challenge mode settings
  // const { data: challengeSettings, mutate: updateSettings } = useQuery({
  //   queryKey: ['/api/user/challenge-settings'],
  //   enabled: !!user
  // });

  useEffect(() => {
    if (session.isActive && session.timeRemaining > 0) {
      const timer = setInterval(() => {
        setSession(prev => {
          if (prev.timeRemaining <= 1) {
            setShowTimeUpModal(true);
            return { ...prev, isActive: false, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session.isActive, session.timeRemaining]);

  const handleStartChallenge = () => {
    setSession(prev => ({
      ...prev,
      isActive: true,
      timeRemaining: prev.timeLimit,
      questionsCompleted: 0,
      currentStreak: 0,
      accuracy: 100
    }));
    
    if (challengeMode) {
      setShowFocusMode(true);
    }

    // TODO: connect to backend - start challenge session
    // await mutate({
    //   url: '/api/challenge/start',
    //   method: 'POST',
    //   body: { timeLimit: session.timeLimit }
    // });
  };

  const handleStopChallenge = () => {
    setSession(prev => ({ ...prev, isActive: false }));
    setShowFocusMode(false);
    
    // TODO: connect to backend - end challenge session
    // await mutate({
    //   url: '/api/challenge/end',
    //   method: 'POST',
    //   body: { sessionId: session.id }
    // });
  };

  const handleAnswerQuestion = (correct: boolean) => {
    setSession(prev => {
      const newCompleted = prev.questionsCompleted + 1;
      const newStreak = correct ? prev.currentStreak + 1 : 0;
      const newAccuracy = Math.round(((prev.accuracy * prev.questionsCompleted) + (correct ? 100 : 0)) / newCompleted);
      
      return {
        ...prev,
        questionsCompleted: newCompleted,
        currentStreak: newStreak,
        accuracy: newAccuracy
      };
    });

    // TODO: connect to backend - submit answer
    // await mutate({
    //   url: '/api/challenge/answer',
    //   method: 'POST',
    //   body: { sessionId: session.id, correct }
    // });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (session.timeRemaining / session.timeLimit) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (showFocusMode && session.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-6">
        {/* Focus Mode Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Focus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Challenge Mode</h1>
                <p className="text-blue-200">Stay focused, no distractions</p>
              </div>
            </div>
            <Button 
              onClick={handleStopChallenge}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Exit Challenge
            </Button>
          </div>

          {/* Challenge Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getTimeColor()}`}>
                  {formatTime(session.timeRemaining)}
                </div>
                <div className="text-blue-200 text-sm">Time Left</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {session.questionsCompleted}
                </div>
                <div className="text-blue-200 text-sm">Completed</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {session.currentStreak}
                </div>
                <div className="text-blue-200 text-sm">Streak</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {session.accuracy}%
                </div>
                <div className="text-blue-200 text-sm">Accuracy</div>
              </div>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="p-4 mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{session.questionsCompleted} / {session.totalQuestions}</span>
            </div>
            <Progress 
              value={(session.questionsCompleted / session.totalQuestions) * 100} 
              className="h-3"
            />
          </Card>

          {/* Sample Question (Demo) */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-semibold mb-4">
              Which React hook is used for side effects?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['useState', 'useEffect', 'useContext', 'useCallback'].map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerQuestion(option === 'useEffect')}
                  className="p-4 h-auto text-left justify-start bg-white/5 hover:bg-white/20 border-white/20"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time's Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="p-8 max-w-md mx-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You completed {session.questionsCompleted} questions with {session.accuracy}% accuracy
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowTimeUpModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Review Results
                </Button>
                <Button 
                  onClick={() => {
                    setShowTimeUpModal(false);
                    handleStartChallenge();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Challenge Mode Settings */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Challenge Mode</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Race against time to test your knowledge
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={challengeMode}
              onCheckedChange={setChallengeMode}
              id="challenge-mode"
            />
            <label htmlFor="challenge-mode" className="text-sm font-medium">
              Enable
            </label>
          </div>
        </div>

        {challengeMode && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="font-semibold">5 min</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Time Limit</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                <Target className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <div className="font-semibold">10</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Questions</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                <Focus className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <div className="font-semibold">Focus</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">No Distractions</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                <div className="font-semibold">2x XP</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Bonus Reward</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Challenge Features:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Speed timer for each question
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Fullscreen focus mode
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No comments or notes (distraction-free)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Double XP rewards for completion
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              {!session.isActive ? (
                <Button 
                  onClick={handleStartChallenge}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              ) : (
                <Button 
                  onClick={handleStopChallenge}
                  variant="outline"
                  className="flex-1"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Stop Challenge
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Challenge Stats */}
      {session.isActive && !showFocusMode && (
        <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Challenge</h3>
            <Badge variant="default" className="bg-blue-500 text-white animate-pulse">
              In Progress
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTimeColor()}`}>
                {formatTime(session.timeRemaining)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {session.questionsCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {session.currentStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {session.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
          </div>
          <Button 
            onClick={() => setShowFocusMode(true)}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Focus className="w-4 h-4 mr-2" />
            Enter Focus Mode
          </Button>
        </Card>
      )}
    </div>
  );
}