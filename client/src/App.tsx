import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import StudentCourses from './pages/StudentCourses';
import InstructorDashboard from './pages/InstructorDashboard';
import FeatureDemo from './pages/FeatureDemo';
import GamificationDemo from './pages/GamificationDemo';
import MonetizationDemo from './pages/MonetizationDemo';
import MobileAccessibilityDemo from './pages/MobileAccessibilityDemo';
import PeerHelpCenter from './pages/PeerHelpCenter';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import InstructorSignupWithToken from './components/auth/InstructorSignupWithToken';
import OnboardingForm from './components/auth/OnboardingForm';

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
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/instructor-signup" element={<InstructorSignupWithToken />} />
              <Route path="/onboarding" element={<OnboardingForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/features" element={<FeatureDemo />} />
              <Route path="/gamification" element={<GamificationDemo />} />
              <Route path="/monetization" element={<MonetizationDemo />} />
              <Route path="/mobile-accessibility" element={<MobileAccessibilityDemo />} />
              <Route path="/peer-help" element={<PeerHelpCenter />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;