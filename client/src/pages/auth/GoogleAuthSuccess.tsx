import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('lms_user', JSON.stringify(user));
        
        // Update auth context by setting the full state
        const authState = {
          user: user,
          isAuthenticated: true,
          isLoading: false,
        };
        
        // Update auth context
        updateUser(user);
        
        toast({
          title: "Login successful",
          description: "Welcome to Desired Career Academy!",
        });
        
        // Navigate to onboarding for new users or dashboard for existing users
        navigate('/onboarding');
      } catch (error) {
        console.error('Error processing Google auth:', error);
        toast({
          title: "Authentication error",
          description: "There was an issue processing your Google login.",
          variant: "destructive",
        });
        navigate('/login');
      }
    } else {
      toast({
        title: "Authentication failed",
        description: "Google authentication was not successful.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [searchParams, updateUser, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Processing your Google login...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;