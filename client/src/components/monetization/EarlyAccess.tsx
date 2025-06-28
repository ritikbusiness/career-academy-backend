import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, Lock, Star, Calendar, Users, Clock,
  Zap, PlayCircle, BookOpen, Trophy, Gift
} from 'lucide-react';

interface EarlyAccessCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  releaseDate: string;
  completionPercentage: number;
  estimatedDuration: string;
  earlyAccessPrice: number;
  fullPrice: number;
  enrolledCount: number;
  maxEarlyAccessSlots: number;
  features: string[];
  previewVideos: number;
  isEnrolled?: boolean;
}

interface EarlyAccessProps {
  userSubscription: 'free' | 'pro' | 'premium';
  onUpgrade?: () => void;
  onEnroll?: (courseId: string) => void;
}

export default function EarlyAccess({ userSubscription, onUpgrade, onEnroll }: EarlyAccessProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock early access courses
  const earlyAccessCourses: EarlyAccessCourse[] = [
    {
      id: '1',
      title: 'Advanced AI & Machine Learning with Python',
      description: 'Master cutting-edge AI techniques including neural networks, deep learning, and LLM integration. Get exclusive access to the latest industry practices before official launch.',
      instructor: 'Dr. Sarah Chen',
      releaseDate: '2025-03-15',
      completionPercentage: 75,
      estimatedDuration: '24 hours',
      earlyAccessPrice: 149,
      fullPrice: 199,
      enrolledCount: 23,
      maxEarlyAccessSlots: 50,
      features: [
        'Exclusive weekly Q&A sessions with instructor',
        'Early access to course materials as they\'re created',
        'Direct feedback channel to influence course content',
        'Lifetime access with all future updates',
        'Premium community access',
        'Certificate of early adoption'
      ],
      previewVideos: 3,
      isEnrolled: false
    },
    {
      id: '2',
      title: 'Next.js 15 & React Server Components Mastery',
      description: 'Be among the first to master the latest Next.js features including advanced Server Components, streaming, and performance optimization techniques.',
      instructor: 'Alex Rodriguez',
      releaseDate: '2025-02-28',
      completionPercentage: 85,
      estimatedDuration: '18 hours',
      earlyAccessPrice: 129,
      fullPrice: 179,
      enrolledCount: 31,
      maxEarlyAccessSlots: 40,
      features: [
        'Access to bleeding-edge Next.js features',
        'Live coding sessions with instructor',
        'Early bird pricing (28% off)',
        'Priority support and feedback',
        'Exclusive Discord community',
        'Real-world project templates'
      ],
      previewVideos: 2,
      isEnrolled: true
    },
    {
      id: '3',
      title: 'Blockchain Development with Solidity & Web3',
      description: 'Comprehensive guide to blockchain development, smart contracts, and DeFi applications. Shape the future of this course with your feedback.',
      instructor: 'Michael Kim',
      releaseDate: '2025-04-10',
      completionPercentage: 60,
      estimatedDuration: '32 hours',
      earlyAccessPrice: 199,
      fullPrice: 299,
      enrolledCount: 18,
      maxEarlyAccessSlots: 35,
      features: [
        'Hands-on smart contract development',
        'Live blockchain deployment sessions',
        'Industry expert guest appearances',
        'Exclusive NFT certificate',
        'Early access to development tools',
        'One-on-one mentorship opportunities'
      ],
      previewVideos: 4,
      isEnrolled: false
    }
  ];

  const hasEarlyAccess = userSubscription === 'pro' || userSubscription === 'premium';

  const handleEnrollEarlyAccess = (courseId: string) => {
    if (!hasEarlyAccess) {
      setShowUpgradeModal(true);
      return;
    }
    // TODO: connect to backend - enroll in early access course
    onEnroll?.(courseId);
  };

  const calculateDaysUntilRelease = (releaseDate: string) => {
    const today = new Date();
    const release = new Date(releaseDate);
    const diffTime = release.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAvailabilityStatus = (course: EarlyAccessCourse) => {
    const spotsLeft = course.maxEarlyAccessSlots - course.enrolledCount;
    if (spotsLeft <= 0) return { status: 'full', message: 'Early access full', color: 'text-red-600 dark:text-red-400' };
    if (spotsLeft <= 5) return { status: 'limited', message: `Only ${spotsLeft} spots left`, color: 'text-orange-600 dark:text-orange-400' };
    return { status: 'available', message: `${spotsLeft} spots available`, color: 'text-green-600 dark:text-green-400' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Early Access Courses
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Get exclusive access to cutting-edge courses before they launch
        </p>
        
        {!hasEarlyAccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-800 dark:text-yellow-200">
              Upgrade to Pro or Premium to access early access courses
            </span>
            <Button size="sm" onClick={() => setShowUpgradeModal(true)}>
              Upgrade Now
            </Button>
          </div>
        )}
      </div>

      {/* Early Access Benefits */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Star className="w-5 h-5" />
            Early Access Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Exclusive Pricing</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Save 25-30% off the final course price
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Influence Content</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Provide feedback that shapes the final course
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Special Recognition</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Exclusive badges and certificates
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {earlyAccessCourses.map((course) => {
          const daysUntilRelease = calculateDaysUntilRelease(course.releaseDate);
          const availability = getAvailabilityStatus(course);
          const savingsAmount = course.fullPrice - course.earlyAccessPrice;
          const savingsPercentage = Math.round((savingsAmount / course.fullPrice) * 100);

          return (
            <Card key={course.id} className="overflow-hidden relative">
              {/* Early Access Badge */}
              <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 hover:bg-yellow-600">
                <Crown className="w-3 h-3 mr-1" />
                Early Access
              </Badge>

              {course.isEnrolled && (
                <Badge className="absolute top-4 left-4 z-10 bg-green-500">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  Enrolled
                </Badge>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-lg pr-16">{course.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>By {course.instructor}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.estimatedDuration}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {course.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Course Development</span>
                    <span className="font-medium">{course.completionPercentage}%</span>
                  </div>
                  <Progress value={course.completionPercentage} className="h-2" />
                </div>

                {/* Release Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Release Date</div>
                      <div className="font-medium">{course.releaseDate}</div>
                      <div className="text-xs text-gray-500">
                        {daysUntilRelease > 0 ? `${daysUntilRelease} days to go` : 'Available now'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Enrollment</div>
                      <div className="font-medium">{course.enrolledCount}/{course.maxEarlyAccessSlots}</div>
                      <div className={`text-xs ${availability.color}`}>
                        {availability.message}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${course.earlyAccessPrice}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${course.fullPrice}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      Save {savingsPercentage}%
                    </Badge>
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Early bird savings: ${savingsAmount}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    Early Access Includes:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {course.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {course.features.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{course.features.length - 3} more benefits...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {course.isEnrolled ? (
                    <Button variant="outline" className="w-full" disabled>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Already Enrolled
                    </Button>
                  ) : !hasEarlyAccess ? (
                    <Button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Upgrade to Access
                    </Button>
                  ) : availability.status === 'full' ? (
                    <Button disabled className="w-full">
                      Early Access Full
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleEnrollEarlyAccess(course.id)}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Get Early Access
                    </Button>
                  )}
                </div>

                {/* Preview Content */}
                {course.previewVideos > 0 && (
                  <div className="pt-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Watch {course.previewVideos} Preview Video{course.previewVideos > 1 ? 's' : ''}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How Early Access Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Early Access Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Enroll Early</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join while the course is still in development
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Access Content</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get new lessons as they're created and published
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Provide Feedback</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help shape the course with your input and suggestions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">4</span>
              </div>
              <h4 className="font-medium mb-2">Complete Course</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enjoy the full course with lifetime access and updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Upgrade for Early Access
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Early access courses are available to Pro and Premium subscribers only.
            </p>

            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Pro Plan - $29/month</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li>• Access to early access courses</li>
                  <li>• Priority support</li>
                  <li>• Advanced features</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950">
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Premium Plan - $59/month</h4>
                <ul className="text-sm text-purple-700 dark:text-purple-300 mt-1 space-y-1">
                  <li>• All Pro features</li>
                  <li>• Exclusive premium early access</li>
                  <li>• 1-on-1 instructor sessions</li>
                  <li>• Priority early access enrollment</li>
                </ul>
              </div>
            </div>

            <Button onClick={onUpgrade} className="w-full">
              <Crown className="w-4 h-4 mr-2" />
              Choose Your Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}