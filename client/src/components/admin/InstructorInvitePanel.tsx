import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Trash2, Users, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InstructorInvite {
  id: number;
  email: string;
  token: string;
  isUsed: boolean;
  usedBy?: number;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

const InstructorInvitePanel = () => {
  const [invites, setInvites] = useState<InstructorInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/instructor-invites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invites');
      }

      const result = await response.json();
      setInvites(result.data.invites);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load instructor invites.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const generateInvite = async () => {
    if (!newInviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/instructor-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newInviteEmail.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invite');
      }

      const result = await response.json();
      
      toast({
        title: "Invite Generated",
        description: `Instructor invite sent to ${newInviteEmail}. The invite link has been copied to your clipboard.`,
      });

      // Copy invite URL to clipboard
      await navigator.clipboard.writeText(result.data.invite.inviteUrl);

      // Reset form and refresh list
      setNewInviteEmail('');
      setIsDialogOpen(false);
      fetchInvites();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate invite.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeInvite = async (inviteId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/instructor-invites/${inviteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to revoke invite');
      }

      toast({
        title: "Invite Revoked",
        description: "The instructor invite has been revoked.",
      });

      fetchInvites();
    } catch (error) {
      toast({
        title: "Revocation Failed",
        description: "Failed to revoke the invite.",
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = async (invite: InstructorInvite) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/instructor-signup?token=${invite.token}`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Link Copied",
        description: "Instructor invite link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy the invite link.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (invite: InstructorInvite) => {
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);

    if (invite.isUsed) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Used</Badge>;
    } else if (now > expiresAt) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
    } else {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Instructor Invitations</h2>
          <p className="text-gray-600">Manage instructor invitations for Desired Career Academy</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-generate-invite">
              <Plus className="w-4 h-4 mr-2" />
              Generate Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Instructor Invite</DialogTitle>
              <DialogDescription>
                Create a secure invite link for a new instructor. The link will expire in 24 hours.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  data-testid="input-invite-email"
                  type="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  placeholder="instructor@example.com"
                  onKeyDown={(e) => e.key === 'Enter' && generateInvite()}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Security Notice</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Invite links expire automatically after 24 hours</li>
                  <li>• Each link can only be used once</li>
                  <li>• The invited email must match during registration</li>
                  <li>• You can revoke unused invites at any time</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button
                  data-testid="button-cancel-invite"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="button-send-invite"
                  onClick={generateInvite}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate Invite'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invites</p>
                <p className="text-2xl font-bold">{invites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {invites.filter(invite => !invite.isUsed && new Date() <= new Date(invite.expiresAt)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Used</p>
                <p className="text-2xl font-bold">
                  {invites.filter(invite => invite.isUsed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">
                  {invites.filter(invite => !invite.isUsed && new Date() > new Date(invite.expiresAt)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invites Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Instructor Invites</CardTitle>
          <CardDescription>
            Track and manage all instructor invitation links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invites...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No instructor invites generated yet.</p>
              <p className="text-sm text-gray-500">Click "Generate Invite" to create your first invitation.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Used At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>{getStatusBadge(invite)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(invite.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(invite.expiresAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {invite.usedAt ? formatDate(invite.usedAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!invite.isUsed && new Date() <= new Date(invite.expiresAt) && (
                          <>
                            <Button
                              data-testid={`button-copy-${invite.id}`}
                              variant="outline"
                              size="sm"
                              onClick={() => copyInviteLink(invite)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              data-testid={`button-revoke-${invite.id}`}
                              variant="outline"
                              size="sm"
                              onClick={() => revokeInvite(invite.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
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
    </div>
  );
};

export default InstructorInvitePanel;