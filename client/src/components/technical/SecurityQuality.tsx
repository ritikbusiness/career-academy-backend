import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, AlertTriangle, CheckCircle, Eye, EyeOff, 
  FileSearch, Ban, Calendar, User, Flag, Scan
} from 'lucide-react';

interface SecuritySettings {
  contentProtection: boolean;
  preventRightClick: boolean;
  preventVideoDownload: boolean;
  aiModeration: boolean;
  plagiarismDetection: boolean;
  autoBackup: boolean;
}

interface FlaggedContent {
  id: string;
  type: 'question' | 'review' | 'assignment' | 'discussion';
  content: string;
  author: string;
  flaggedAt: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
}

interface PlagiarismResult {
  id: string;
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  plagiarismScore: number;
  sources: string[];
  submittedAt: string;
}

interface SecurityQualityProps {
  userRole: 'instructor' | 'admin';
  userId: string;
}

export default function SecurityQuality({ userRole, userId }: SecurityQualityProps) {
  const [settings, setSettings] = useState<SecuritySettings>({
    contentProtection: true,
    preventRightClick: true,
    preventVideoDownload: true,
    aiModeration: true,
    plagiarismDetection: true,
    autoBackup: true
  });

  const [showModerationModal, setShowModerationModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [scanningPlagiarism, setScanningPlagiarism] = useState(false);

  // Mock data
  const [flaggedContent] = useState<FlaggedContent[]>([
    {
      id: '1',
      type: 'question',
      content: 'This is a sample question that contains inappropriate language or spam content that needs moderation review.',
      author: 'John Doe',
      flaggedAt: '2025-01-20T10:30:00Z',
      reason: 'Inappropriate language',
      status: 'pending'
    },
    {
      id: '2',
      type: 'review',
      content: 'Fake review content that appears to be spam or promotional material not related to the actual course.',
      author: 'Jane Smith',
      flaggedAt: '2025-01-19T14:15:00Z',
      reason: 'Spam/promotional content',
      status: 'pending'
    },
    {
      id: '3',
      type: 'assignment',
      content: 'Assignment submission that may contain copied content from external sources without proper attribution.',
      author: 'Bob Wilson',
      flaggedAt: '2025-01-18T09:45:00Z',
      reason: 'Potential plagiarism',
      status: 'approved',
      moderatedBy: userId
    }
  ]);

  const [plagiarismResults] = useState<PlagiarismResult[]>([
    {
      id: '1',
      submissionId: 'sub-001',
      studentName: 'Alice Johnson',
      assignmentTitle: 'React Component Architecture',
      plagiarismScore: 85,
      sources: ['GitHub Repository', 'Stack Overflow', 'Medium Article'],
      submittedAt: '2025-01-20T16:30:00Z'
    },
    {
      id: '2',
      submissionId: 'sub-002',
      studentName: 'Mike Chen',
      assignmentTitle: 'Database Design Principles',
      plagiarismScore: 23,
      sources: ['Wikipedia'],
      submittedAt: '2025-01-19T11:20:00Z'
    },
    {
      id: '3',
      submissionId: 'sub-003',
      studentName: 'Sarah Davis',
      assignmentTitle: 'Node.js API Development',
      plagiarismScore: 67,
      sources: ['Tutorial Website', 'Documentation'],
      submittedAt: '2025-01-18T13:15:00Z'
    }
  ]);

  const handleSettingChange = (key: keyof SecuritySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: connect to backend - update security settings
  };

  const handleModerateFlaggedContent = (content: FlaggedContent) => {
    setSelectedContent(content);
    setShowModerationModal(true);
  };

  const handleApproveContent = () => {
    if (!selectedContent) return;
    
    // TODO: connect to backend - approve flagged content
    console.log('Approving content:', selectedContent.id, 'Notes:', moderationNotes);
    setShowModerationModal(false);
    setSelectedContent(null);
    setModerationNotes('');
  };

  const handleRejectContent = () => {
    if (!selectedContent) return;
    
    // TODO: connect to backend - reject flagged content
    console.log('Rejecting content:', selectedContent.id, 'Notes:', moderationNotes);
    setShowModerationModal(false);
    setSelectedContent(null);
    setModerationNotes('');
  };

  const handleScanPlagiarism = async (submissionId: string) => {
    setScanningPlagiarism(true);
    // TODO: connect to backend - scan for plagiarism
    await new Promise(resolve => setTimeout(resolve, 2000));
    setScanningPlagiarism(false);
  };

  const handleTriggerBackup = () => {
    // TODO: connect to backend - trigger manual backup
    console.log('Triggering manual backup...');
  };

  const handleRestoreBackup = () => {
    // TODO: connect to backend - restore from backup
    console.log('Restoring from backup...');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlagiarismSeverity = (score: number) => {
    if (score >= 70) return { level: 'high', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950' };
    if (score >= 40) return { level: 'medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950' };
    return { level: 'low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950' };
  };

  const pendingModerationCount = flaggedContent.filter(item => item.status === 'pending').length;
  const highPlagiarismCount = plagiarismResults.filter(result => result.plagiarismScore >= 70).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Security & Quality Control
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Protect content and maintain platform quality standards
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Object.values(settings).filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Security Features</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {pendingModerationCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pending Moderation</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {highPlagiarismCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">High Plagiarism</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              98.5%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Content Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Prevent Right-Click</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Disable context menu on lessons
                </p>
              </div>
              <Switch
                checked={settings.preventRightClick}
                onCheckedChange={(checked) => handleSettingChange('preventRightClick', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Prevent Video Download</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Block video downloads and screen recording
                </p>
              </div>
              <Switch
                checked={settings.preventVideoDownload}
                onCheckedChange={(checked) => handleSettingChange('preventVideoDownload', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Content Protection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable advanced content protection
                </p>
              </div>
              <Switch
                checked={settings.contentProtection}
                onCheckedChange={(checked) => handleSettingChange('contentProtection', checked)}
              />
            </div>

            {settings.contentProtection && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  Content protection is active. Videos are encrypted and lessons include watermarks.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              AI Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto Moderation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered content moderation
                </p>
              </div>
              <Switch
                checked={settings.aiModeration}
                onCheckedChange={(checked) => handleSettingChange('aiModeration', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Plagiarism Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan assignments for plagiarism
                </p>
              </div>
              <Switch
                checked={settings.plagiarismDetection}
                onCheckedChange={(checked) => handleSettingChange('plagiarismDetection', checked)}
              />
            </div>

            {settings.aiModeration && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Moderation Queue</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {pendingModerationCount} items pending review
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Review Queue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Content Moderation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flaggedContent.filter(item => item.status === 'pending').map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        by {item.author}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                      {item.content}
                    </p>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Flagged: {new Date(item.flaggedAt).toLocaleDateString()} • Reason: {item.reason}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleModerateFlaggedContent(item)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
            
            {pendingModerationCount === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  All Clear!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No content requires moderation at this time.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plagiarism Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5" />
            Plagiarism Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plagiarismResults.map((result) => {
              const severity = getPlagiarismSeverity(result.plagiarismScore);
              
              return (
                <div key={result.id} className={`border rounded-lg p-4 ${severity.bg}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{result.assignmentTitle}</h4>
                        <Badge className={severity.color}>
                          {result.plagiarismScore}% Match
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Student:</span>
                          <span className="ml-2 font-medium">{result.studentName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                          <span className="ml-2">{new Date(result.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Sources:</span>
                          <span className="ml-2">{result.sources.length} found</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Similarity Score</div>
                        <Progress value={result.plagiarismScore} className="h-2" />
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Potential sources: </span>
                        {result.sources.join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScanPlagiarism(result.submissionId)}
                        disabled={scanningPlagiarism}
                      >
                        <Scan className="w-4 h-4 mr-1" />
                        Rescan
                      </Button>
                      <Button size="sm" variant="outline">
                        Flag Student
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Backup & Recovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Backup & Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Automatic Backups</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily automated backups of all data
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Backup</div>
              <div className="font-medium">Jan 20, 2025 3:00 AM</div>
              <div className="text-xs text-gray-500">Size: 2.4 GB</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Backup Status</div>
              <div className="font-medium text-green-600 dark:text-green-400">Healthy</div>
              <div className="text-xs text-gray-500">All systems operational</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Retention</div>
              <div className="font-medium">30 days</div>
              <div className="text-xs text-gray-500">14 backup points</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleTriggerBackup} variant="outline">
              Trigger Backup
            </Button>
            <Button onClick={handleRestoreBackup} variant="outline">
              Restore from Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Modal */}
      <Dialog open={showModerationModal} onOpenChange={setShowModerationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Moderation Review</DialogTitle>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">{selectedContent.type}</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    by {selectedContent.author}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedContent.content}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Flagged reason: {selectedContent.reason}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Moderation Notes
                </label>
                <Textarea
                  placeholder="Add notes about your moderation decision..."
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApproveContent}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Content
                </Button>
                <Button
                  onClick={handleRejectContent}
                  variant="destructive"
                  className="flex-1"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Reject Content
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}