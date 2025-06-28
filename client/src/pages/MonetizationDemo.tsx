import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, Tag, RefreshCw, Users, Package, Crown, 
  Award, Zap, Shield, BarChart3, Settings, ChevronRight
} from 'lucide-react';

// Import all the monetization components
import SubscriptionPlans from '@/components/monetization/SubscriptionPlans';
import DiscountCoupons from '@/components/monetization/DiscountCoupons';
import RefundManagement from '@/components/monetization/RefundManagement';
import AffiliateProgram from '@/components/monetization/AffiliateProgram';
import CourseBundles from '@/components/monetization/CourseBundles';
import EarlyAccess from '@/components/monetization/EarlyAccess';
import CertificateSystem from '@/components/monetization/CertificateSystem';
import PerformanceOptimization from '@/components/technical/PerformanceOptimization';
import SecurityQuality from '@/components/technical/SecurityQuality';

interface MonetizationFeature {
  id: string;
  title: string;
  description: string;
  category: 'monetization' | 'technical';
  icon: React.ReactNode;
  component: React.ReactNode;
  tags: string[];
}

export default function MonetizationDemo() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'admin'>('student');

  // Mock data for demos
  const mockEnrolledCourses = [
    { id: '1', title: 'React Advanced Patterns', price: 99, enrolledAt: '2025-01-10' },
    { id: '2', title: 'Node.js Backend Development', price: 149, enrolledAt: '2025-01-05' }
  ];

  const mockCompletedCourses = [
    { id: '1', title: 'React Fundamentals', completionDate: '2025-01-15', score: 92 },
    { id: '2', title: 'JavaScript ES6+', completionDate: '2025-01-10', score: 87 }
  ];

  const features: MonetizationFeature[] = [
    {
      id: 'subscription-plans',
      title: 'Subscription Plans',
      description: 'Flexible monthly and yearly subscription options with comprehensive billing management',
      category: 'monetization',
      icon: <Crown className="w-6 h-6" />,
      tags: ['Revenue', 'Billing', 'Plans'],
      component: (
        <SubscriptionPlans
          currentPlan="pro"
          onPlanSelect={(planId, cycle) => console.log('Plan selected:', planId, cycle)}
        />
      )
    },
    {
      id: 'discount-coupons',
      title: 'Discount Codes & Coupons',
      description: 'Create and manage promotional codes with flexible discount rules and usage tracking',
      category: 'monetization',
      icon: <Tag className="w-6 h-6" />,
      tags: ['Promotions', 'Marketing', 'Sales'],
      component: (
        <DiscountCoupons
          userRole={userRole as 'instructor' | 'admin'}
          userId="demo-user"
        />
      )
    },
    {
      id: 'refund-management',
      title: 'Refund Management',
      description: 'Streamlined refund request and processing system with admin approval workflow',
      category: 'monetization',
      icon: <RefreshCw className="w-6 h-6" />,
      tags: ['Customer Service', 'Finance', 'Support'],
      component: (
        <RefundManagement
          userRole={userRole as 'student' | 'admin'}
          userId="demo-user"
          enrolledCourses={mockEnrolledCourses}
        />
      )
    },
    {
      id: 'affiliate-program',
      title: 'Affiliate Program',
      description: 'Complete affiliate marketing system with commission tracking and payout management',
      category: 'monetization',
      icon: <Users className="w-6 h-6" />,
      tags: ['Marketing', 'Referrals', 'Growth'],
      component: (
        <AffiliateProgram
          userRole={userRole}
          userId="demo-user"
        />
      )
    },
    {
      id: 'course-bundles',
      title: 'Course Bundles',
      description: 'Package multiple courses together with attractive discounts and bundle pricing',
      category: 'monetization',
      icon: <Package className="w-6 h-6" />,
      tags: ['Packaging', 'Sales', 'Value'],
      component: (
        <CourseBundles
          userRole={userRole as 'student' | 'instructor'}
          userId="demo-user"
        />
      )
    },
    {
      id: 'early-access',
      title: 'Early Access',
      description: 'Premium early access to courses in development with exclusive benefits',
      category: 'monetization',
      icon: <Zap className="w-6 h-6" />,
      tags: ['Premium', 'Exclusivity', 'Beta'],
      component: (
        <EarlyAccess
          userSubscription={userRole === 'student' ? 'pro' : 'premium'}
          onUpgrade={() => console.log('Upgrade requested')}
          onEnroll={(courseId) => console.log('Enrolled in early access:', courseId)}
        />
      )
    },
    {
      id: 'certificate-system',
      title: 'Certificate System',
      description: 'Comprehensive certification with basic, verified, and premium certificate options',
      category: 'monetization',
      icon: <Award className="w-6 h-6" />,
      tags: ['Credentials', 'Verification', 'Value'],
      component: (
        <CertificateSystem
          userRole={userRole}
          userId="demo-user"
          completedCourses={mockCompletedCourses}
        />
      )
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description: 'Advanced performance monitoring and optimization tools for content delivery',
      category: 'technical',
      icon: <BarChart3 className="w-6 h-6" />,
      tags: ['Performance', 'CDN', 'Optimization'],
      component: (
        <PerformanceOptimization
          userRole={userRole}
        />
      )
    },
    {
      id: 'security-quality',
      title: 'Security & Quality Control',
      description: 'Content protection, AI moderation, plagiarism detection, and backup systems',
      category: 'technical',
      icon: <Shield className="w-6 h-6" />,
      tags: ['Security', 'Moderation', 'Quality'],
      component: (
        <SecurityQuality
          userRole={userRole as 'instructor' | 'admin'}
          userId="demo-user"
        />
      )
    }
  ];

  const monetizationFeatures = features.filter(f => f.category === 'monetization');
  const technicalFeatures = features.filter(f => f.category === 'technical');

  if (selectedFeature) {
    const feature = features.find(f => f.id === selectedFeature);
    if (!feature) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedFeature(null)}
              >
                ← Back to Features
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Badge variant={feature.category === 'monetization' ? 'default' : 'secondary'}>
                {feature.category === 'monetization' ? 'Business Feature' : 'Technical Enhancement'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900">
          {feature.component}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Business Monetization & Technical Features
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Comprehensive suite of revenue-generating features and technical enhancements 
          to build a premium learning platform
        </p>
      </div>

      {/* Role Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {(['student', 'instructor', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                userRole === role
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{monetizationFeatures.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Business Features</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{technicalFeatures.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Technical Enhancements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">100%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Implementation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quality Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories */}
      <Tabs defaultValue="monetization" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="monetization" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Business Monetization Features
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Technical Enhancements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monetization">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monetizationFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {feature.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button className="w-full" variant="outline">
                    Explore Feature →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <div className="grid md:grid-cols-2 gap-6">
            {technicalFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {feature.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button className="w-full" variant="outline">
                    Explore Enhancement →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Implementation Notes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Complete Business Platform Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Business Monetization Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Flexible subscription plans with billing management</li>
                <li>• Promotional codes and discount system</li>
                <li>• Comprehensive refund processing workflow</li>
                <li>• Complete affiliate marketing program</li>
                <li>• Course bundling with dynamic pricing</li>
                <li>• Premium early access system</li>
                <li>• Professional certificate offerings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Technical Enhancements
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Performance optimization and CDN management</li>
                <li>• Content protection and security measures</li>
                <li>• AI-powered content moderation</li>
                <li>• Plagiarism detection system</li>
                <li>• Automated backup and recovery</li>
                <li>• Advanced caching and compression</li>
                <li>• Real-time performance monitoring</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Production Ready:</strong> All components include comprehensive state management, 
              error handling, and clear API integration points for seamless backend connectivity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}