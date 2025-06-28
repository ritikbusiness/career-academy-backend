import { useState } from 'react';
import { FileText, Calendar, Users, CheckCircle, Clock, Download, Upload, Plus, Edit3, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  attachmentUrl?: string;
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  content?: string;
  attachmentUrl?: string;
  grade?: number;
  feedback?: string;
  status: 'not_submitted' | 'submitted' | 'graded';
  submittedAt?: string;
  gradedAt?: string;
}

interface AssignmentManagementProps {
  instructorId: string;
  courses: Array<{ id: string; title: string }>;
}

const getStatusColor = (status: Submission['status']): string => {
  switch (status) {
    case 'not_submitted': return 'bg-gray-500';
    case 'submitted': return 'bg-yellow-500';
    case 'graded': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

const AssignmentCard = ({ 
  assignment, 
  onEdit, 
  onDelete, 
  onViewSubmissions 
}: {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  onViewSubmissions: (assignment: Assignment) => void;
}) => {
  const submissionRate = assignment.totalStudents > 0 ? 
    Math.round((assignment.submissionCount / assignment.totalStudents) * 100) : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {assignment.courseName}
            </p>
            <Badge variant={new Date(assignment.dueDate) < new Date() ? 'destructive' : 'default'}>
              {formatDueDate(assignment.dueDate)}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(assignment)}
              className="p-1 h-8 w-8"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(assignment.id)}
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {assignment.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{assignment.submissionCount} / {assignment.totalStudents}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <span>{submissionRate}% submitted</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Max points: {assignment.maxPoints}
          </span>
          <Button
            onClick={() => onViewSubmissions(assignment)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Submissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SubmissionCard = ({ 
  submission, 
  assignment, 
  onGrade 
}: {
  submission: Submission;
  assignment: Assignment;
  onGrade: (submission: Submission) => void;
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={submission.studentAvatar} />
              <AvatarFallback>{submission.studentName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{submission.studentName}</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(submission.status)}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {submission.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {submission.grade !== undefined && (
              <div className="text-lg font-bold">
                {submission.grade} / {assignment.maxPoints}
              </div>
            )}
            {submission.submittedAt && (
              <div className="text-xs text-gray-500">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {submission.content && (
          <div className="mb-3">
            <h5 className="text-sm font-medium mb-1">Submission:</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {submission.content}
            </p>
          </div>
        )}

        {submission.attachmentUrl && (
          <div className="mb-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Attachment
            </Button>
          </div>
        )}

        {submission.feedback && (
          <div className="mb-3">
            <h5 className="text-sm font-medium mb-1">Feedback:</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-blue-50 dark:bg-blue-950 rounded">
              {submission.feedback}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {submission.status !== 'not_submitted' && (
            <Button onClick={() => onGrade(submission)} size="sm">
              {submission.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AssignmentFormDialog = ({
  assignment,
  courses,
  onSubmit,
  isOpen,
  onClose
}: {
  assignment?: Assignment;
  courses: Array<{ id: string; title: string }>;
  onSubmit: (assignmentData: Omit<Assignment, 'id' | 'submissionCount' | 'totalStudents' | 'createdAt'>) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    courseId: assignment?.courseId || '',
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
    maxPoints: assignment?.maxPoints?.toString() || '100',
    attachmentUrl: assignment?.attachmentUrl || ''
  });

  const handleSubmit = () => {
    if (!formData.courseId || !formData.title || !formData.dueDate) return;

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    
    onSubmit({
      courseId: formData.courseId,
      courseName: selectedCourse?.title || '',
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate).toISOString(),
      maxPoints: parseInt(formData.maxPoints),
      attachmentUrl: formData.attachmentUrl || undefined
    });

    if (!assignment) {
      setFormData({
        courseId: '',
        title: '',
        description: '',
        dueDate: '',
        maxPoints: '100',
        attachmentUrl: ''
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
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
            <label className="block text-sm font-medium mb-2">Assignment Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Final Project, Chapter 5 Quiz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the assignment requirements and expectations..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Points</label>
              <Input
                type="number"
                value={formData.maxPoints}
                onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value })}
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attachment URL (Optional)</label>
            <Input
              value={formData.attachmentUrl}
              onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
              placeholder="Link to assignment files or resources"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.courseId || !formData.title || !formData.dueDate}
            >
              {assignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GradeDialog = ({
  submission,
  assignment,
  onSubmit,
  isOpen,
  onClose
}: {
  submission: Submission;
  assignment: Assignment;
  onSubmit: (grade: number, feedback: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const handleSubmit = () => {
    onSubmit(parseInt(grade), feedback);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Student: {submission.studentName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assignment: {assignment.title}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Grade (out of {assignment.maxPoints})</label>
            <Input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min="0"
              max={assignment.maxPoints}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback to the student..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!grade}>
              Submit Grade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AssignmentManagement({ instructorId, courses }: AssignmentManagementProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    // TODO: connect to backend - fetch instructor's assignments
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    // TODO: connect to backend - fetch submissions for assignments
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'submissionCount' | 'totalStudents' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      submissionCount: 0,
      totalStudents: 25, // TODO: get actual student count
      createdAt: new Date().toISOString()
    };

    setAssignments([newAssignment, ...assignments]);

    // TODO: connect to backend - POST /api/assignments
    console.log('Creating assignment:', newAssignment);
  };

  const handleEditAssignment = (assignmentData: Omit<Assignment, 'id' | 'submissionCount' | 'totalStudents' | 'createdAt'>) => {
    if (!editingAssignment) return;

    const updatedAssignment = {
      ...editingAssignment,
      ...assignmentData
    };

    setAssignments(assignments.map(a => a.id === editingAssignment.id ? updatedAssignment : a));
    setEditingAssignment(undefined);

    // TODO: connect to backend - PUT /api/assignments/{assignmentId}
    console.log('Updating assignment:', updatedAssignment);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));

    // TODO: connect to backend - DELETE /api/assignments/{assignmentId}
    console.log('Deleting assignment:', assignmentId);
  };

  const handleGradeSubmission = (grade: number, feedback: string) => {
    if (!gradingSubmission) return;

    const updatedSubmission = {
      ...gradingSubmission,
      grade,
      feedback,
      status: 'graded' as const,
      gradedAt: new Date().toISOString()
    };

    setSubmissions(submissions.map(s => s.id === gradingSubmission.id ? updatedSubmission : s));

    // TODO: connect to backend - PUT /api/submissions/{submissionId}
    console.log('Grading submission:', updatedSubmission);
  };

  const assignmentSubmissions = selectedAssignment 
    ? submissions.filter(s => s.assignmentId === selectedAssignment.id)
    : [];

  if (selectedAssignment) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
            ← Back to Assignments
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedAssignment.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{selectedAssignment.courseName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submissions</p>
                  <p className="text-xl font-bold">
                    {assignmentSubmissions.filter(s => s.status !== 'not_submitted').length} / {selectedAssignment.totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
                  <p className="text-xl font-bold">
                    {assignmentSubmissions.filter(s => s.status === 'graded').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-xl font-bold">
                    {assignmentSubmissions.filter(s => s.status === 'submitted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {assignmentSubmissions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Students haven't started submitting their work for this assignment.
                </p>
              </CardContent>
            </Card>
          ) : (
            assignmentSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                assignment={selectedAssignment}
                onGrade={(submission) => {
                  setGradingSubmission(submission);
                  setShowGradeDialog(true);
                }}
              />
            ))
          )}
        </div>

        {showGradeDialog && gradingSubmission && (
          <GradeDialog
            submission={gradingSubmission}
            assignment={selectedAssignment}
            onSubmit={handleGradeSubmission}
            isOpen={showGradeDialog}
            onClose={() => setShowGradeDialog(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Assignment Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and grade student assignments
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</p>
                <p className="text-xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Grading</p>
                <p className="text-xl font-bold">
                  {submissions.filter(s => s.status === 'submitted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
                <p className="text-xl font-bold">
                  {submissions.filter(s => s.status === 'graded').length}
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Submissions</p>
                <p className="text-xl font-bold">
                  {assignments.length > 0 
                    ? Math.round(assignments.reduce((sum, a) => sum + a.submissionCount, 0) / assignments.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No assignments created
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start creating assignments to assess your students' learning progress.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Create Your First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={(assignment) => { setEditingAssignment(assignment); setShowForm(true); }}
              onDelete={handleDeleteAssignment}
              onViewSubmissions={setSelectedAssignment}
            />
          ))}
        </div>
      )}

      {/* Assignment Form Dialog */}
      <AssignmentFormDialog
        assignment={editingAssignment}
        courses={courses}
        onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingAssignment(undefined); }}
      />
    </div>
  );
}