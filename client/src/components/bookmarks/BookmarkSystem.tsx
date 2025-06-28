import { useState } from 'react';
import { Bookmark, BookmarkCheck, Play, Clock, Search, Filter, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface BookmarkItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  timestamp?: string; // video timestamp like "12:34"
  title?: string;
  description?: string;
  createdAt: string;
}

interface BookmarkSystemProps {
  userId: string;
  currentLessonId?: string;
  currentVideoTime?: number; // in seconds
  isInSidebar?: boolean;
}

interface BookmarkToggleProps {
  lessonId: string;
  timestamp?: number;
  isBookmarked: boolean;
  onToggle: (lessonId: string, timestamp?: number) => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const parseTime = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

export const BookmarkToggle = ({ lessonId, timestamp, isBookmarked, onToggle }: BookmarkToggleProps) => {
  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={() => onToggle(lessonId, timestamp)}
      className={`flex items-center gap-2 transition-colors ${
        isBookmarked 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
          : 'hover:bg-yellow-50 dark:hover:bg-yellow-950'
      }`}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
};

const BookmarkCard = ({ 
  bookmark, 
  onDelete, 
  onPlay,
  showCourse = true 
}: {
  bookmark: BookmarkItem;
  onDelete: (bookmarkId: string) => void;
  onPlay: (lessonId: string, timestamp?: string) => void;
  showCourse?: boolean;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
              {bookmark.title || bookmark.lessonTitle}
            </h3>
            {showCourse && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {bookmark.courseTitle}
              </p>
            )}
            {bookmark.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                {bookmark.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(bookmark.id)}
            className="p-1 h-6 w-6 text-red-600 hover:text-red-700 ml-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {bookmark.timestamp && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{bookmark.timestamp}</span>
              </div>
            )}
            <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
          </div>
          <Button
            size="sm"
            onClick={() => onPlay(bookmark.lessonId, bookmark.timestamp)}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {bookmark.timestamp ? 'Play from here' : 'Open lesson'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddBookmarkDialog = ({
  lessonId,
  lessonTitle,
  courseTitle,
  timestamp,
  onSubmit,
  isOpen,
  onClose
}: {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  timestamp?: string;
  onSubmit: (title: string, description: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(title || lessonTitle, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lesson</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {courseTitle} - {lessonTitle}
              {timestamp && ` at ${timestamp}`}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title (Optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lessonTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about why you bookmarked this..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Bookmark
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function BookmarkSystem({ 
  userId, 
  currentLessonId, 
  currentVideoTime, 
  isInSidebar = false 
}: BookmarkSystemProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    // TODO: connect to backend - fetch user's bookmarks
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const isCurrentLessonBookmarked = (timestamp?: number) => {
    if (!currentLessonId) return false;
    
    return bookmarks.some(bookmark => 
      bookmark.lessonId === currentLessonId && 
      (timestamp === undefined || bookmark.timestamp === formatTime(timestamp))
    );
  };

  const handleToggleBookmark = (lessonId: string, timestamp?: number) => {
    const timestampStr = timestamp !== undefined ? formatTime(timestamp) : undefined;
    const existingBookmark = bookmarks.find(b => 
      b.lessonId === lessonId && b.timestamp === timestampStr
    );

    if (existingBookmark) {
      // Remove bookmark
      setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
      
      // TODO: connect to backend - DELETE /api/bookmarks/{bookmarkId}
      console.log('Removing bookmark:', existingBookmark.id);
    } else {
      // Show add dialog for current lesson
      if (lessonId === currentLessonId) {
        setShowAddDialog(true);
      } else {
        // Quick add for other lessons
        const newBookmark: BookmarkItem = {
          id: Date.now().toString(),
          lessonId,
          lessonTitle: 'Lesson Title', // TODO: get from props or context
          courseTitle: 'Course Title', // TODO: get from props or context
          timestamp: timestampStr,
          createdAt: new Date().toISOString()
        };
        
        setBookmarks([newBookmark, ...bookmarks]);
        
        // TODO: connect to backend - POST /api/bookmarks
        console.log('Adding bookmark:', newBookmark);
      }
    }
  };

  const handleAddBookmark = (title: string, description: string) => {
    if (!currentLessonId) return;

    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      lessonId: currentLessonId,
      lessonTitle: 'Current Lesson', // TODO: get from props or context
      courseTitle: 'Current Course', // TODO: get from props or context
      timestamp: currentVideoTime !== undefined ? formatTime(currentVideoTime) : undefined,
      title: title || undefined,
      description: description || undefined,
      createdAt: new Date().toISOString()
    };

    setBookmarks([newBookmark, ...bookmarks]);

    // TODO: connect to backend - POST /api/bookmarks
    console.log('Adding bookmark:', newBookmark);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    
    // TODO: connect to backend - DELETE /api/bookmarks/{bookmarkId}
    console.log('Deleting bookmark:', bookmarkId);
  };

  const handlePlayBookmark = (lessonId: string, timestamp?: string) => {
    // TODO: connect to navigation and video player
    console.log('Playing bookmark:', { lessonId, timestamp });
  };

  const filteredAndSortedBookmarks = bookmarks
    .filter(bookmark => {
      const matchesSearch = 
        bookmark.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'timestamped' && bookmark.timestamp) ||
        (filterBy === 'lessons' && !bookmark.timestamp) ||
        (filterBy === 'current' && bookmark.lessonId === currentLessonId);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'course':
          return a.courseTitle.localeCompare(b.courseTitle);
        case 'lesson':
          return a.lessonTitle.localeCompare(b.lessonTitle);
        default:
          return 0;
      }
    });

  if (isInSidebar) {
    return (
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Bookmarks
            </h3>
            {currentLessonId && (
              <BookmarkToggle
                lessonId={currentLessonId}
                timestamp={currentVideoTime}
                isBookmarked={isCurrentLessonBookmarked(currentVideoTime)}
                onToggle={handleToggleBookmark}
              />
            )}
          </div>
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAndSortedBookmarks.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
              </p>
              {!searchQuery && currentLessonId && (
                <BookmarkToggle
                  lessonId={currentLessonId}
                  isBookmarked={false}
                  onToggle={handleToggleBookmark}
                />
              )}
            </div>
          ) : (
            filteredAndSortedBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="mb-3">
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                  onPlay={handlePlayBookmark}
                  showCourse={false}
                />
              </div>
            ))
          )}
        </div>

        {/* Add Bookmark Dialog */}
        {showAddDialog && currentLessonId && (
          <AddBookmarkDialog
            lessonId={currentLessonId}
            lessonTitle="Current Lesson"
            courseTitle="Current Course"
            timestamp={currentVideoTime !== undefined ? formatTime(currentVideoTime) : undefined}
            onSubmit={handleAddBookmark}
            isOpen={showAddDialog}
            onClose={() => setShowAddDialog(false)}
          />
        )}
      </div>
    );
  }

