
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import OnboardingForm from "@/components/auth/OnboardingForm";
import Dashboard from "@/pages/Dashboard";
import StudentCourses from "@/pages/StudentCourses";
import InstructorDashboard from "@/pages/InstructorDashboard";
import PeerHelpCenter from "@/pages/PeerHelpCenter";
import FeatureDemo from "@/pages/FeatureDemo";
import GamificationDemo from "@/pages/GamificationDemo";
import MobileAccessibilityDemo from "@/pages/MobileAccessibilityDemo";
import MonetizationDemo from "@/pages/MonetizationDemo";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <StudentCourses />
            </ProtectedRoute>
          } />
          <Route path="/instructor" element={
            <ProtectedRoute requiredRole="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/peer-help" element={
            <ProtectedRoute>
              <PeerHelpCenter />
            </ProtectedRoute>
          } />
          
          {/* Demo Pages */}
          <Route path="/demo/features" element={<FeatureDemo />} />
          <Route path="/demo/gamification" element={<GamificationDemo />} />
          <Route path="/demo/mobile-accessibility" element={<MobileAccessibilityDemo />} />
          <Route path="/demo/monetization" element={<MonetizationDemo />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
