import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Users, Star, Award, TrendingUp, BookOpen, Globe, Zap } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Zap className="w-4 h-4" />
                  Transform Your Career Today
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900 mb-8">
                  Learn.
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Grow.
                  </span>
                  <span className="block text-gray-800">Succeed.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                  Join millions of learners mastering in-demand skills with expert-led courses, 
                  hands-on projects, and personalized career guidance.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {!isAuthenticated ? (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        Start Learning Free
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-10 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Continue Learning
                    </Button>
                  </Link>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">57M+</div>
                  <div className="text-sm text-gray-600 font-medium">Students Worldwide</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">213K+</div>
                  <div className="text-sm text-gray-600 font-medium">Expert Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">4.8★</div>
                  <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Main Feature Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative z-10">
                <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <Play className="w-20 h-20 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Featured Course Preview
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Experience our world-class content with interactive lessons, 
                  real-world projects, and expert mentorship.
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl py-4 font-semibold text-lg transition-all duration-300">
                  Watch Free Preview
                </Button>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-2xl p-4 shadow-lg rotate-12 transform hover:rotate-6 transition-transform duration-300">
                <Award className="w-8 h-8 text-yellow-800" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-green-400 rounded-2xl p-4 shadow-lg -rotate-12 transform hover:-rotate-6 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-green-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6" />
              <div>
                <span className="font-bold text-lg">Limited Time Offer!</span>
                <span className="ml-3 text-orange-100">Courses starting at ₹499. Sale ends in 2 days!</span>
              </div>
            </div>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300">
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Desired Career Academy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join millions of learners who trust us to help them reach their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert-Led Courses</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn from industry professionals with real-world experience in MERN, DevOps, AI/ML, and more.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Hands-on Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Build portfolio-worthy projects that demonstrate your skills to potential employers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Career Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized career guidance, resume reviews, and interview preparation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most in-demand course categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Web Development", courses: "15,000+", color: "from-blue-500 to-cyan-500" },
              { name: "Data Science", courses: "8,500+", color: "from-purple-500 to-pink-500" },
              { name: "Mobile Development", courses: "5,200+", color: "from-green-500 to-teal-500" },
              { name: "DevOps", courses: "3,800+", color: "from-orange-500 to-red-500" },
              { name: "Machine Learning", courses: "7,100+", color: "from-indigo-500 to-purple-500" },
              { name: "Cloud Computing", courses: "4,600+", color: "from-cyan-500 to-blue-500" },
              { name: "Cybersecurity", courses: "2,900+", color: "from-red-500 to-pink-500" },
              { name: "UI/UX Design", courses: "6,400+", color: "from-teal-500 to-green-500" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white transform group-hover:scale-105 transition-transform`}>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.courses} courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
