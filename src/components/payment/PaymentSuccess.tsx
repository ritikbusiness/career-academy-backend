
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { PaymentTransaction } from '@/types/payment';
import { Course } from '@/types/course';

interface PaymentSuccessProps {
  transaction: PaymentTransaction;
  course: Course;
  onStartCourse: () => void;
  onDownloadReceipt: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transaction,
  course,
  onStartCourse,
  onDownloadReceipt
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: transaction.currency.toUpperCase()
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <p className="text-gray-600">You've successfully enrolled in the course</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm">{course.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">Instructor: {course.instructor.name}</span>
              <span className="font-semibold">{formatPrice(transaction.amount)}</span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <h4 className="font-semibold">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Transaction ID</span>
                <p className="font-mono">{transaction.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method</span>
                <p className="capitalize">{transaction.paymentMethod}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount Paid</span>
                <p className="font-semibold">{formatPrice(transaction.amount)}</p>
              </div>
              <div>
                <span className="text-gray-600">Date & Time</span>
                <p>{formatDate(transaction.completedAt || transaction.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You now have lifetime access to this course</li>
              <li>• Start learning immediately or save for later</li>
              <li>• Download your receipt for tax purposes</li>
              <li>• Access course materials anytime from your dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onDownloadReceipt}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button
              onClick={onStartCourse}
              className="flex-1 flex items-center justify-center gap-2"
            >
              Start Course Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact our support team at support@learningplatform.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
