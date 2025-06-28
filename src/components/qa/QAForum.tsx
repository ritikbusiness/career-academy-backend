
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, MessageCircle, CheckCircle, ArrowUp, HelpCircle, Users, Clock } from 'lucide-react';
import { QAThread, Question } from '@/types/qa';
import QuestionThread from './QuestionThread';
import AskQuestion from './AskQuestion';

interface QAForumProps {
  lessonId: string;
  courseId: string;
  isInstructor?: boolean;
}

const QAForum: React.FC<QAForumProps> = ({ lessonId, courseId, isInstructor = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [selectedThread, setSelectedThread] = useState<QAThread | null>(null);

  // TODO: connect to backend - fetch Q&A data
  const [threads, setThreads] = useState<QAThread[]>([
    {
      question: {
        id: '1',
        lessonId,
        userId: 'user1',
        userType: 'student',
        userName: 'Alice Johnson',
        title: 'How to implement state management in React?',
        content: 'I\'m confused about when to use useState vs useReducer. Can someone explain with examples?',
        upvotes: 5,
        isResolved: true,
        acceptedAnswerId: 'answer1',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      answers: [
        {
          id: 'answer1',
          questionId: '1',
          userId: 'instructor1',
          userType: 'instructor',
          userName: 'John Smith',
          content: 'Great question! useState is perfect for simple state updates, while useReducer is better for complex state logic. Here\'s when to use each...',
          upvotes: 8,
          isAccepted: true,
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z'
        }
      ],
      totalAnswers: 1
    },
    {
      question: {
        id: '2',
        lessonId,
        userId: 'user2',
        userType: 'student',
        userName: 'Bob Wilson',
        title: 'Error with component lifecycle methods',
        content: 'I\'m getting an error when trying to update state in componentDidMount. What\'s the best practice here?',
        upvotes: 3,
        isResolved: false,
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      },
      answers: [
        {
          id: 'answer2',
          questionId: '2',
          userId: 'user3',
          userType: 'student',
          userName: 'Carol Davis',
          content: 'I had the same issue! Make sure you\'re not setting state after the component unmounts.',
          upvotes: 2,
          isAccepted: false,
          createdAt: '2024-01-16T10:30:00Z',
          updatedAt: '2024-01-16T10:30:00Z'
        }
      ],
      totalAnswers: 1
    }
  ]);

  const filteredThreads = threads.filter(thread =>
    thread.question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.question.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resolvedThreads = filteredThreads.filter(thread => thread.question.isResolved);
  const unresolvedThreads = filteredThreads.filter(thread => !thread.question.isResolved);

  const handleAskQuestion = (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: connect to backend - create new question
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newThread: QAThread = {
      question: newQuestion,
      answers: [],
      totalAnswers: 0
    };

    setThreads(prev => [newThread, ...prev]);
    setShowAskQuestion(false);
  };

  const handleUpvoteQuestion = (questionId: string) => {
    // TODO: connect to backend - upvote question
    setThreads(prev => prev.map(thread =>
      thread.question.id === questionId
        ? { ...thread, question: { ...thread.question, upvotes: thread.question.upvotes + 1 } }
        : thread
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedThread) {
    return (
      <QuestionThread
        thread={selectedThread}
        isInstructor={isInstructor}
        onBack={() => setSelectedThread(null)}
        onUpdate={(updatedThread) => {
          setThreads(prev => prev.map(t => 
            t.question.id === updatedThread.question.id ? updatedThread : t
          ));
          setSelectedThread(updatedThread);
        }}
      />
    );
  }

  if (showAskQuestion) {
    return (
      <AskQuestion
        lessonId={lessonId}
        onSubmit={handleAskQuestion}
        onCancel={() => setShowAskQuestion(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Q&A Forum</h1>
                  <p className="text-purple-100">Ask questions and help fellow students</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowAskQuestion(true)} 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
              />
            </div>
          </div>
        </Card>

        {/* Forum Content */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-8">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg font-medium">
                  All Questions ({filteredThreads.length})
                </TabsTrigger>
                <TabsTrigger value="unresolved" className="rounded-lg font-medium">
                  Unresolved ({unresolvedThreads.length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="rounded-lg font-medium">
                  Resolved ({resolvedThreads.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-16">
                    <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No questions found</h3>
                    <p className="text-slate-500 mb-6">Be the first to ask a question in this lesson</p>
                    <Button 
                      onClick={() => setShowAskQuestion(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ask First Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredThreads.map((thread) => (
                      <Card
                        key={thread.question.id}
                        className="border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedThread(thread)}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Vote Section */}
                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpvoteQuestion(thread.question.id);
                                }}
                                className="p-2 rounded-full hover:bg-slate-100 transition-colors group"
                              >
                                <ArrowUp className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                              </button>
                              <span className="text-lg font-bold text-slate-600">{thread.question.upvotes}</span>
                              <div className="text-xs text-slate-400 text-center">votes</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {thread.question.title}
                                </h3>
                                {thread.question.isResolved && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0 ml-3">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Resolved
                                  </Badge>
                                )}
                              </div>

                              <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                {thread.question.content}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {thread.question.userName.charAt(0)}
                                    </div>
                                    <span className="font-medium">{thread.question.userName}</span>
                                    {thread.question.userType === 'instructor' && (
                                      <Badge variant="outline" className="text-xs px-2 py-1">Instructor</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(thread.question.createdAt)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <MessageCircle className="w-4 h-4" />
                                  <span className="font-medium">{thread.totalAnswers}</span>
                                  <span>{thread.totalAnswers === 1 ? 'answer' : 'answers'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unresolved" className="space-y-4">
                {unresolvedThreads.length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">All questions resolved!</h3>
                    <p className="text-slate-500">Great work helping each other learn</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unresolvedThreads.map((thread) => (
                      <Card
                        key={thread.question.id}
                        className="border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedThread(thread)}
                      >
                        <CardContent className="p-6">
                          {/* Same content structure as above */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpvoteQuestion(thread.question.id);
                                }}
                                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                              >
                                <ArrowUp className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                              </button>
                              <span className="text-lg font-bold text-slate-600">{thread.question.upvotes}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-3">
                                {thread.question.title}
                              </h3>
                              <p className="text-slate-600 text-sm line-clamp-2 mb-4">{thread.question.content}</p>
                              <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>Asked by {thread.question.userName} • {formatDate(thread.question.createdAt)}</span>
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{thread.totalAnswers} answers</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {resolvedThreads.length === 0 ? (
                  <div className="text-center py-16">
                    <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No resolved questions yet</h3>
                    <p className="text-slate-500">Questions will appear here once they're answered and accepted</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resolvedThreads.map((thread) => (
                      <Card
                        key={thread.question.id}
                        className="border border-green-200 bg-green-50/30 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedThread(thread)}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpvoteQuestion(thread.question.id);
                                }}
                                className="p-2 rounded-full hover:bg-white/50 transition-colors"
                              >
                                <ArrowUp className="w-5 h-5 text-slate-400 hover:text-green-600" />
                              </button>
                              <span className="text-lg font-bold text-slate-600">{thread.question.upvotes}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                                  {thread.question.title}
                                </h3>
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Resolved
                                </Badge>
                              </div>
                              <p className="text-slate-600 text-sm line-clamp-2 mb-4">{thread.question.content}</p>
                              <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>Asked by {thread.question.userName} • {formatDate(thread.question.createdAt)}</span>
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{thread.totalAnswers} answers</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QAForum;
