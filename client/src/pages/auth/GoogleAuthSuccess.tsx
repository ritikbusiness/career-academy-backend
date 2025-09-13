import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser, refreshToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleGoogleAuthSuccess = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        const errorMessage = searchParams.get('message') || 'Google authentication failed';
        toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store the access token
          localStorage.setItem('accessToken', token);
          
          // Fetch user profile with the new token
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              updateUser(data.data.user);
              
              toast({
                title: "Login successful",
                description: `Welcome ${data.data.user.name}! You've successfully signed in with Google.`,
              });
              
              navigate('/dashboard');
              return;
            }
          }
          
          throw new Error('Failed to fetch user profile');
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
        // No token or error parameter, try refresh token flow
        try {
          const refreshed = await refreshToken();
          if (refreshed) {
            toast({
              title: "Login successful",
              description: "Welcome back! You've successfully signed in with Google.",
            });
            navigate('/dashboard');
          } else {
            throw new Error('No valid authentication');
          }
        } catch (error) {
          toast({
            title: "Authentication failed",
            description: "Google authentication was not successful.",
            variant: "destructive",
          });
          navigate('/login');
        }
      }
    };

    handleGoogleAuthSuccess();
  }, [searchParams, updateUser, refreshToken, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Processing your Google login...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;