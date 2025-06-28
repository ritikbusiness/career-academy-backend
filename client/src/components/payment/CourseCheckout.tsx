
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, Clock, Users, Star, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { Course } from '@/types/course';
import { PaymentTransaction } from '@/types/payment';

interface CourseCheckoutProps {
  course: Course;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
  onCancel: () => void;
}

const CourseCheckout: React.FC<CourseCheckoutProps> = ({ course, onPaymentSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');

  const handleStripePayment = async () => {
    setIsProcessing(true);
    
    try {
      // TODO: connect to backend - create Stripe checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price,
          currency: 'usd'
        })
      });

      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    try {
      // TODO: connect to backend - create Razorpay order
      const response = await fetch('/api/payment/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price * 100, // Razorpay expects amount in paise
          currency: 'INR'
        })
      });

      const { orderId } = await response.json();
      
      // TODO: Initialize Razorpay checkout
      const options = {
        key: 'RAZORPAY_KEY_ID', // TODO: get from environment
        amount: course.price * 100,
        currency: 'INR',
        name: 'Learning Platform',
        description: course.title,
        order_id: orderId,
        handler: function(response: any) {
          // TODO: verify payment on backend
          const transaction: PaymentTransaction = {
            id: Date.now().toString(),
            courseId: course.id,
            userId: 'current-user-id',
            amount: course.price,
            currency: 'INR',
            status: 'completed',
            paymentMethod: 'razorpay',
            razorpayOrderId: response.razorpay_order_id,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          };
          onPaymentSuccess(transaction);
        },
        prefill: {
          name: 'Student Name', // TODO: get from user context
          email: 'student@example.com',
        }
      };

      // const rzp = new (window as any).Razorpay(options);
      // rzp.open();
      
    } catch (error) {
      console.error('Razorpay error:', error);
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Purchase</h1>
          <p className="text-slate-600">You're one step away from accessing this amazing course</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-sm border-0 mb-6">
              <CardHeader className="border-b border-slate-100 px-6 py-6">
                <CardTitle className="text-lg font-semibold text-slate-800">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{course.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledCount} students</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{course.level}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="bg-white rounded-2xl shadow-sm border-0 mb-6">
              <CardHeader className="border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Lifetime access to course content',
                    'Mobile and desktop access',
                    'Certificate of completion',
                    'Direct messaging with instructor',
                    '30-day money-back guarantee',
                    'Access to student community'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader className="border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Choose Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedPaymentMethod('stripe')}
                    className={`w-full p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedPaymentMethod === 'stripe'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-800">Credit/Debit Card</div>
                          <div className="text-sm text-slate-600">Secure payment via Stripe</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                        selectedPaymentMethod === 'stripe'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {selectedPaymentMethod === 'stripe' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('razorpay')}
                    className={`w-full p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedPaymentMethod === 'razorpay'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-800">UPI/Cards/Wallets</div>
                          <div className="text-sm text-slate-600">Multiple options via Razorpay</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                        selectedPaymentMethod === 'razorpay'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {selectedPaymentMethod === 'razorpay' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl shadow-lg border-0 sticky top-4">
              <CardHeader className="border-b border-slate-100 px-6 py-6">
                <CardTitle className="text-lg font-semibold text-slate-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Course Price</span>
                    <span className="font-semibold text-slate-800">{formatPrice(course.price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="text-slate-500">Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(course.price)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={selectedPaymentMethod === 'stripe' ? handleStripePayment : handleRazorpayPayment}
                    disabled={isProcessing}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg"
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        Pay {formatPrice(course.price)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="w-full h-12 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    Secure SSL encrypted payment
                  </span>
                </div>

                <div className="text-center text-xs text-slate-500">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
