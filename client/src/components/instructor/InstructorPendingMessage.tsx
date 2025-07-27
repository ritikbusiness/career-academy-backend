import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Shield, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const InstructorPendingMessage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Clock className="w-16 h-16 text-yellow-600" />
                <div className="absolute -top-1 -right-1">
                  <Shield className="w-6 h-6 text-blue-600 bg-white rounded-full p-1" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Instructor Account Pending Approval</CardTitle>
            <CardDescription className="text-lg">
              Thank you for joining Desired Career Academy as an instructor!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">Your Application Status</h3>
              <div className="text-left space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-yellow-800">Application submitted successfully</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-yellow-800">Pending administrator review</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">You'll receive an email notification when approved</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
              <div className="text-left space-y-2 text-sm text-blue-800">
                <p>• Our administrators will review your qualifications and experience</p>
                <p>• This process typically takes 1-2 business days</p>
                <p>• Once approved, you'll gain full access to instructor features</p>
                <p>• You'll be able to create courses, manage students, and earn revenue</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">
                Logged in as: <strong>{user?.fullName}</strong> ({user?.email})
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Check Status
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Questions? Contact our support team at support@desiredcareeracademy.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorPendingMessage;