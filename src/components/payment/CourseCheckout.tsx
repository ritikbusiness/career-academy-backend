
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, Clock, Users } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Your Purchase
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Course Summary */}
          <div className="flex gap-4">
            <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">Course</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrolledCount} students
                </div>
                <Badge variant="outline">{course.level}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Course Price</span>
              <span className="font-semibold">{formatPrice(course.price)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>Included</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(course.price)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-3">Choose Payment Method</h4>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedPaymentMethod('stripe')}
                className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors ${
                  selectedPaymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Powered by Stripe</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPaymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === 'stripe' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('razorpay')}
                className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors ${
                  selectedPaymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">UPI/Cards/Wallets</div>
                    <div className="text-sm text-gray-600">Powered by Razorpay</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPaymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === 'razorpay' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Your payment information is secure and encrypted
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={selectedPaymentMethod === 'stripe' ? handleStripePayment : handleRazorpayPayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(course.price)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCheckout;
