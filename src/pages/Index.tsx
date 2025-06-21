
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">Desired Career Academy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering students and professionals with industry-ready skills through comprehensive courses, 
            hands-on projects, and expert mentorship. Built by Kayago Solutions (AHRDSK).
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {!isAuthenticated ? (
              <>
                <Link to="/signup">
                  <Button size="lg" className="px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Expert-Led Courses</h3>
              <p className="text-gray-600">
                Learn from industry professionals with real-world experience in MERN, DevOps, AI/ML, and more.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Hands-on Projects</h3>
              <p className="text-gray-600">
                Build portfolio-worthy projects that demonstrate your skills to potential employers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Career Support</h3>
              <p className="text-gray-600">
                Get personalized career guidance, resume reviews, and interview preparation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
