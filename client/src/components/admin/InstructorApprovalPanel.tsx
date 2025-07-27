import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, XCircle, Clock, User, GraduationCap, ExternalLink, 
  Mail, Calendar, Award, RefreshCw, Eye, ThumbsUp, ThumbsDown 
} from 'lucide-react';

interface Instructor {
  id: number;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  expertiseAreas?: string[];
  qualifications?: string[];
  teachingExperience?: number;
  linkedinProfile?: string;
  personalWebsite?: string;
  credentialsUrl?: string;
  instructorStatus: 'pending' | 'approved' | 'rejected';
  verificationDate?: string;
  createdAt: string;
}

const InstructorApprovalPanel = () => {
  const [pendingInstructors, setPendingInstructors] = useState<Instructor[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const { toast } = useToast();

  const fetchPendingInstructors = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/instructors/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending instructors');
      }

      const result = await response.json();
      setPendingInstructors(result.data.instructors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending instructors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllInstructors = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/instructors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch instructors');
      }

      const result = await response.json();
      setAllInstructors(result.data.instructors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load instructors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingInstructors();
    } else {
      fetchAllInstructors();
    }
  }, [activeTab]);

  const approveInstructor = async (instructorId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/instructors/${instructorId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve instructor');
      }

      toast({
        title: "Instructor Approved",
        description: "The instructor has been approved and can now access instructor features.",
      });

      // Refresh the data
      if (activeTab === 'pending') {
        fetchPendingInstructors();
      } else {
        fetchAllInstructors();
      }
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve the instructor.",
        variant: "destructive",
      });
    }
  };

  const rejectInstructor = async (instructorId: number, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/instructors/${instructorId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject instructor');
      }

      toast({
        title: "Instructor Rejected",
        description: "The instructor application has been rejected.",
      });

      // Refresh the data
      if (activeTab === 'pending') {
        fetchPendingInstructors();
      } else {
        fetchAllInstructors();
      }
      
      setShowRejectionDialog(false);
      setRejectionReason('');
      setSelectedInstructor(null);
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject the instructor.",
        variant: "destructive",
      });
    }
  };

  const resetInstructorStatus = async (instructorId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/instructors/${instructorId}/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset instructor status');
      }

      toast({
        title: "Status Reset",
        description: "The instructor status has been reset to pending.",
      });

      // Refresh the data
      fetchAllInstructors();
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset instructor status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, verificationDate?: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InstructorDetailsDialog = ({ instructor }: { instructor: Instructor }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid={`button-view-${instructor.id}`}>
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {instructor.fullName}
          </DialogTitle>
          <DialogDescription>
            Instructor Application Details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Username</Label>
              <p className="text-sm">{instructor.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <p className="text-sm">{instructor.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="mt-1">{getStatusBadge(instructor.instructorStatus, instructor.verificationDate)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Applied</Label>
              <p className="text-sm">{formatDate(instructor.createdAt)}</p>
            </div>
          </div>

          {/* Bio */}
          {instructor.bio && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Professional Bio</Label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{instructor.bio}</p>
            </div>
          )}

          {/* Expertise Areas */}
          {instructor.expertiseAreas && instructor.expertiseAreas.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Expertise Areas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {instructor.expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">{area}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Qualifications */}
          {instructor.qualifications && instructor.qualifications.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Qualifications</Label>
              <ul className="text-sm mt-1 space-y-1">
                {instructor.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start">
                    <Award className="w-3 h-3 mr-2 mt-0.5 text-blue-600" />
                    {qual}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Teaching Experience */}
          {instructor.teachingExperience && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Teaching Experience</Label>
              <p className="text-sm mt-1">{instructor.teachingExperience} years</p>
            </div>
          )}

          {/* Links */}
          <div className="grid grid-cols-1 gap-3">
            {instructor.linkedinProfile && (
              <div>
                <Label className="text-sm font-medium text-gray-600">LinkedIn Profile</Label>
                <a
                  href={instructor.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {instructor.linkedinProfile}
                </a>
              </div>
            )}
            
            {instructor.personalWebsite && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Personal Website</Label>
                <a
                  href={instructor.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {instructor.personalWebsite}
                </a>
              </div>
            )}
            
            {instructor.credentialsUrl && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Credentials/Portfolio</Label>
                <a
                  href={instructor.credentialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Credentials
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Instructor Management</h2>
          <p className="text-gray-600">Review and approve instructor applications</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
            data-testid="button-pending-tab"
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending ({pendingInstructors.length})
          </Button>
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            data-testid="button-all-tab"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            All Instructors
          </Button>
        </div>
      </div>

      {/* Instructors Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'pending' ? 'Pending Approvals' : 'All Instructors'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'pending' 
              ? 'Review instructor applications and approve or reject them'
              : 'Manage all instructors in the system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading instructors...</p>
            </div>
          ) : (activeTab === 'pending' ? pendingInstructors : allInstructors).length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === 'pending' ? 'No pending instructor applications.' : 'No instructors found.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activeTab === 'pending' ? pendingInstructors : allInstructors).map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{instructor.fullName}</p>
                        <p className="text-sm text-gray-500">@{instructor.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${instructor.email}`} className="text-blue-600 hover:underline">
                        {instructor.email}
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(instructor.instructorStatus, instructor.verificationDate)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(instructor.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {instructor.teachingExperience ? `${instructor.teachingExperience} years` : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <InstructorDetailsDialog instructor={instructor} />
                        
                        {instructor.instructorStatus === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveInstructor(instructor.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              data-testid={`button-approve-${instructor.id}`}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedInstructor(instructor);
                                setShowRejectionDialog(true);
                              }}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              data-testid={`button-reject-${instructor.id}`}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {(instructor.instructorStatus === 'approved' || instructor.instructorStatus === 'rejected') && activeTab === 'all' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetInstructorStatus(instructor.id)}
                            data-testid={`button-reset-${instructor.id}`}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Instructor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedInstructor?.fullName}'s application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                data-testid="textarea-rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide specific feedback on why this application was rejected..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionDialog(false);
                  setRejectionReason('');
                  setSelectedInstructor(null);
                }}
                className="flex-1"
                data-testid="button-cancel-rejection"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedInstructor && rejectInstructor(selectedInstructor.id, rejectionReason)}
                className="flex-1"
                data-testid="button-confirm-rejection"
              >
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorApprovalPanel;