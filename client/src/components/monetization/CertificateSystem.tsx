import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Award, Download, Send, Eye, Calendar, User, 
  CheckCircle, Clock, Star, CreditCard, Crown,
  FileText, Share2, Globe, Verified
} from 'lucide-react';

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  instructorName: string;
  completionDate: string;
  certificateType: 'basic' | 'verified' | 'premium';
  score?: number;
  credentialId: string;
  issuedDate: string;
  verificationUrl: string;
  skills: string[];
}

interface CertificateTemplate {
  id: string;
  name: string;
  type: 'basic' | 'verified' | 'premium';
  price: number;
  features: string[];
  design: string;
}

interface CertificateSystemProps {
  userRole: 'student' | 'instructor' | 'admin';
  userId: string;
  completedCourses?: Array<{ id: string; title: string; completionDate: string; score: number }>;
}

export default function CertificateSystem({ userRole, userId, completedCourses = [] }: CertificateSystemProps) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('verified');
  const [issueForm, setIssueForm] = useState({
    studentEmail: '',
    courseId: '',
    certificateType: 'verified' as 'basic' | 'verified' | 'premium',
    customMessage: ''
  });

  // Certificate templates
  const certificateTemplates: CertificateTemplate[] = [
    {
      id: 'basic',
      name: 'Basic Certificate',
      type: 'basic',
      price: 0,
      features: [
        'Digital certificate of completion',
        'Basic verification',
        'PDF download',
        'Social media sharing'
      ],
      design: 'Simple black and white design'
    },
    {
      id: 'verified',
      name: 'Verified Certificate',
      type: 'verified',
      price: 49,
      features: [
        'All basic features',
        'Blockchain verification',
        'LinkedIn integration',
        'Global verification database',
        'Anti-fraud protection',
        'Professional design'
      ],
      design: 'Professional colored design with security features'
    },
    {
      id: 'premium',
      name: 'Premium Certificate',
      type: 'premium',
      price: 99,
      features: [
        'All verified features',
        'Physical certificate mailed',
        'Premium paper and printing',
        'Gold embossed seal',
        'Frame-ready format',
        'Priority processing',
        'Lifetime credential URL'
      ],
      design: 'Luxury design with premium materials'
    }
  ];

  // Mock certificates data
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      courseId: 'course1',
      courseName: 'React Advanced Patterns',
      studentId: 'student1',
      studentName: 'John Doe',
      instructorName: 'Sarah Chen',
      completionDate: '2025-01-20',
      certificateType: 'verified',
      score: 92,
      credentialId: 'CERT-2025-001234',
      issuedDate: '2025-01-21',
      verificationUrl: 'https://verify.platform.com/CERT-2025-001234',
      skills: ['React', 'JavaScript', 'Frontend Development']
    },
    {
      id: '2',
      courseId: 'course2',
      courseName: 'Node.js Backend Development',
      studentId: 'student2',
      studentName: 'Jane Smith',
      instructorName: 'Michael Kim',
      completionDate: '2025-01-18',
      certificateType: 'premium',
      score: 87,
      credentialId: 'CERT-2025-001235',
      issuedDate: '2025-01-19',
      verificationUrl: 'https://verify.platform.com/CERT-2025-001235',
      skills: ['Node.js', 'Express', 'MongoDB', 'Backend Development']
    },
    {
      id: '3',
      courseId: 'course3',
      courseName: 'Python Data Science',
      studentId: 'student3',
      studentName: 'Bob Wilson',
      instructorName: 'Dr. Lisa Park',
      completionDate: '2025-01-15',
      certificateType: 'basic',
      score: 78,
      credentialId: 'CERT-2025-001236',
      issuedDate: '2025-01-16',
      verificationUrl: 'https://verify.platform.com/CERT-2025-001236',
      skills: ['Python', 'Data Analysis', 'Machine Learning']
    }
  ]);

  const handlePurchaseCertificate = (courseId: string, type: 'basic' | 'verified' | 'premium') => {
    // TODO: connect to backend - process certificate purchase
    console.log('Purchasing certificate:', { courseId, type });
  };

  const handleDownloadCertificate = (certificateId: string) => {
    // TODO: connect to backend - generate and download certificate PDF
    console.log('Downloading certificate:', certificateId);
  };

  const handleShareCertificate = (certificate: Certificate) => {
    const shareUrl = certificate.verificationUrl;
    navigator.clipboard.writeText(shareUrl);
    // TODO: show success toast
  };

  const handleIssueCertificate = () => {
    const newCertificate: Certificate = {
      id: Date.now().toString(),
      courseId: issueForm.courseId,
      courseName: completedCourses.find(c => c.id === issueForm.courseId)?.title || 'Course',
      studentId: 'student-' + Date.now(),
      studentName: issueForm.studentEmail.split('@')[0],
      instructorName: 'Current Instructor', // TODO: get from user context
      completionDate: new Date().toISOString().split('T')[0],
      certificateType: issueForm.certificateType,
      credentialId: `CERT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      issuedDate: new Date().toISOString().split('T')[0],
      verificationUrl: `https://verify.platform.com/CERT-${Date.now()}`,
      skills: ['Manual Issue'] // TODO: get from course data
    };

    // TODO: connect to backend - issue certificate manually
    setCertificates(prev => [newCertificate, ...prev]);
    setShowIssueModal(false);
    resetIssueForm();
  };

  const resetIssueForm = () => {
    setIssueForm({
      studentEmail: '',
      courseId: '',
      certificateType: 'verified',
      customMessage: ''
    });
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return <FileText className="w-5 h-5 text-gray-600" />;
      case 'verified':
        return <Verified className="w-5 h-5 text-blue-600" />;
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getCertificateBadgeColor = (type: string) => {
    switch (type) {
      case 'basic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const userCertificates = userRole === 'student' 
    ? certificates.filter(c => c.studentId === userId)
    : certificates;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userRole === 'student' ? 'My Certificates' : 'Certificate Management'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'student' 
              ? 'Manage and download your course completion certificates'
              : 'Issue and manage student certificates'
            }
          </p>
        </div>

        {(userRole === 'instructor' || userRole === 'admin') && (
          <Button onClick={() => setShowIssueModal(true)}>
            <Award className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        )}
      </div>

      {/* Certificate Templates (for students) */}
      {userRole === 'student' && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {certificateTemplates.map((template) => (
            <Card key={template.id} className="relative">
              {template.type === 'verified' && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getCertificateIcon(template.type)}
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.price === 0 ? 'Free' : `$${template.price}`}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={template.type === 'verified' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.price === 0 ? 'Get Certificate' : 'Purchase'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificates List */}
      <div className="space-y-4">
        {userCertificates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userRole === 'student' 
                  ? "Complete courses to earn certificates"
                  : "No certificates have been issued yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          userCertificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {certificate.courseName}
                      </h3>
                      <Badge className={getCertificateBadgeColor(certificate.certificateType)}>
                        {getCertificateIcon(certificate.certificateType)}
                        <span className="ml-1 capitalize">{certificate.certificateType}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Student</div>
                          <div className="font-medium">{certificate.studentName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Completed</div>
                          <div className="font-medium">{certificate.completionDate}</div>
                        </div>
                      </div>

                      {certificate.score && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-gray-600 dark:text-gray-400">Score</div>
                            <div className="font-medium">{certificate.score}%</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">Credential ID</div>
                          <div className="font-medium font-mono text-xs">{certificate.credentialId}</div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills Verified:</div>
                      <div className="flex flex-wrap gap-2">
                        {certificate.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Verification URL */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Verification URL: 
                      <a 
                        href={certificate.verificationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {certificate.verificationUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCertificate(certificate);
                        setShowPreviewModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadCertificate(certificate.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShareCertificate(certificate)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Available Certificates for Student */}
      {userRole === 'student' && completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedCourses.map((course) => {
                const hasBasicCert = certificates.some(c => 
                  c.courseId === course.id && c.certificateType === 'basic'
                );
                const hasVerifiedCert = certificates.some(c => 
                  c.courseId === course.id && c.certificateType === 'verified'
                );
                const hasPremiumCert = certificates.some(c => 
                  c.courseId === course.id && c.certificateType === 'premium'
                );

                return (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed: {course.completionDate} • Score: {course.score}%
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!hasBasicCert && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePurchaseCertificate(course.id, 'basic')}
                        >
                          Free Certificate
                        </Button>
                      )}
                      {!hasVerifiedCert && (
                        <Button 
                          size="sm"
                          onClick={() => handlePurchaseCertificate(course.id, 'verified')}
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          Verified ($49)
                        </Button>
                      )}
                      {!hasPremiumCert && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePurchaseCertificate(course.id, 'premium')}
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          Premium ($99)
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificate Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-4">
              {/* Mock Certificate Design */}
              <div className="border-4 border-double border-gray-300 dark:border-gray-600 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 text-center">
                <div className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Certificate of Completion
                </div>
                
                <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  This is to certify that
                </div>
                
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedCertificate.studentName}
                </div>
                
                <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  has successfully completed the course
                </div>
                
                <div className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  {selectedCertificate.courseName}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  with a score of {selectedCertificate.score}%
                </div>
                
                <div className="flex justify-between items-end mt-8">
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2 text-sm">
                      Instructor: {selectedCertificate.instructorName}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2 text-sm">
                      Date: {selectedCertificate.completionDate}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  Credential ID: {selectedCertificate.credentialId}
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                This is a preview. The actual certificate will include security features and verification elements.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Certificate Modal (Admin/Instructor) */}
      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Certificate Manually</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="studentEmail">Student Email</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="student@example.com"
                value={issueForm.studentEmail}
                onChange={(e) => setIssueForm(prev => ({ ...prev, studentEmail: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="courseSelect">Course</Label>
              <Select value={issueForm.courseId} onValueChange={(value) => 
                setIssueForm(prev => ({ ...prev, courseId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {completedCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="certType">Certificate Type</Label>
              <Select value={issueForm.certificateType} onValueChange={(value: 'basic' | 'verified' | 'premium') => 
                setIssueForm(prev => ({ ...prev, certificateType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Certificate</SelectItem>
                  <SelectItem value="verified">Verified Certificate</SelectItem>
                  <SelectItem value="premium">Premium Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleIssueCertificate}
              className="w-full"
              disabled={!issueForm.studentEmail || !issueForm.courseId}
            >
              <Send className="w-4 h-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}