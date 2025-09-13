import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, DollarSign, Link, Copy, TrendingUp, Calendar,
  Eye, MousePointer, CreditCard, Settings, Share
} from 'lucide-react';

interface AffiliateStats {
  totalReferrals: number;
  successfulSignups: number;
  totalEarnings: number;
  pendingEarnings: number;
  clickThroughRate: number;
  conversionRate: number;
}

interface Referral {
  id: string;
  referredEmail: string;
  referredName?: string;
  signupDate: string;
  status: 'pending' | 'confirmed' | 'purchased';
  commission: number;
  coursePurchased?: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  processedDate?: string;
  method: 'paypal' | 'bank' | 'stripe';
}

interface AffiliateProgramProps {
  userRole: 'student' | 'instructor' | 'admin';
  userId: string;
}

export default function AffiliateProgram({ userRole, userId }: AffiliateProgramProps) {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('paypal');
  const [commissionRate, setCommissionRate] = useState(10);
  const [referralLink, setReferralLink] = useState(`https://learn.platform.com?ref=${userId}`);

  // Mock data
  const [stats] = useState<AffiliateStats>({
    totalReferrals: 47,
    successfulSignups: 23,
    totalEarnings: 1247.50,
    pendingEarnings: 325.00,
    clickThroughRate: 3.2,
    conversionRate: 48.9
  });

  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      referredEmail: 'referral1@example.com',
      referredName: 'John Doe',
      signupDate: '2025-01-20',
      status: 'purchased',
      commission: 29.99,
      coursePurchased: 'React Advanced Patterns'
    },
    {
      id: '2',
      referredEmail: 'jane@example.com',
      referredName: 'Jane Smith',
      signupDate: '2025-01-18',
      status: 'confirmed',
      commission: 0
    },
    {
      id: '3',
      referredEmail: 'bob@example.com',
      signupDate: '2025-01-15',
      status: 'pending',
      commission: 0
    },
    {
      id: '4',
      referredEmail: 'alice@example.com',
      referredName: 'Alice Wilson',
      signupDate: '2025-01-12',
      status: 'purchased',
      commission: 49.99,
      coursePurchased: 'Node.js Backend Development'
    }
  ]);

  const [payoutHistory] = useState<PayoutRequest[]>([
    {
      id: '1',
      amount: 500.00,
      requestDate: '2025-01-01',
      status: 'completed',
      processedDate: '2025-01-03',
      method: 'paypal'
    },
    {
      id: '2',
      amount: 250.00,
      requestDate: '2025-01-10',
      status: 'processing',
      method: 'bank'
    }
  ]);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    // TODO: show success toast
  };

  const handleRequestPayout = () => {
    const newRequest: PayoutRequest = {
      id: Date.now().toString(),
      amount: parseFloat(payoutAmount),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      method: payoutMethod as 'paypal' | 'bank' | 'stripe'
    };

    // TODO: connect to backend - submit payout request
    console.log('Payout request submitted:', newRequest);
    setShowPayoutModal(false);
    setPayoutAmount('');
  };

  const handleUpdateCommissionRate = () => {
    // TODO: connect to backend - update commission rate for instructor
    console.log('Commission rate updated:', commissionRate);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'purchased':
        return 'default';
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'confirmed':
        return 'text-blue-600 dark:text-blue-400';
      case 'purchased':
        return 'text-green-600 dark:text-green-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Affiliate Program
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Earn commissions by referring new students to our platform
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          {userRole === 'instructor' && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalReferrals}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.conversionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalEarnings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.pendingEarnings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending Earnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={handleCopyReferralLink} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Share this link with friends and earn commissions when they sign up and purchase courses
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have ${stats.pendingEarnings} available for withdrawal
                </p>
                <Button 
                  onClick={() => setShowPayoutModal(true)}
                  disabled={stats.pendingEarnings === 0}
                  className="w-full"
                >
                  Request Payout
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Click-through Rate:</span>
                  <span className="font-medium">{stats.clickThroughRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Successful Signups:</span>
                  <span className="font-medium">{stats.successfulSignups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Commission:</span>
                  <span className="font-medium">
                    ${(stats.totalEarnings / stats.successfulSignups).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <div className="space-y-4">
            {referrals.map((referral) => (
              <Card key={referral.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {referral.referredName || referral.referredEmail}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(referral.status)}>
                          <span className={getStatusColor(referral.status)}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">Signed up:</span>
                          <span>{referral.signupDate}</span>
                        </div>
                        
                        {referral.coursePurchased && (
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Course:</span>
                            <span>{referral.coursePurchased}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">Commission:</span>
                          <span className="font-medium">
                            {referral.commission > 0 ? `$${referral.commission}` : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payout History
            </h3>
            <Button onClick={() => setShowPayoutModal(true)}>
              Request Payout
            </Button>
          </div>

          <div className="space-y-4">
            {payoutHistory.map((payout) => (
              <Card key={payout.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          ${payout.amount}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(payout.status)}>
                          <span className={getStatusColor(payout.status)}>
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                          <span className="ml-2">{payout.requestDate}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Method:</span>
                          <span className="ml-2 capitalize">{payout.method}</span>
                        </div>
                        
                        {payout.processedDate && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Processed:</span>
                            <span className="ml-2">{payout.processedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab (Instructor only) */}
        {userRole === 'instructor' && (
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Affiliate Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <div className="flex gap-3 mt-1">
                    <Input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="50"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <Button onClick={handleUpdateCommissionRate}>
                      Update
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Set the commission rate you want to offer to affiliates promoting your courses
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Payout Request Modal */}
      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Available Balance</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.pendingEarnings}
              </div>
            </div>

            <div>
              <Label htmlFor="payoutAmount">Payout Amount</Label>
              <Input
                id="payoutAmount"
                type="number"
                placeholder="0.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                max={stats.pendingEarnings}
              />
            </div>

            <div>
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <select
                id="payoutMethod"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              Payouts are processed within 3-5 business days. Minimum payout amount is $25.
            </div>

            <Button 
              onClick={handleRequestPayout}
              className="w-full"
              disabled={!payoutAmount || parseFloat(payoutAmount) < 25 || parseFloat(payoutAmount) > stats.pendingEarnings}
            >
              Request Payout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}