import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

const EmailVerificationForm = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
  const [searchParams] = useSearchParams();
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          if (data.data.alreadyVerified) {
            setVerificationStatus('already-verified');
          } else {
            setVerificationStatus('success');
            toast({
              title: "Email verified successfully!",
              description: "Your account is now fully activated.",
            });
          }
        } else {
          setVerificationStatus('error');
          toast({
            title: "Verification failed",
            description: data.error || "The verification link is invalid or has expired.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: "There was an error verifying your email. Please try again.",
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [token, toast]);

  const handleResendVerification = async () => {
    const email = prompt("Please enter your email address to resend verification:");
    if (!email) return;

    setResendLoading(true);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Verification email sent",
          description: "Please check your email for new verification instructions.",
        });
      } else {
        throw new Error(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      toast({
        title: "Resend failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verifying Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </>
        );
        
      case 'success':
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You can now access all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Continue to Dashboard
              </Button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Sign in to your account
                </Link>
              </div>
            </CardContent>
          </>
        );
        
      case 'already-verified':
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Already Verified</CardTitle>
              <CardDescription>
                Your email address has already been verified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Continue to Dashboard
              </Button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Sign in to your account
                </Link>
              </div>
            </CardContent>
          </>
        );
        
      case 'error':
      default:
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verification Failed</CardTitle>
              <CardDescription>
                The verification link is invalid, expired, or has already been used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Need a new verification email?</p>
                    <p className="mt-1">Click the button below to resend verification instructions to your email.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleResendVerification} 
                className="w-full"
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend Verification Email"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        {renderContent()}
      </Card>
    </div>
  );
};

export default EmailVerificationForm;