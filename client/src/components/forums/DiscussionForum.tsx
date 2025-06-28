import { useState } from 'react';
import { MessageCircle, ArrowUp, ArrowDown, Pin, Edit2, Trash2, Reply, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'instructor';
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isPinned: boolean;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'instructor';
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  createdAt: string;
  updatedAt: string;
}

interface DiscussionForumProps {
  courseId: string;
  isInstructor?: boolean;
  currentUserId: string;
}

const ThreadCard = ({ 
  thread, 
  onVote, 
  onPin, 
  onEdit, 
  onDelete, 
  onClick,
  isInstructor,
  currentUserId 
}: {
  thread: ForumThread;
  onVote: (threadId: string, type: 'up' | 'down') => void;
  onPin: (threadId: string) => void;
  onEdit: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onClick: (threadId: string) => void;
  isInstructor?: boolean;
  currentUserId: string;
}) => {
  const canEdit = thread.authorId === currentUserId || isInstructor;
  const netVotes = thread.upvotes - thread.downvotes;

  return (
    <Card className={`mb-4 cursor-pointer hover:shadow-md transition-shadow ${thread.isPinned ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[40px]">
            <Button
              variant={thread.userVote === 'up' ? 'default' : 'ghost'}
              size="sm"
              onClick={(e) => { e.stopPropagation(); onVote(thread.id, 'up'); }}
              className="p-1 h-8 w-8"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <span className={`text-sm font-medium ${netVotes > 0 ? 'text-green-600' : netVotes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {netVotes}
            </span>
            <Button
              variant={thread.userVote === 'down' ? 'default' : 'ghost'}
              size="sm"
              onClick={(e) => { e.stopPropagation(); onVote(thread.id, 'down'); }}
              className="p-1 h-8 w-8"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1" onClick={() => onClick(thread.id)}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {thread.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                  {thread.title}
                </h3>
                {thread.authorRole === 'instructor' && (
                  <Badge variant="secondary" className="text-xs">Instructor</Badge>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {isInstructor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onPin(thread.id); }}
                    className="p-1 h-8 w-8"
                  >
                    <Pin className="w-3 h-3" />
                  </Button>
                )}
                {canEdit && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); onEdit(thread.id); }}
                      className="p-1 h-8 w-8"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); onDelete(thread.id); }}
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {thread.content}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={thread.authorAvatar} />
                    <AvatarFallback className="text-xs">{thread.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{thread.authorName}</span>
                </div>
                <span>•</span>
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{thread.replyCount} replies</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NewThreadDialog = ({ 
  courseId, 
  onSubmit, 
  isOpen, 
  onClose 
}: {
  courseId: string;
  onSubmit: (title: string, content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit(title, content);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question or topic..."
              className="min-h-[150px]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>
              Create Thread
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function DiscussionForum({ courseId, isInstructor = false, currentUserId }: DiscussionForumProps) {
  const [threads, setThreads] = useState<ForumThread[]>([
    // TODO: connect to backend - fetch threads from API
  ]);

  const [sortBy, setSortBy] = useState('recent');
  const [showNewThread, setShowNewThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const handleVote = (threadId: string, type: 'up' | 'down') => {
    setThreads(threads.map(thread => {
      if (thread.id !== threadId) return thread;

      const currentVote = thread.userVote;
      let newUpvotes = thread.upvotes;
      let newDownvotes = thread.downvotes;
      let newUserVote: 'up' | 'down' | undefined;

      // Remove previous vote if exists
      if (currentVote === 'up') newUpvotes--;
      if (currentVote === 'down') newDownvotes--;

      // Add new vote if different from current
      if (currentVote !== type) {
        if (type === 'up') {
          newUpvotes++;
          newUserVote = 'up';
        } else {
          newDownvotes++;
          newUserVote = 'down';
        }
      }

      return {
        ...thread,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote
      };
    }));

    // TODO: connect to backend - POST /api/threads/{threadId}/vote
    console.log('Voting on thread:', threadId, type);
  };

  const handlePin = (threadId: string) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? { ...thread, isPinned: !thread.isPinned }
        : thread
    ));

    // TODO: connect to backend - POST /api/threads/{threadId}/pin
    console.log('Toggling pin for thread:', threadId);
  };

  const handleEdit = (threadId: string) => {
    // TODO: implement edit functionality
    console.log('Editing thread:', threadId);
  };

  const handleDelete = (threadId: string) => {
    setThreads(threads.filter(thread => thread.id !== threadId));

    // TODO: connect to backend - DELETE /api/threads/{threadId}
    console.log('Deleting thread:', threadId);
  };

  const handleCreateThread = (title: string, content: string) => {
    const newThread: ForumThread = {
      id: Date.now().toString(),
      title,
      content,
      authorId: currentUserId,
      authorName: 'Current User',
      authorRole: isInstructor ? 'instructor' : 'student',
      upvotes: 0,
      downvotes: 0,
      isPinned: false,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setThreads([newThread, ...threads]);

    // TODO: connect to backend - POST /api/courses/{courseId}/threads
    console.log('Creating new thread:', newThread);
  };

  const sortedThreads = [...threads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'replies':
        return b.replyCount - a.replyCount;
      default:
        return 0;
    }
  });

  if (selectedThread) {
    // TODO: Implement thread view with replies
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="outline" onClick={() => setSelectedThread(null)} className="mb-4">
          ← Back to Forum
        </Button>
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Thread view will be implemented here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Discussion</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions, share insights, and connect with your peers
          </p>
        </div>
        <Button onClick={() => setShowNewThread(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Discussion
        </Button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="replies">Most replies</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {threads.length} discussions
        </Badge>
      </div>

      {/* Threads List */}
      <div>
        {sortedThreads.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No discussions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to start a discussion in this course!
              </p>
              <Button onClick={() => setShowNewThread(true)}>
                Start Discussion
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onVote={handleVote}
              onPin={handlePin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={setSelectedThread}
              isInstructor={isInstructor}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>

      {/* New Thread Dialog */}
      <NewThreadDialog
        courseId={courseId}
        onSubmit={handleCreateThread}
        isOpen={showNewThread}
        onClose={() => setShowNewThread(false)}
      />
    </div>
  );
}