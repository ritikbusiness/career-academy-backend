import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Redirect if no token
  React.useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      navigate('/forgot-password');
    }
  }, [token, navigate, toast]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one symbol');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast({
        title: "Password requirements not met",
        description: passwordErrors.join('. '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          token,
          newPassword: formData.newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Password reset successful",
          description: "Your password has been updated. You can now sign in with your new password.",
        });
        navigate('/login');
      } else {
        throw new Error(data.error || 'Password reset failed');
      }
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Please try again or request a new reset link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordErrors = validatePassword(formData.newPassword);
  const isPasswordValid = formData.newPassword.length > 0 && passwordErrors.length === 0;

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.newPassword.length > 0 && (
                <div className="text-xs space-y-1">
                  <div className={`flex items-center ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-300'}`} />
                    At least 6 characters
                  </div>
                  <div className={`flex items-center ${/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-300'}`} />
                    Contains a number
                  </div>
                  <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`w-3 h-3 mr-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-300'}`} />
                    Contains a symbol
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !isPasswordValid || formData.newPassword !== formData.confirmPassword}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Remember your password? </span>
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;