  // Full page view
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Bookmarks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Save important moments and lessons for quick access
          </p>
        </div>
        {currentLessonId && (
          <BookmarkToggle
            lessonId={currentLessonId}
            timestamp={currentVideoTime}
            isBookmarked={isCurrentLessonBookmarked(currentVideoTime)}
            onToggle={handleToggleBookmark}
          />
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="pl-10"
          />
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All bookmarks</SelectItem>
            <SelectItem value="timestamped">With timestamps</SelectItem>
            <SelectItem value="lessons">Full lessons</SelectItem>
            {currentLessonId && <SelectItem value="current">Current lesson</SelectItem>}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="course">By course</SelectItem>
            <SelectItem value="lesson">By lesson</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {filteredAndSortedBookmarks.length} bookmarks
        </Badge>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedBookmarks.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardContent className="p-12 text-center">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms or filters.'
                    : 'Start bookmarking important lessons and moments to access them quickly later.'
                  }
                </p>
                {!searchQuery && currentLessonId && (
                  <BookmarkToggle
                    lessonId={currentLessonId}
                    isBookmarked={false}
                    onToggle={handleToggleBookmark}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredAndSortedBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDeleteBookmark}
              onPlay={handlePlayBookmark}
            />
          ))
        )}
      </div>

      {/* Add Bookmark Dialog */}
      {showAddDialog && currentLessonId && (
        <AddBookmarkDialog
          lessonId={currentLessonId}
          lessonTitle="Current Lesson"
          courseTitle="Current Course"
          timestamp={currentVideoTime !== undefined ? formatTime(currentVideoTime) : undefined}
          onSubmit={handleAddBookmark}
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}