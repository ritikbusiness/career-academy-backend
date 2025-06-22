
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Users, Star, Award, TrendingUp } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Learn Without
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Limits
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Start, switch, or advance your career with more than 5,000 courses, 
                Professional Certificates, and degrees from world-class universities and companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {!isAuthenticated ? (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
                        Start Learning Today
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg">
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span>57M+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>4.8 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>213K+ Courses</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Featured Course Preview
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  Get a sneak peek at our most popular course content
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Watch Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6" />
              <div>
                <span className="font-semibold">Limited Time Offer!</span>
                <span className="ml-2">Courses starting at ₹499. Ends in 2 days!</span>
              </div>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
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
      <div className="py-24">
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
