
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowUp, CheckCircle, MessageCircle, Send, Clock, User } from 'lucide-react';
import { QAThread, Answer } from '@/types/qa';

interface QuestionThreadProps {
  thread: QAThread;
  isInstructor?: boolean;
  onBack: () => void;
  onUpdate: (updatedThread: QAThread) => void;
}

const QuestionThread: React.FC<QuestionThreadProps> = ({
  thread,
  isInstructor = false,
  onBack,
  onUpdate
}) => {
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);

    // TODO: connect to backend - submit answer
    const answer: Answer = {
      id: Date.now().toString(),
      questionId: thread.question.id,
      userId: 'current-user-id',
      userType: isInstructor ? 'instructor' : 'student',
      userName: isInstructor ? 'Instructor Name' : 'Student Name',
      content: newAnswer,
      upvotes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedThread = {
      ...thread,
      answers: [...thread.answers, answer],
      totalAnswers: thread.totalAnswers + 1
    };

    onUpdate(updatedThread);
    setNewAnswer('');
    setIsSubmitting(false);
  };

  const handleUpvoteAnswer = (answerId: string) => {
    // TODO: connect to backend - upvote answer
    const updatedAnswers = thread.answers.map(answer =>
      answer.id === answerId
        ? { ...answer, upvotes: answer.upvotes + 1 }
        : answer
    );

    onUpdate({
      ...thread,
      answers: updatedAnswers
    });
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!isInstructor) return;

    // TODO: connect to backend - accept answer
    const updatedAnswers = thread.answers.map(answer =>
      answer.id === answerId
        ? { ...answer, isAccepted: true }
        : { ...answer, isAccepted: false }
    );

    const updatedQuestion = {
      ...thread.question,
      isResolved: true,
      acceptedAnswerId: answerId
    };

    onUpdate({
      ...thread,
      question: updatedQuestion,
      answers: updatedAnswers
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedAnswers = [...thread.answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
        </div>

        {/* Question Card */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <button className="p-3 rounded-full hover:bg-slate-100 transition-colors group">
                  <ArrowUp className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                </button>
                <span className="text-2xl font-bold text-slate-600">{thread.question.upvotes}</span>
                <div className="text-xs text-slate-400 text-center">votes</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl font-bold text-slate-800 leading-relaxed">
                    {thread.question.title}
                  </h1>
                  {thread.question.isResolved && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0 ml-4">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>

                <p className="text-slate-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                  {thread.question.content}
                </p>

                <div className="flex items-center gap-6 text-sm text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {thread.question.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">{thread.question.userName}</span>
                      {thread.question.userType === 'instructor' && (
                        <Badge variant="outline" className="ml-2 text-xs px-2 py-1">Instructor</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>asked {formatDate(thread.question.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{thread.totalAnswers} {thread.totalAnswers === 1 ? 'answer' : 'answers'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">
              {thread.totalAnswers} {thread.totalAnswers === 1 ? 'Answer' : 'Answers'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {sortedAnswers.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No answers yet</h3>
                <p className="text-slate-500">Be the first to help answer this question!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`border rounded-xl p-6 transition-all duration-200 ${
                      answer.isAccepted 
                        ? 'border-green-200 bg-green-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleUpvoteAnswer(answer.id)}
                          className="p-2 rounded-full hover:bg-slate-100 transition-colors group"
                        >
                          <ArrowUp className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                        </button>
                        <span className="text-lg font-bold text-slate-600">{answer.upvotes}</span>
                        {answer.isAccepted && (
                          <div className="mt-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {answer.isAccepted && (
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-semibold text-sm">Accepted Answer</span>
                          </div>
                        )}
                        
                        <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
                          {answer.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {answer.userName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">{answer.userName}</span>
                              {answer.userType === 'instructor' && (
                                <Badge variant="outline" className="ml-2 text-xs px-2 py-1">Instructor</Badge>
                              )}
                            </div>
                            <span>•</span>
                            <span>{formatDate(answer.createdAt)}</span>
                          </div>

                          {isInstructor && !thread.question.isResolved && !answer.isAccepted && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptAnswer(answer.id)}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept Answer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Answer */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Share your knowledge and help others learn...

• Be clear and specific
• Provide examples when possible
• Reference official documentation
• Be respectful and constructive"
                rows={8}
                className="rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base leading-relaxed"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim() || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionThread;
