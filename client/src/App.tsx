import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Temporarily disable problematic imports for testing
// import { AuthProvider } from './contexts/AuthContext';
// import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import StudentCourses from './pages/StudentCourses';
import InstructorDashboard from './pages/InstructorDashboard';
import FeatureDemo from './pages/FeatureDemo';
import GamificationDemo from './pages/GamificationDemo';
import MonetizationDemo from './pages/MonetizationDemo';
import MobileAccessibilityDemo from './pages/MobileAccessibilityDemo';
import PeerHelpCenter from './pages/PeerHelpCenter';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import EmailVerificationForm from './components/auth/EmailVerificationForm';
import InstructorSignupWithToken from './components/auth/InstructorSignupWithToken';
import OnboardingForm from './components/auth/OnboardingForm';
import GoogleAuthSuccess from './pages/auth/GoogleAuthSuccess';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<div>Welcome to DesiredCareerAcademy</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
              <Route path="/signup" element={<div>Signup Page</div>} />
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
            {/* <Toaster /> */}
          </div>
        </Router>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}

export default App;