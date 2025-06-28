
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowUp, CheckCircle, MessageCircle, Send } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </Button>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{thread.question.title}</CardTitle>
              {thread.question.isResolved && (
                <Badge className="bg-green-100 text-green-800 mb-3">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">{thread.question.upvotes}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{thread.question.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>
                Asked by {thread.question.userName}
                {thread.question.userType === 'instructor' && (
                  <Badge variant="outline" className="ml-2 text-xs">Instructor</Badge>
                )}
              </span>
              <span>•</span>
              <span>{formatDate(thread.question.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{thread.totalAnswers} answers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">
          Answers ({thread.totalAnswers})
        </h3>

        {sortedAnswers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No answers yet. Be the first to help!</p>
            </CardContent>
          </Card>
        ) : (
          sortedAnswers.map((answer) => (
            <Card
              key={answer.id}
              className={`${answer.isAccepted ? 'border-green-500 bg-green-50' : ''}`}
            >
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleUpvoteAnswer(answer.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">{answer.upvotes}</span>
                    {answer.isAccepted && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{answer.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>
                          Answered by {answer.userName}
                          {answer.userType === 'instructor' && (
                            <Badge variant="outline" className="ml-2 text-xs">Instructor</Badge>
                          )}
                        </span>
                        <span>•</span>
                        <span>{formatDate(answer.createdAt)}</span>
                      </div>

                      {isInstructor && !thread.question.isResolved && !answer.isAccepted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept Answer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Share your knowledge and help others learn..."
              rows={6}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Post Answer'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionThread;
