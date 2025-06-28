
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowRight, Gift, Clock, Users, Award } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h1>
            <p className="text-green-100 text-lg">Welcome to your new learning journey</p>
          </div>
        </Card>

        {/* Course Info */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Course Enrolled</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex gap-6">
              <div className="w-32 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{course.title}</h3>
                <p className="text-slate-600 mb-4">{course.description}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Certificate included</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Instructor: {course.instructor.name}</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(transaction.amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 mb-8">
          <CardHeader className="border-b border-slate-100 px-8 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-500">Transaction ID</span>
                  <p className="font-mono text-slate-800 bg-slate-50 px-3 py-2 rounded-lg mt-1">{transaction.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Payment Method</span>
                  <p className="text-slate-800 font-semibold capitalize mt-1">{transaction.paymentMethod}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-500">Amount Paid</span>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(transaction.amount)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Date & Time</span>
                  <p className="text-slate-800 font-medium mt-1">{formatDate(transaction.completedAt || transaction.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">What's Next?</h4>
                <p className="text-slate-600">You now have lifetime access to this course and all its benefits!</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '✅ Lifetime access to course content',
                '✅ Mobile & desktop compatibility',
                '✅ Certificate of completion',
                '✅ Direct messaging with instructor',
                '✅ 30-day money-back guarantee',
                '✅ Access to student community'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-700">
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={onStartCourse}
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg"
          >
            Start Learning Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={onDownloadReceipt}
            className="flex-1 h-14 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border-0">
          <p className="text-slate-600 mb-2">Need help getting started?</p>
          <p className="text-sm text-slate-500">
            Contact our support team at <span className="font-semibold text-blue-600">support@learningplatform.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
