import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, CheckCircle, XCircle, Clock, AlertCircle,
  DollarSign, Calendar, User, MessageSquare 
} from 'lucide-react';

interface RefundRequest {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  adminNotes?: string;
}

interface RefundManagementProps {
  userRole: 'student' | 'admin';
  userId: string;
  enrolledCourses?: Array<{ id: string; title: string; price: number; enrolledAt: string }>;
}

export default function RefundManagement({ userRole, userId, enrolledCourses = [] }: RefundManagementProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundDescription, setRefundDescription] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<RefundRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Mock data
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: '1',
      courseId: 'course1',
      courseName: 'React Advanced Patterns',
      studentId: 'student1',
      studentName: 'John Doe',
      studentEmail: 'student1@example.com',
      amount: 99,
      reason: 'course_quality',
      description: 'The course content did not match the description provided.',
      status: 'pending',
      requestDate: '2025-01-15',
    },
    {
      id: '2',
      courseId: 'course2',
      courseName: 'Node.js Backend Development',
      studentId: 'student2',
      studentName: 'Jane Smith',
      studentEmail: 'jane@example.com',
      amount: 149,
      reason: 'technical_issues',
      description: 'Unable to access video content due to repeated technical problems.',
      status: 'approved',
      requestDate: '2025-01-10',
      processedDate: '2025-01-12',
      processedBy: 'admin1',
      adminNotes: 'Valid technical issue confirmed. Refund processed.'
    },
    {
      id: '3',
      courseId: 'course3',
      courseName: 'JavaScript Fundamentals',
      studentId: 'student3',
      studentName: 'Bob Wilson',
      studentEmail: 'bob@example.com',
      amount: 79,
      reason: 'accidental_purchase',
      description: 'Purchased by mistake, already enrolled in similar course.',
      status: 'rejected',
      requestDate: '2025-01-08',
      processedDate: '2025-01-09',
      processedBy: 'admin1',
      adminNotes: 'Request made after 30-day refund window expired.'
    }
  ]);

  const refundReasons = [
    { value: 'course_quality', label: 'Course quality not as expected' },
    { value: 'technical_issues', label: 'Technical issues preventing access' },
    { value: 'accidental_purchase', label: 'Accidental purchase' },
    { value: 'instructor_unavailable', label: 'Instructor not responsive' },
    { value: 'schedule_conflict', label: 'Schedule conflicts' },
    { value: 'other', label: 'Other reason' }
  ];

  const handleSubmitRefundRequest = () => {
    const selectedCourseData = enrolledCourses.find(c => c.id === selectedCourse);
    if (!selectedCourseData) return;

    const newRequest: RefundRequest = {
      id: Date.now().toString(),
      courseId: selectedCourse,
      courseName: selectedCourseData.title,
      studentId: userId,
      studentName: 'Current User', // TODO: get from user context
      studentEmail: 'user@example.com', // TODO: get from user context
      amount: selectedCourseData.price,
      reason: refundReason,
      description: refundDescription,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    // TODO: connect to backend - submit refund request
    setRefundRequests(prev => [newRequest, ...prev]);
    setShowRequestModal(false);
    resetRequestForm();
  };

  const handleProcessRefund = (requestId: string, status: 'approved' | 'rejected') => {
    const updatedRequest = {
      ...processingRequest!,
      status,
      processedDate: new Date().toISOString().split('T')[0],
      processedBy: userId,
      adminNotes
    };

    // TODO: connect to backend - process refund request
    setRefundRequests(prev => prev.map(r => 
      r.id === requestId ? updatedRequest : r
    ));

    setShowProcessModal(false);
    setProcessingRequest(null);
    setAdminNotes('');
  };

  const resetRequestForm = () => {
    setSelectedCourse('');
    setRefundReason('');
    setRefundDescription('');
  };

  const openProcessModal = (request: RefundRequest) => {
    setProcessingRequest(request);
    setAdminNotes(request.adminNotes || '');
    setShowProcessModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const userRequests = userRole === 'student' 
    ? refundRequests.filter(r => r.studentId === userId)
    : refundRequests;

  const pendingCount = refundRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userRole === 'admin' ? 'Refund Management' : 'My Refund Requests'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'admin' 
              ? `Manage student refund requests (${pendingCount} pending)`
              : 'Request refunds for purchased courses'
            }
          </p>
        </div>

        {userRole === 'student' && (
          <Button onClick={() => setShowRequestModal(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Request Refund
          </Button>
        )}
      </div>

      {/* Admin Statistics */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {refundRequests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {refundRequests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {refundRequests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${refundRequests
                  .filter(r => r.status === 'approved')
                  .reduce((sum, r) => sum + r.amount, 0)
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Refunded</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refund Requests List */}
      <div className="space-y-4">
        {userRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No refund requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userRole === 'student' 
                  ? "You haven't requested any refunds yet."
                  : "No refund requests to review."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          userRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {request.courseName}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                        <span className="font-medium">${request.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                        <span>{request.requestDate}</span>
                      </div>
                      {userRole === 'admin' && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">Student:</span>
                          <span>{request.studentName}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reason: 
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {refundReasons.find(r => r.value === request.reason)?.label || request.reason}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description:
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {request.description}
                      </p>
                    </div>

                    {request.processedDate && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Processed on {request.processedDate}
                          </span>
                          {request.adminNotes && (
                            <div className="mt-2">
                              <span className="text-gray-600 dark:text-gray-400">Admin Notes:</span>
                              <p className="text-gray-700 dark:text-gray-300 mt-1">
                                {request.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {userRole === 'admin' && request.status === 'pending' && (
                    <Button
                      variant="outline"
                      onClick={() => openProcessModal(request)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Process
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Student Refund Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Course Refund</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="course">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {enrolledCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} - ${course.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Refund Reason</Label>
              <Select value={refundReason} onValueChange={setRefundReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {refundReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about your refund request..."
                value={refundDescription}
                onChange={(e) => setRefundDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Refund requests are typically processed within 3-5 business days.
            </div>

            <Button 
              onClick={handleSubmitRefundRequest}
              className="w-full"
              disabled={!selectedCourse || !refundReason || !refundDescription}
            >
              Submit Refund Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Process Refund Modal */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund Request</DialogTitle>
          </DialogHeader>

          {processingRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium">{processingRequest.courseName}</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Student: {processingRequest.studentName}</div>
                  <div>Amount: ${processingRequest.amount}</div>
                  <div>Reason: {refundReasons.find(r => r.value === processingRequest.reason)?.label}</div>
                </div>
              </div>

              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add notes about your decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleProcessRefund(processingRequest.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleProcessRefund(processingRequest.id, 'rejected')}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}