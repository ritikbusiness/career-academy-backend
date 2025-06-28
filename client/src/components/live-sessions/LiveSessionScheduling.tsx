import { useState } from 'react';
import { Calendar, Clock, Video, Users, Plus, Edit3, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LiveSession {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number; // in minutes
  meetingLink?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  attendeeCount?: number;
  maxAttendees?: number;
  createdAt: string;
}

interface LiveSessionSchedulingProps {
  instructorId: string;
  courses: Array<{ id: string; title: string }>;
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getTimeUntilSession = (scheduledAt: string): string => {
  const now = new Date();
  const sessionTime = new Date(scheduledAt);
  const diffMs = sessionTime.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Session has started';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} days, ${diffHours} hours`;
  if (diffHours > 0) return `${diffHours} hours, ${diffMinutes} minutes`;
  return `${diffMinutes} minutes`;
};

const getStatusColor = (status: LiveSession['status']): string => {
  switch (status) {
    case 'scheduled': return 'bg-blue-500';
    case 'live': return 'bg-green-500 animate-pulse';
    case 'ended': return 'bg-gray-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const CountdownTimer = ({ scheduledAt }: { scheduledAt: string }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilSession(scheduledAt));

  // In a real implementation, you'd use useEffect with setInterval
  // For demo purposes, we'll just show static time
  
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Clock className="w-4 h-4" />
      <span>{timeLeft}</span>
    </div>
  );
};

const SessionCard = ({ 
  session, 
  onEdit, 
  onDelete, 
  onJoin, 
  onCopyLink 
}: {
  session: LiveSession;
  onEdit: (session: LiveSession) => void;
  onDelete: (sessionId: string) => void;
  onJoin: (session: LiveSession) => void;
  onCopyLink: (sessionId: string) => void;
}) => {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(session.status)}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{session.title}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {session.courseName}
            </p>
            <Badge variant={session.status === 'live' ? 'default' : 'secondary'} className="capitalize">
              {session.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(session)}
              className="p-1 h-8 w-8"
              disabled={session.status === 'ended'}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(session.id)}
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {session.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {session.description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDateTime(session.scheduledAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{session.duration} minutes</span>
          </div>

          {session.attendeeCount !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span>
                {session.attendeeCount} attendees
                {session.maxAttendees && ` / ${session.maxAttendees} max`}
              </span>
            </div>
          )}

          {session.status === 'scheduled' && (
            <CountdownTimer scheduledAt={session.scheduledAt} />
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {session.status === 'scheduled' || session.status === 'live' ? (
            <Button 
              onClick={() => onJoin(session)} 
              className="flex items-center gap-2"
              variant={session.status === 'live' ? 'default' : 'outline'}
            >
              <Video className="w-4 h-4" />
              {session.status === 'live' ? 'Join Live' : 'Start Session'}
            </Button>
          ) : null}
          
          {session.meetingLink && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCopyLink(session.id)}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SessionFormDialog = ({
  session,
  courses,
  onSubmit,
  isOpen,
  onClose
}: {
  session?: LiveSession;
  courses: Array<{ id: string; title: string }>;
  onSubmit: (sessionData: Omit<LiveSession, 'id' | 'status' | 'createdAt' | 'attendeeCount'>) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    courseId: session?.courseId || '',
    title: session?.title || '',
    description: session?.description || '',
    scheduledAt: session?.scheduledAt ? new Date(session.scheduledAt).toISOString().slice(0, 16) : '',
    duration: session?.duration?.toString() || '60',
    meetingLink: session?.meetingLink || '',
    maxAttendees: session?.maxAttendees?.toString() || ''
  });

  const handleSubmit = () => {
    if (!formData.courseId || !formData.title || !formData.scheduledAt) return;

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    
    onSubmit({
      courseId: formData.courseId,
      courseName: selectedCourse?.title || '',
      title: formData.title,
      description: formData.description || undefined,
      scheduledAt: new Date(formData.scheduledAt).toISOString(),
      duration: parseInt(formData.duration),
      meetingLink: formData.meetingLink || undefined,
      maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined
    });

    if (!session) {
      setFormData({
        courseId: '',
        title: '',
        description: '',
        scheduledAt: '',
        duration: '60',
        meetingLink: '',
        maxAttendees: ''
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Edit Live Session' : 'Schedule New Live Session'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Course</label>
            <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Session Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Q&A Session, Live Coding Workshop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What will you cover in this session?"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                min="15"
                max="240"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meeting Link (Optional)</label>
            <Input
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Attendees (Optional)</label>
            <Input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.courseId || !formData.title || !formData.scheduledAt}
            >
              {session ? 'Update Session' : 'Schedule Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function LiveSessionScheduling({ instructorId, courses }: LiveSessionSchedulingProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([
    // TODO: connect to backend - fetch instructor's sessions
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSession | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleCreateSession = (sessionData: Omit<LiveSession, 'id' | 'status' | 'createdAt' | 'attendeeCount'>) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setSessions([newSession, ...sessions]);

    // TODO: connect to backend - POST /api/live-sessions
    console.log('Creating session:', newSession);
  };

  const handleEditSession = (sessionData: Omit<LiveSession, 'id' | 'status' | 'createdAt' | 'attendeeCount'>) => {
    if (!editingSession) return;

    const updatedSession = {
      ...editingSession,
      ...sessionData
    };

    setSessions(sessions.map(s => s.id === editingSession.id ? updatedSession : s));
    setEditingSession(undefined);

    // TODO: connect to backend - PUT /api/live-sessions/{sessionId}
    console.log('Updating session:', updatedSession);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));

    // TODO: connect to backend - DELETE /api/live-sessions/{sessionId}
    console.log('Deleting session:', sessionId);
  };

  const handleJoinSession = (session: LiveSession) => {
    // TODO: connect to video platform or update session status
    console.log('Joining session:', session.id);
    
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  const handleCopyLink = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      // TODO: show toast notification
      console.log('Link copied to clipboard');
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus === 'all') return true;
    return session.status === filterStatus;
  });

  const upcomingSessions = filteredSessions.filter(s => s.status === 'scheduled');
  const liveSessions = filteredSessions.filter(s => s.status === 'live');
  const pastSessions = filteredSessions.filter(s => s.status === 'ended');

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage live learning sessions with your students
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Schedule Session
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-xl font-bold">{upcomingSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                <p className="text-xl font-bold">{liveSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold">{pastSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</p>
                <p className="text-xl font-bold">
                  {sessions.reduce((sum, s) => sum + (s.attendeeCount || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sessions</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live now</SelectItem>
            <SelectItem value="ended">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {filteredSessions.length} sessions
        </Badge>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filterStatus === 'all' ? 'No sessions scheduled' : `No ${filterStatus} sessions`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start engaging with your students through live interactive sessions.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Schedule Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={(session) => { setEditingSession(session); setShowForm(true); }}
              onDelete={handleDeleteSession}
              onJoin={handleJoinSession}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
      )}

      {/* Session Form Dialog */}
      <SessionFormDialog
        session={editingSession}
        courses={courses}
        onSubmit={editingSession ? handleEditSession : handleCreateSession}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingSession(undefined); }}
      />
    </div>
  );
}