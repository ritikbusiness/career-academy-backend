import { useState } from 'react';
import { Search, Filter, Plus, Trophy, Star, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CategorySections } from '../components/peer-help/CategorySections';
import { QuestionThread } from '../components/peer-help/QuestionThread';
import { AskQuestionForm } from '../components/peer-help/AskQuestionForm';
import { GamificationLeaderboard } from '../components/peer-help/GamificationLeaderboard';
import { RewardsPanel } from '../components/peer-help/RewardsPanel';

interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorXP: number;
  createdAt: string;
  answersCount: number;
  isResolved: boolean;
  views: number;
}

interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorXP: number;
  xpLevel: number;
  createdAt: string;
  xpRating?: number; // 0-10 from question author
  starRating: number; // average from other users
  starCount: number; // number of star ratings
}

const categories = [
  { id: 'devops', name: 'DevOps', icon: '🚀', color: 'bg-blue-500', count: 45 },
  { id: 'python', name: 'Python', icon: '🐍', color: 'bg-green-500', count: 78 },
  { id: 'frontend', name: 'Frontend', icon: '🎨', color: 'bg-purple-500', count: 92 },
  { id: 'backend', name: 'Backend', icon: '⚙️', color: 'bg-orange-500', count: 56 },
  { id: 'mobile', name: 'Mobile', icon: '📱', color: 'bg-pink-500', count: 34 },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖', color: 'bg-indigo-500', count: 67 },
];

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to optimize Docker build times in CI/CD pipeline?',
    description: 'I\'m working on a React app with a complex build process. Our CI/CD pipeline takes 15+ minutes to build Docker images. Looking for best practices to reduce build times.',
    category: 'devops',
    tags: ['docker', 'ci-cd', 'optimization'],
    authorId: 'user1',
    authorName: 'Sarah Chen',
    authorAvatar: '/api/placeholder/32/32',
    authorXP: 1250,
    createdAt: '2025-01-15T10:30:00Z',
    answersCount: 3,
    isResolved: true,
    views: 156
  },
  {
    id: '2',
    title: 'Best practices for handling async/await in Python?',
    description: 'I\'m new to async programming in Python and getting confused about when to use asyncio vs threading. Can someone explain with practical examples?',
    category: 'python',
    tags: ['async', 'asyncio', 'threading'],
    authorId: 'user2',
    authorName: 'Mike Rodriguez',
    authorAvatar: '/api/placeholder/32/32',
    authorXP: 890,
    createdAt: '2025-01-14T15:45:00Z',
    answersCount: 2,
    isResolved: false,
    views: 89
  },
  {
    id: '3',
    title: 'React state management: Context vs Redux vs Zustand?',
    description: 'Building a medium-sized app and trying to decide between different state management solutions. What are the pros/cons of each approach?',
    category: 'frontend',
    tags: ['react', 'state-management', 'redux', 'context'],
    authorId: 'user3',
    authorName: 'Emily Wang',
    authorAvatar: '/api/placeholder/32/32',
    authorXP: 2100,
    createdAt: '2025-01-13T09:20:00Z',
    answersCount: 5,
    isResolved: false,
    views: 234
  }
];

export default function PeerHelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('unanswered');
  const [showAskForm, setShowAskForm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    switch (activeTab) {
      case 'unanswered':
        return matchesCategory && matchesSearch && !question.isResolved;
      case 'most-helpful':
        return matchesCategory && matchesSearch && question.answersCount > 0;
      case 'newest':
        return matchesCategory && matchesSearch;
      default:
        return matchesCategory && matchesSearch;
    }
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Peer Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Ask questions, share knowledge, and earn XP by helping fellow students
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Dialog open={showAskForm} onOpenChange={setShowAskForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask a Question</DialogTitle>
                </DialogHeader>
                <AskQuestionForm onClose={() => setShowAskForm(false)} />
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              onClick={() => setShowLeaderboard(true)}
              className="hidden sm:flex"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowRewards(true)}
              className="hidden sm:flex"
            >
              🎁 Rewards
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <CategorySections
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {/* Mobile Action Buttons */}
            <div className="flex sm:hidden gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLeaderboard(true)}
                className="flex-1"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Leaderboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRewards(true)}
                className="flex-1"
              >
                🎁 Rewards
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedQuestion ? (
              <QuestionThread
                question={selectedQuestion}
                onBack={() => setSelectedQuestion(null)}
              />
            ) : (
              <>
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="unanswered" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Unanswered
                    </TabsTrigger>
                    <TabsTrigger value="most-helpful" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Helpful
                    </TabsTrigger>
                    <TabsTrigger value="newest" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Newest
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Questions List */}
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <Card 
                      key={question.id}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500"
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={question.authorAvatar} />
                              <AvatarFallback>{question.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{question.authorName}</p>
                              <p className="text-xs text-gray-500">{question.authorXP} XP</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>{getRelativeTime(question.createdAt)}</p>
                            <p>{question.views} views</p>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                          {question.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {question.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {question.answersCount}
                            </span>
                            {question.isResolved && (
                              <Badge className="bg-green-500 text-white">Resolved</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredQuestions.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No questions found</h3>
                      <p className="text-gray-500 mb-4">
                        Be the first to ask a question in this category!
                      </p>
                      <Button onClick={() => setShowAskForm(true)}>
                        Ask First Question
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              XP Leaderboard
            </DialogTitle>
          </DialogHeader>
          <GamificationLeaderboard />
        </DialogContent>
      </Dialog>

      <Dialog open={showRewards} onOpenChange={setShowRewards}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>🎁 Rewards & Achievements</DialogTitle>
          </DialogHeader>
          <RewardsPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
}