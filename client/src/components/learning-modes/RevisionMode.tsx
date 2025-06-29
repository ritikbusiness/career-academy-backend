import React, { useState } from 'react';
import { RotateCcw, Brain, CheckCircle, X, Star, Target, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface RevisionItem {
  id: string;
  title: string;
  type: 'lesson' | 'concept' | 'skill';
  lastReviewed: string;
  masteryLevel: number;
  dueForReview: boolean;
  priority: 'high' | 'medium' | 'low';
  reviewCount: number;
}

interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastResult: 'correct' | 'incorrect' | 'confused' | null;
}

export function RevisionMode() {
  const [revisionStreak, setRevisionStreak] = useState(5);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    needsMoreWork: 0
  });

  // TODO: connect to backend - revision data
  // const { data: revisionData, mutate: updateRevision } = useQuery({
  //   queryKey: ['/api/user/revision'],
  //   enabled: !!user
  // });

  const mockRevisionItems: RevisionItem[] = [
    {
      id: 'rev1',
      title: 'React Component Lifecycle',
      type: 'concept',
      lastReviewed: '2024-01-15',
      masteryLevel: 65,
      dueForReview: true,
      priority: 'high',
      reviewCount: 3
    },
    {
      id: 'rev2',
      title: 'JavaScript Closures',
      type: 'concept',
      lastReviewed: '2024-01-12',
      masteryLevel: 45,
      dueForReview: true,
      priority: 'high',
      reviewCount: 2
    },
    {
      id: 'rev3',
      title: 'CSS Flexbox Layout',
      type: 'skill',
      lastReviewed: '2024-01-10',
      masteryLevel: 80,
      dueForReview: false,
      priority: 'medium',
      reviewCount: 5
    },
    {
      id: 'rev4',
      title: 'API Integration Patterns',
      type: 'lesson',
      lastReviewed: '2024-01-08',
      masteryLevel: 35,
      dueForReview: true,
      priority: 'high',
      reviewCount: 1
    }
  ];

  const mockFlashCards: FlashCard[] = [
    {
      id: 'card1',
      front: 'What hook is used to manage component state in React?',
      back: 'useState() - Allows you to add state to functional components',
      difficulty: 'easy',
      lastResult: null
    },
    {
      id: 'card2',
      front: 'Explain the concept of JavaScript closures',
      back: 'A closure is when a function retains access to variables from its outer scope even after the outer function has returned',
      difficulty: 'medium',
      lastResult: null
    },
    {
      id: 'card3',
      front: 'What is the difference between flexbox and CSS Grid?',
      back: 'Flexbox is one-dimensional (row or column), while Grid is two-dimensional (rows and columns simultaneously)',
      difficulty: 'medium',
      lastResult: null
    }
  ];

  const currentCard = mockFlashCards[currentCardIndex];
  const dueItems = mockRevisionItems.filter(item => item.dueForReview);

  const handleStartRevision = () => {
    setSessionActive(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({ reviewed: 0, correct: 0, needsMoreWork: 0 });

    // TODO: connect to backend - start revision session
    // await mutate({
    //   url: '/api/revision/start-session',
    //   method: 'POST'
    // });
  };

  const handleCardResponse = (response: 'easy' | 'medium' | 'hard') => {
    const isCorrect = response === 'easy';
    
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      needsMoreWork: prev.needsMoreWork + (isCorrect ? 0 : 1)
    }));

    // Move to next card or end session
    if (currentCardIndex < mockFlashCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionActive(false);
      if (isCorrect) {
        setRevisionStreak(prev => prev + 1);
      }
    }

    // TODO: connect to backend - record card response
    // await mutate({
    //   url: '/api/revision/card-response',
    //   method: 'POST',
    //   body: { cardId: currentCard.id, response }
    // });
  };

  const handleMarkAsRelearned = (itemId: string) => {
    // TODO: connect to backend - mark as relearned
    // await mutate({
    //   url: `/api/revision/${itemId}/relearned`,
    //   method: 'POST'
    // });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (sessionActive) {
    return (
      <div className="space-y-6">
        {/* Revision Session Header */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Revision Session</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Card {currentCardIndex + 1} of {mockFlashCards.length}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setSessionActive(false)}
              variant="outline"
              size="sm"
            >
              End Session
            </Button>
          </div>
          
          <Progress 
            value={((currentCardIndex) / mockFlashCards.length) * 100} 
            className="h-2 mb-4"
          />
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400">{sessionStats.reviewed}</div>
              <div className="text-gray-600 dark:text-gray-400">Reviewed</div>
            </div>
            <div>
              <div className="font-bold text-green-600 dark:text-green-400">{sessionStats.correct}</div>
              <div className="text-gray-600 dark:text-gray-400">Mastered</div>
            </div>
            <div>
              <div className="font-bold text-orange-600 dark:text-orange-400">{sessionStats.needsMoreWork}</div>
              <div className="text-gray-600 dark:text-gray-400">Need Work</div>
            </div>
          </div>
        </Card>

        {/* Flashcard */}
        <Card className="p-8 min-h-[300px] flex flex-col justify-center">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              currentCard.difficulty === 'easy' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : currentCard.difficulty === 'medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Brain className={`w-8 h-8 ${
                currentCard.difficulty === 'easy' 
                  ? 'text-green-600 dark:text-green-400' 
                  : currentCard.difficulty === 'medium'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            
            <Badge variant="outline" className="mb-4">
              {currentCard.difficulty} difficulty
            </Badge>
            
            <h3 className="text-xl font-semibold mb-6">
              {showAnswer ? 'Answer:' : 'Question:'}
            </h3>
            
            <p className="text-lg leading-relaxed mb-8">
              {showAnswer ? currentCard.back : currentCard.front}
            </p>
            
            {!showAnswer ? (
              <Button
                onClick={() => setShowAnswer(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
              >
                Show Answer
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  How well did you know this?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => handleCardResponse('hard')}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Still Confused
                  </Button>
                  <Button
                    onClick={() => handleCardResponse('medium')}
                    variant="outline"
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Need Practice
                  </Button>
                  <Button
                    onClick={() => handleCardResponse('easy')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Got It!
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revision Mode Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Revision Mode</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smart reminders for spaced repetition
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {revisionStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
            <div className="text-xl font-bold text-red-600 dark:text-red-400">{dueItems.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Due for Review</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(mockRevisionItems.reduce((acc, item) => acc + item.masteryLevel, 0) / mockRevisionItems.length)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Mastery</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{revisionStreak}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Streak Days</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {mockRevisionItems.reduce((acc, item) => acc + item.reviewCount, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Reviews</div>
          </div>
        </div>
      </Card>

      {/* Smart Reminder */}
      <Card className="p-6 border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold">Smart Reminder</h3>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          It's time to review <strong>React Component Lifecycle</strong>! 
          You last studied this 5 days ago and it's optimal for retention.
        </p>
        <Button 
          onClick={handleStartRevision}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Brain className="w-4 h-4 mr-2" />
          Start Revision Session
        </Button>
      </Card>

      {/* Revision Queue */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Review Queue ({dueItems.length} items)
        </h3>
        <div className="space-y-3">
          {mockRevisionItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                item.dueForReview
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{item.title}</h4>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority} priority
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {item.dueForReview && (
                    <Badge variant="default" className="bg-red-500 text-white">
                      Due
                    </Badge>
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getDaysAgo(item.lastReviewed)} days ago
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mastery Level</span>
                    <span>{item.masteryLevel}%</span>
                  </div>
                  <Progress value={item.masteryLevel} className="h-2" />
                </div>
                
                <div className="flex gap-2">
                  {item.masteryLevel >= 80 ? (
                    <Button
                      onClick={() => handleMarkAsRelearned(item.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark as Re-learned
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Review Now
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Reviewed {item.reviewCount} times • Last: {item.lastReviewed}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revision Streak Tracker */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Revision Streak
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{revisionStreak}</span>
          </div>
          <div>
            <h4 className="text-xl font-bold">Great job!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You've been reviewing consistently for {revisionStreak} days
            </p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                i < revisionStreak
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {i < revisionStreak ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Keep your streak alive! Review at least one topic daily.
        </p>
      </Card>
    </div>
  );
}