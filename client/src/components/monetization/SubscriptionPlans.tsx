import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, Crown, Star, Zap } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  premium?: boolean;
}

interface BillingInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
}

interface SubscriptionPlansProps {
  currentPlan?: string;
  onPlanSelect?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}

export default function SubscriptionPlans({ currentPlan, onPlanSelect }: SubscriptionPlansProps) {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: ''
  });

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Access to free courses',
        'Basic community access',
        'Limited practice exercises',
        'Standard video quality',
        'Course certificates (basic)'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 29, yearly: 299 },
      popular: true,
      features: [
        'All free features',
        'Access to premium courses',
        'Unlimited practice exercises',
        'HD video quality',
        'Priority community support',
        'Advanced analytics',
        'Mobile offline downloads',
        'Verified certificates'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 59, yearly: 599 },
      premium: true,
      features: [
        'All Pro features',
        'Early access to new courses',
        '1-on-1 instructor sessions',
        '4K video quality',
        'Personalized learning paths',
        'Advanced AI study buddy',
        'Course completion guarantees',
        'Premium certificates',
        'Priority customer support'
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      // TODO: connect to backend - activate free plan
      onPlanSelect?.(planId, 'monthly');
      return;
    }
    
    setSelectedPlan(planId);
    setShowBillingModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlan) return;
    
    // TODO: connect to backend - process payment and activate subscription
    console.log('Processing payment for plan:', selectedPlan, 'billing cycle:', selectedBilling);
    console.log('Billing info:', billingInfo);
    
    onPlanSelect?.(selectedPlan, selectedBilling);
    setShowBillingModal(false);
    setSelectedPlan(null);
  };

  const getYearlySavings = (plan: SubscriptionPlan) => {
    const monthlyTotal = plan.price.monthly * 12;
    const savings = monthlyTotal - plan.price.yearly;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Learning Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Unlock your potential with the perfect plan for your learning journey
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSelectedBilling('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBilling === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBilling('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBilling === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">Save up to 17%</Badge>
          </button>
        </div>
      </div>

      {/* Current Plan Status */}
      {currentPlan && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-900 dark:text-blue-100">
              You're currently on the <strong>{plans.find(p => p.id === currentPlan)?.name}</strong> plan
            </span>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const savings = getYearlySavings(plan);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : plan.premium 
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700'
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              {plan.premium && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${selectedBilling === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      /{selectedBilling === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {selectedBilling === 'yearly' && plan.price.monthly > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Save ${savings.amount} ({savings.percentage}% off)
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : plan.premium 
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : ''
                  }`}
                  variant={isCurrentPlan ? 'secondary' : 'default'}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Billing Modal */}
      <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Plan Summary */}
            {selectedPlan && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {plans.find(p => p.id === selectedPlan)?.name} Plan
                  </span>
                  <span className="font-bold">
                    ${selectedBilling === 'monthly' 
                      ? plans.find(p => p.id === selectedPlan)?.price.monthly 
                      : plans.find(p => p.id === selectedPlan)?.price.yearly}
                    /{selectedBilling === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {selectedBilling === 'yearly' && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You're saving {getYearlySavings(plans.find(p => p.id === selectedPlan)!).percentage}% with yearly billing
                  </p>
                )}
              </div>
            )}

            <Separator />

            {/* Billing Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={billingInfo.cardNumber}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={billingInfo.expiryDate}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={billingInfo.cvv}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={billingInfo.cardholderName}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Main St, City, State, ZIP"
                  value={billingInfo.billingAddress}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, billingAddress: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleConfirmPayment} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Confirm & Pay
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Your subscription will auto-renew. Cancel anytime in your account settings.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}