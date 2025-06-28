
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, MessageCircle, CheckCircle, ArrowUp } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Q&A Forum
            </CardTitle>
            <Button onClick={() => setShowAskQuestion(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ask Question
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({threads.length})</TabsTrigger>
              <TabsTrigger value="unresolved">Unresolved ({unresolvedThreads.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedThreads.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredThreads.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No questions found</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <Card
                    key={thread.question.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedThread(thread)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpvoteQuestion(thread.question.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium">{thread.question.upvotes}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{thread.question.title}</h3>
                            {thread.question.isResolved && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolved
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {thread.question.content}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span>
                                Asked by {thread.question.userName}
                                {thread.question.userType === 'instructor' && (
                                  <Badge variant="outline" className="ml-2 text-xs">Instructor</Badge>
                                )}
                              </span>
                              <span>{formatDate(thread.question.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              <span>{thread.totalAnswers} answers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="unresolved" className="space-y-4">
              {unresolvedThreads.map((thread) => (
                <Card
                  key={thread.question.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedThread(thread)}
                >
                  <CardContent className="pt-4">
                    {/* Same content structure as above */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvoteQuestion(thread.question.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">{thread.question.upvotes}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{thread.question.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {thread.question.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
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
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {resolvedThreads.map((thread) => (
                <Card
                  key={thread.question.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedThread(thread)}
                >
                  <CardContent className="pt-4">
                    {/* Same content structure as above */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvoteQuestion(thread.question.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">{thread.question.upvotes}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{thread.question.title}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {thread.question.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QAForum;
