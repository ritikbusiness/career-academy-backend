import React, { useState } from 'react';
import { Gamepad2, Brain, Zap, Tv, Leaf, RotateCcw, Trophy, Swords } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Import all gamification components
import { LevelUpSystem } from '@/components/gamification/LevelUpSystem';
import { CourseStreaks } from '@/components/gamification/CourseStreaks';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { PuzzleQuizzes } from '@/components/gamification/PuzzleQuizzes';
import { BattleMode } from '@/components/gamification/BattleMode';

// Import all learning mode components
import { ChallengeMode } from '@/components/learning-modes/ChallengeMode';
import { RelaxMode } from '@/components/learning-modes/RelaxMode';
import { BingeMode } from '@/components/learning-modes/BingeMode';
import { RevisionMode } from '@/components/learning-modes/RevisionMode';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  category: 'gamification' | 'learning-modes';
  icon: React.ReactNode;
  component: React.ReactNode;
  tags: string[];
  inspiration: string;
}

export default function GamificationDemo() {
  const [selectedFeature, setSelectedFeature] = useState<string>('level-up');

  const features: FeatureCard[] = [
    // Gamification Features
    {
      id: 'level-up',
      title: 'Level-Up System',
      description: 'XP progression, levels, and achievement badges with visual rewards',
      category: 'gamification',
      icon: <Trophy className="w-5 h-5" />,
      component: <LevelUpSystem />,
      tags: ['XP', 'Levels', 'Badges', 'Progress'],
      inspiration: 'Duolingo'
    },
    {
      id: 'course-streaks',
      title: 'Course Streaks',
      description: 'Daily learning streaks with fire indicators and freeze protection',
      category: 'gamification',
      icon: <Zap className="w-5 h-5" />,
      component: <CourseStreaks />,
      tags: ['Streaks', 'Daily Goals', 'Motivation'],
      inspiration: 'Duolingo'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'Compete with other learners and track rankings',
      category: 'gamification',
      icon: <Trophy className="w-5 h-5" />,
      component: <Leaderboard />,
      tags: ['Competition', 'Rankings', 'Social'],
      inspiration: 'Duolingo'
    },
    {
      id: 'puzzle-quizzes',
      title: 'Puzzle Quizzes',
      description: 'Chain quiz system with unlock mechanics and progress gates',
      category: 'gamification',
      icon: <Brain className="w-5 h-5" />,
      component: <PuzzleQuizzes />,
      tags: ['Puzzles', 'Unlocks', 'Chain Learning'],
      inspiration: 'Duolingo'
    },
    {
      id: 'battle-mode',
      title: 'Battle Mode',
      description: 'Real-time multiplayer quiz battles with live scoring',
      category: 'gamification',
      icon: <Swords className="w-5 h-5" />,
      component: <BattleMode />,
      tags: ['Multiplayer', 'Real-time', 'Competition'],
      inspiration: 'Duolingo'
    },
    
    // Learning Modes
    {
      id: 'challenge-mode',
      title: 'Challenge Mode',
      description: 'Speed learning with timers and focus mode for distraction-free study',
      category: 'learning-modes',
      icon: <Zap className="w-5 h-5" />,
      component: <ChallengeMode />,
      tags: ['Speed', 'Focus', 'Intensity'],
      inspiration: 'Apple'
    },
    {
      id: 'relax-mode',
      title: 'Relax Mode',
      description: 'Mindful learning with note-taking and no time pressure',
      category: 'learning-modes',
      icon: <Leaf className="w-5 h-5" />,
      component: <RelaxMode />,
      tags: ['Mindful', 'Notes', 'Calm'],
      inspiration: 'Notion'
    },
    {
      id: 'binge-mode',
      title: 'Binge Mode',
      description: 'Netflix-style continuous learning with autoplay and episode tracking',
      category: 'learning-modes',
      icon: <Tv className="w-5 h-5" />,
      component: <BingeMode />,
      tags: ['Autoplay', 'Episodes', 'Continuous'],
      inspiration: 'Netflix'
    },
    {
      id: 'revision-mode',
      title: 'Revision Mode',
      description: 'Spaced repetition with flashcards and smart review reminders',
      category: 'learning-modes',
      icon: <RotateCcw className="w-5 h-5" />,
      component: <RevisionMode />,
      tags: ['Spaced Repetition', 'Flashcards', 'Memory'],
      inspiration: 'Anki'
    }
  ];

  const selectedFeatureData = features.find(f => f.id === selectedFeature) || features[0];
  const gamificationFeatures = features.filter(f => f.category === 'gamification');
  const learningModeFeatures = features.filter(f => f.category === 'learning-modes');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Gamification & Smart Learning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive features designed to motivate and enhance learning
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
              <Gamepad2 className="w-3 h-3 mr-1" />
              5 Gamification Features
            </Badge>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              <Brain className="w-3 h-3 mr-1" />
              4 Learning Modes
            </Badge>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              Fully Interactive Demos
            </Badge>
          </div>
        </div>

        {/* Feature Navigation */}
        <Card className="p-6">
          <Tabs value={selectedFeature} onValueChange={setSelectedFeature}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Gamification Features
              </h3>
              <TabsList className="grid grid-cols-5 gap-2 h-auto bg-transparent">
                {gamificationFeatures.map((feature) => (
                  <TabsTrigger
                    key={feature.id}
                    value={feature.id}
                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
                  >
                    {feature.icon}
                    <span className="text-xs font-medium">{feature.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Smart Learning Modes
              </h3>
              <TabsList className="grid grid-cols-4 gap-2 h-auto bg-transparent">
                {learningModeFeatures.map((feature) => (
                  <TabsTrigger
                    key={feature.id}
                    value={feature.id}
                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300"
                  >
                    {feature.icon}
                    <span className="text-xs font-medium">{feature.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Feature Info Bar */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">{selectedFeatureData.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedFeatureData.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {selectedFeatureData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                      Inspired by {selectedFeatureData.inspiration}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={selectedFeatureData.category === 'gamification' 
                      ? 'border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300' 
                      : 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300'
                    }
                  >
                    {selectedFeatureData.category === 'gamification' ? 'Gamification' : 'Learning Mode'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Feature Component */}
            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id} className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                  {feature.component}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Technical Implementation Note */}
        <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">🛠️ Implementation Details</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <strong>Frontend:</strong> React + TypeScript with Tailwind CSS animations and responsive design
              </p>
              <p>
                <strong>State Management:</strong> React useState() hooks with dummy data for demonstration
              </p>
              <p>
                <strong>Backend Integration:</strong> Components include TODO comments for API connections
              </p>
              <p>
                <strong>Design System:</strong> Modular components with consistent styling and smooth transitions
              </p>
            </div>
          </div>
        </Card>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              Gamification Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Increased engagement through XP and level progression</li>
              <li>• Social motivation via leaderboards and competitions</li>
              <li>• Habit formation through streak tracking</li>
              <li>• Achievement recognition with badges and rewards</li>
              <li>• Interactive learning through puzzle and battle modes</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Learning Mode Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Personalized learning pace and style preferences</li>
              <li>• Optimized retention through spaced repetition</li>
              <li>• Enhanced focus with distraction-free environments</li>
              <li>• Continuous learning through binge-watching patterns</li>
              <li>• Mindful learning with reflection and note-taking</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}