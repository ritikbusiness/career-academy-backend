import { useState } from 'react';
import { ArrowLeft, Star, Send, ThumbsUp, Award, Calendar, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

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
  isAccepted?: boolean;
}

interface QuestionThreadProps {
  question: Question;
  onBack: () => void;
}

const mockAnswers: Answer[] = [
  {
    id: '1',
    questionId: '1',
    content: 'Great question! Here are several strategies that have worked well for me:\n\n1. **Multi-stage builds**: Use Docker multi-stage builds to reduce final image size\n2. **Layer caching**: Order your Dockerfile commands from least to most frequently changing\n3. **BuildKit**: Enable Docker BuildKit for parallel builds and better caching\n4. **Registry cache**: Use a registry as a cache source\n\nExample Dockerfile optimization:\n```dockerfile\n# Install dependencies first (changes less frequently)\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Copy source code last\nCOPY . .\n```\n\nThis approach reduced our build times from 15 minutes to about 3 minutes!',
    authorId: 'user4',
    authorName: 'Alex Thompson',
    authorAvatar: '/api/placeholder/40/40',
    authorXP: 3450,
    xpLevel: 12,
    createdAt: '2025-01-15T11:15:00Z',
    xpRating: 9,
    starRating: 4.8,
    starCount: 15,
    isAccepted: true
  },
  {
    id: '2',
    questionId: '1',
    content: 'Adding to Alex\'s excellent answer, don\'t forget about:\n\n- **Parallel jobs**: Run tests and builds in parallel where possible\n- **Selective builds**: Only build what changed using tools like Nx or Lerna\n- **Build artifacts caching**: Cache node_modules, build outputs, etc.\n\nAlso consider using tools like `docker-compose` with build caching or GitHub Actions cache action.',
    authorId: 'user5',
    authorName: 'Lisa Park',
    authorAvatar: '/api/placeholder/40/40',
    authorXP: 2890,
    xpLevel: 10,
    createdAt: '2025-01-15T14:30:00Z',
    starRating: 4.2,
    starCount: 8
  }
];

export function QuestionThread({ question, onBack }: QuestionThreadProps) {
  const [newAnswer, setNewAnswer] = useState('');
  const [xpRating, setXpRating] = useState([0]);
  const [starRating, setStarRating] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [showXpRating, setShowXpRating] = useState<string | null>(null);
  const currentUserId = 'user1'; // Mock current user
  const isQuestionAuthor = currentUserId === question.authorId;

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;
    
    const answer: Answer = {
      id: Date.now().toString(),
      questionId: question.id,
      content: newAnswer,
      authorId: currentUserId,
      authorName: 'You',
      authorAvatar: '/api/placeholder/40/40',
      authorXP: 1250,
      xpLevel: 5,
      createdAt: new Date().toISOString(),
      starRating: 0,
      starCount: 0
    };
    
    setAnswers([...answers, answer]);
    setNewAnswer('');
    // TODO: Submit answer to backend
  };

  const handleXpRating = (answerId: string, rating: number) => {
    setAnswers(answers.map(answer => 
      answer.id === answerId ? { ...answer, xpRating: rating } : answer
    ));
    setShowXpRating(null);
    // TODO: Submit XP rating to backend (award XP to answerer)
  };

  const handleStarRating = (answerId: string, rating: number) => {
    setAnswers(answers.map(answer => 
      answer.id === answerId 
        ? { 
            ...answer, 
            starRating: ((answer.starRating * answer.starCount) + rating) / (answer.starCount + 1),
            starCount: answer.starCount + 1
          } 
        : answer
    ));
    // TODO: Submit star rating to backend (no XP awarded)
  };

  const getLevelInfo = (xp: number) => {
    const level = Math.floor(xp / 250) + 1;
    const progress = (xp % 250) / 250 * 100;
    return { level, progress };
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Questions
      </Button>

      {/* Question Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={question.authorAvatar} />
                <AvatarFallback>{question.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{question.authorName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{question.authorXP} XP</span>
                  <span>•</span>
                  <span>{getRelativeTime(question.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {question.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {answers.length}
              </div>
            </div>
          </div>
          
          <CardTitle className="text-xl mb-2">{question.title}</CardTitle>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {question.description}
          </p>
          
          {question.isResolved && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Award className="w-4 h-4" />
              Question Resolved
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h3>

        {answers.map((answer) => {
          const { level, progress } = getLevelInfo(answer.authorXP);
          
          return (
            <Card key={answer.id} className={`${answer.isAccepted ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
              <CardContent className="p-6">
                {answer.isAccepted && (
                  <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                    <Award className="w-4 h-4" />
                    Accepted Answer
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={answer.authorAvatar} />
                      <AvatarFallback>{answer.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{answer.authorName}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          Level {level}
                        </Badge>
                        <span className="text-gray-500">{answer.authorXP} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getRelativeTime(answer.createdAt)}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mb-4 text-gray-700 dark:text-gray-300">
                  <pre className="whitespace-pre-wrap font-sans">{answer.content}</pre>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* XP Rating (Only for question author) */}
                    {isQuestionAuthor && !answer.xpRating && (
                      <div className="flex items-center gap-2">
                        {showXpRating === answer.id ? (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-sm font-medium">Rate (0-10 XP):</span>
                            <Slider
                              value={xpRating}
                              onValueChange={setXpRating}
                              max={10}
                              step={1}
                              className="w-24"
                            />
                            <span className="text-sm font-bold text-blue-600">{xpRating[0]}</span>
                            <Button 
                              size="sm" 
                              onClick={() => handleXpRating(answer.id, xpRating[0])}
                            >
                              Award XP
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowXpRating(answer.id)}
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Rate Answer
                          </Button>
                        )}
                      </div>
                    )}

                    {/* XP Rating Display */}
                    {answer.xpRating && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">{answer.xpRating}/10 XP awarded</span>
                      </div>
                    )}

                    {/* Star Rating (For other users) */}
                    {!isQuestionAuthor && answer.authorId !== currentUserId && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleStarRating(answer.id, star)}
                              className="transition-colors"
                            >
                              <Star 
                                className={`w-4 h-4 ${
                                  star <= starRating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Rate this answer</span>
                      </div>
                    )}
                  </div>

                  {/* Social Star Rating Display */}
                  <div className="flex items-center gap-2">
                    {answer.starCount > 0 && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{answer.starRating.toFixed(1)} from {answer.starCount} students</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Answer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your knowledge and help fellow students..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}