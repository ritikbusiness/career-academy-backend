import React, { useState, useEffect } from 'react';
import { Swords, Clock, Trophy, Users, Zap, Shield, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BattlePlayer {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  currentAnswer?: string;
  score: number;
  streak: number;
  isReady: boolean;
}

interface BattleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number;
}

interface BattleState {
  status: 'waiting' | 'countdown' | 'question' | 'results' | 'finished';
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  players: BattlePlayer[];
}

export function BattleMode() {
  const [battleState, setBattleState] = useState<BattleState>({
    status: 'waiting',
    currentQuestion: 0,
    totalQuestions: 5,
    timeRemaining: 0,
    players: []
  });

  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [battleResults, setBattleResults] = useState<BattlePlayer[]>([]);

  // TODO: connect to backend - real-time battle system
  // const { data: battleData, mutate: joinBattle } = useQuery({
  //   queryKey: ['/api/battle/current'],
  //   enabled: battleState.status !== 'waiting'
  // });

  const mockPlayers: BattlePlayer[] = [
    {
      id: 'player-1',
      username: 'You',
      avatar: '',
      level: 5,
      score: 0,
      streak: 0,
      isReady: true
    },
    {
      id: 'player-2',
      username: 'CodeNinja',
      avatar: '',
      level: 7,
      score: 0,
      streak: 0,
      isReady: true
    },
    {
      id: 'player-3',
      username: 'ReactMaster',
      avatar: '',
      level: 6,
      score: 0,
      streak: 0,
      isReady: true
    },
    {
      id: 'player-4',
      username: 'DevQueen',
      avatar: '',
      level: 8,
      score: 0,
      streak: 0,
      isReady: false
    }
  ];

  const mockQuestions: BattleQuestion[] = [
    {
      id: 'q1',
      question: 'Which hook is used to manage state in React?',
      options: ['useEffect', 'useState', 'useCallback', 'useMemo'],
      correctAnswer: 'useState',
      timeLimit: 15
    },
    {
      id: 'q2',
      question: 'What is JSX?',
      options: ['JavaScript XML', 'Java Syntax Extension', 'JSON eXtension', 'JavaScript eXecution'],
      correctAnswer: 'JavaScript XML',
      timeLimit: 15
    }
  ];

  useEffect(() => {
    if (battleState.status === 'countdown' || battleState.status === 'question') {
      const timer = setInterval(() => {
        setBattleState(prev => {
          if (prev.timeRemaining <= 1) {
            if (prev.status === 'countdown') {
              return {
                ...prev,
                status: 'question',
                timeRemaining: mockQuestions[prev.currentQuestion]?.timeLimit || 15
              };
            } else {
              return {
                ...prev,
                status: 'results',
                timeRemaining: 0
              };
            }
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [battleState.status]);

  const handleStartMatchmaking = () => {
    setShowMatchmaking(true);
    setBattleState(prev => ({
      ...prev,
      players: mockPlayers,
      status: 'waiting'
    }));

    // Simulate matchmaking
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        status: 'countdown',
        timeRemaining: 3
      }));
    }, 2000);

    // TODO: connect to backend - join battle queue
    // await joinBattle({
    //   url: '/api/battle/join',
    //   method: 'POST'
    // });
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    // TODO: connect to backend - submit answer
    // await mutate({
    //   url: '/api/battle/answer',
    //   method: 'POST',
    //   body: { questionId: currentQuestion.id, answer }
    // });
  };

  const handleNextQuestion = () => {
    if (battleState.currentQuestion < battleState.totalQuestions - 1) {
      setBattleState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        status: 'question',
        timeRemaining: mockQuestions[prev.currentQuestion + 1]?.timeLimit || 15
      }));
      setSelectedAnswer('');
    } else {
      setBattleState(prev => ({
        ...prev,
        status: 'finished'
      }));
      setBattleResults(mockPlayers.sort((a, b) => b.score - a.score));
    }
  };

  const currentQuestion = mockQuestions[battleState.currentQuestion];

  if (!showMatchmaking) {
    return (
      <Card className="p-8 text-center bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Swords className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Battle Mode</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Compete against other students in real-time quizzes. Test your knowledge and climb the leaderboard!
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="font-semibold text-blue-600 dark:text-blue-400">5</div>
              <div className="text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="font-semibold text-green-600 dark:text-green-400">15s</div>
              <div className="text-gray-600 dark:text-gray-400">Per Question</div>
            </div>
          </div>
          <Button
            onClick={handleStartMatchmaking}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-3 text-lg"
          >
            <Swords className="w-5 h-5 mr-2" />
            Start Battle
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <Card className="p-4 bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">React Fundamentals Battle</h2>
              <p className="text-red-100">Question {battleState.currentQuestion + 1} of {battleState.totalQuestions}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{battleState.timeRemaining}s</div>
            <div className="text-red-100">Time Remaining</div>
          </div>
        </div>
        <Progress 
          value={(battleState.timeRemaining / 15) * 100} 
          className="mt-3 bg-red-600"
        />
      </Card>

      {/* Battle Status */}
      {battleState.status === 'waiting' && (
        <Card className="p-6">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Finding Opponents...</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Matching you with players of similar skill level
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </Card>
      )}

      {battleState.status === 'countdown' && (
        <Card className="p-8 text-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 animate-pulse">
            {battleState.timeRemaining}
          </div>
          <p className="text-xl font-semibold mt-2">Get Ready!</p>
        </Card>
      )}

      {/* Players */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {battleState.players.map((player) => (
          <Card key={player.id} className={`p-4 transition-all duration-300 ${
            player.id === 'player-1' ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}>
            <div className="text-center">
              <Avatar className="w-12 h-12 mx-auto mb-2">
                <AvatarImage src={player.avatar} alt={player.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {player.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-sm">{player.username}</h4>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Crown className="w-3 h-3 text-yellow-500" />
                <span className="text-xs">Level {player.level}</span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {player.score}
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              {player.streak > 0 && (
                <Badge variant="outline" className="mt-1 text-xs">
                  <Zap className="w-2 h-2 mr-1" />
                  {player.streak}
                </Badge>
              )}
              {battleState.status === 'question' && player.currentAnswer && (
                <div className="mt-2">
                  <Badge variant="default" className="bg-green-500 text-white text-xs">
                    Answered
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Question */}
      {battleState.status === 'question' && currentQuestion && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                onClick={() => handleAnswerSelect(option)}
                className={`p-4 h-auto text-left justify-start transition-all duration-200 ${
                  selectedAnswer === option 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                disabled={!!selectedAnswer}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    selectedAnswer === option
                      ? 'bg-white text-blue-500 border-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {battleState.status === 'results' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Question Results</h3>
            <p className="text-green-600 dark:text-green-400">
              Correct Answer: {currentQuestion?.correctAnswer}
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleNextQuestion}>
              {battleState.currentQuestion < battleState.totalQuestions - 1 ? 'Next Question' : 'View Final Results'}
            </Button>
          </div>
        </Card>
      )}

      {/* Final Results */}
      {battleState.status === 'finished' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold mb-2">Battle Complete!</h3>
          </div>
          <div className="space-y-3">
            {battleResults.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {index + 1}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{player.username}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Level {player.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{player.score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => {
                setShowMatchmaking(false);
                setBattleState({
                  status: 'waiting',
                  currentQuestion: 0,
                  totalQuestions: 5,
                  timeRemaining: 0,
                  players: []
                });
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Play Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}