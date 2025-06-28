import { useState, useRef, useEffect } from 'react';
import { Save, Edit3, Trash2, StickyNote, Clock, Search, Filter, Bold, Italic, Underline, List, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Note {
  id: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  timestamp?: string; // video timestamp like "12:34"
  createdAt: string;
  updatedAt: string;
}

interface NoteTakingProps {
  lessonId: string;
  lessonTitle: string;
  currentVideoTime?: number; // in seconds
  isInSidebar?: boolean;
}

interface NoteEditorProps {
  note: Note;
  onSave: (content: string) => void;
  onCancel: () => void;
  currentVideoTime?: number;
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

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder 
}: {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="p-1 h-8 w-8"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="p-1 h-8 w-8"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className="p-1 h-8 w-8"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          className="p-1 h-8 w-8"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h3')}
          className="p-1 h-8 w-8"
        >
          <Type className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[120px] p-3 focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        style={{ 
          whiteSpace: 'pre-wrap',
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

const NoteEditor = ({ note, onSave, onCancel, currentVideoTime }: NoteEditorProps) => {
  const [content, setContent] = useState(note.content);
  const [timestamp, setTimestamp] = useState(note.timestamp || '');

  const handleSave = () => {
    onSave(content);
  };

  const addCurrentTimestamp = () => {
    if (currentVideoTime !== undefined) {
      setTimestamp(formatTime(currentVideoTime));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Note Content</label>
          {currentVideoTime !== undefined && (
            <Button
              variant="outline"
              size="sm"
              onClick={addCurrentTimestamp}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Add Timestamp ({formatTime(currentVideoTime)})
            </Button>
          )}
        </div>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Take your notes here... Use the toolbar to format text."
        />
      </div>

      {timestamp && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Input
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="mm:ss"
            className="w-20"
          />
          <span className="text-sm text-gray-500">Video timestamp</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!content.trim()}>
          Save Note
        </Button>
      </div>
    </div>
  );
};

const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete, 
  onTimestampClick 
}: {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTimestampClick?: (timestamp: string) => void;
}) => {
  const stripHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {note.timestamp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTimestampClick?.(note.timestamp!)}
                className="h-6 px-2 text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                {note.timestamp}
              </Button>
            )}
            <span className="text-xs text-gray-500">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="p-1 h-6 w-6"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        
        {stripHtml(note.content).length > 200 && (
          <div className="mt-2">
            <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
              Show more
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function NoteTaking({ 
  lessonId, 
  lessonTitle, 
  currentVideoTime, 
  isInSidebar = false 
}: NoteTakingProps) {
  const [notes, setNotes] = useState<Note[]>([
    // TODO: connect to backend - fetch notes for this lesson
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      lessonId,
      lessonTitle,
      content: '',
      timestamp: currentVideoTime ? formatTime(currentVideoTime) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingNote(newNote);
    setShowEditor(true);
  };

  const handleSaveNote = (content: string) => {
    if (!editingNote) return;

    const isNewNote = !notes.find(n => n.id === editingNote.id);
    const updatedNote = {
      ...editingNote,
      content,
      updatedAt: new Date().toISOString()
    };

    if (isNewNote) {
      setNotes([updatedNote, ...notes]);
    } else {
      setNotes(notes.map(n => n.id === editingNote.id ? updatedNote : n));
    }

    setEditingNote(null);
    setShowEditor(false);

    // TODO: connect to backend - POST/PUT /api/lessons/{lessonId}/notes
    console.log('Saving note:', updatedNote);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    
    // TODO: connect to backend - DELETE /api/notes/{noteId}
    console.log('Deleting note:', noteId);
  };

  const handleTimestampClick = (timestamp: string) => {
    const seconds = parseTime(timestamp);
    // TODO: connect to video player - seek to timestamp
    console.log('Seeking to timestamp:', seconds);
  };

  const filteredAndSortedNotes = notes
    .filter(note => 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.timestamp?.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'timestamp':
          if (!a.timestamp && !b.timestamp) return 0;
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return parseTime(a.timestamp) - parseTime(b.timestamp);
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
              <StickyNote className="w-4 h-4" />
              Notes
            </h3>
            <Button size="sm" onClick={createNewNote}>
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAndSortedNotes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
              {!searchQuery && (
                <Button size="sm" onClick={createNewNote}>
                  Add First Note
                </Button>
              )}
            </div>
          ) : (
            filteredAndSortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onTimestampClick={handleTimestampClick}
              />
            ))
          )}
        </div>

        {/* Editor Dialog */}
        {showEditor && editingNote && (
          <Dialog open={showEditor} onOpenChange={() => setShowEditor(false)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {notes.find(n => n.id === editingNote.id) ? 'Edit Note' : 'New Note'}
                </DialogTitle>
              </DialogHeader>
              <NoteEditor
                note={editingNote}
                onSave={handleSaveNote}
                onCancel={() => setShowEditor(false)}
                currentVideoTime={currentVideoTime}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Full page view
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lesson Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">{lessonTitle}</p>
        </div>
        <Button onClick={createNewNote} className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes and timestamps..."
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="timestamp">By timestamp</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {filteredAndSortedNotes.length} notes
        </Badge>
      </div>

      {/* Notes Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredAndSortedNotes.length === 0 ? (
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-12 text-center">
                <StickyNote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms.'
                    : 'Start taking notes to remember key concepts and insights from this lesson.'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={createNewNote}>
                    Take Your First Note
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onTimestampClick={handleTimestampClick}
            />
          ))
        )}
      </div>

      {/* Editor Dialog */}
      {showEditor && editingNote && (
        <Dialog open={showEditor} onOpenChange={() => setShowEditor(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {notes.find(n => n.id === editingNote.id) ? 'Edit Note' : 'New Note'}
              </DialogTitle>
            </DialogHeader>
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onCancel={() => setShowEditor(false)}
              currentVideoTime={currentVideoTime}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}