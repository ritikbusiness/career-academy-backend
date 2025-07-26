import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">DC</div>
            <h1 className="text-2xl font-bold text-gray-900">DesiredCareerAcademy</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            🚀 Professional Career Development Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            DesiredCareerAcademy
            <span className="text-blue-600"> Learning Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your premier destination for professional skill development and career advancement. 
            Master in-demand skills with expert-led courses and hands-on projects.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Start Learning Now
            </Link>
            <Link to="/dashboard" className="inline-block px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise Features Built for Scale
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven educational methodologies
              to deliver exceptional learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Features */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">
                AI
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600 mb-4">
                Intelligent lesson summarization, practice question generation, 
                and personalized study assistance.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Auto-generated lesson summaries</li>
                <li>• Smart practice questions</li>
                <li>• AI study buddy chatbot</li>
                <li>• Skill gap analysis</li>
              </ul>
            </div>

            {/* Gamification */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamification Engine</h3>
              <p className="text-gray-600 mb-4">
                Boost engagement with XP systems, achievements, leaderboards, 
                and learning streaks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• XP points & level progression</li>
                <li>• Achievement badges</li>
                <li>• Global leaderboards</li>
                <li>• Learning streak tracking</li>
              </ul>
            </div>

            {/* Peer Help */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-2">Peer Help Center</h3>
              <p className="text-gray-600 mb-4">
                Collaborative learning through Q&A forums, peer ratings, 
                and reward systems.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Category-based Q&A</li>
                <li>• Dual rating system</li>
                <li>• Reward mechanisms</li>
                <li>• Expert recognition</li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive learning insights with progress tracking, 
                pattern analysis, and custom reports.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Progress visualization</li>
                <li>• Learning pattern analysis</li>
                <li>• Performance insights</li>
                <li>• Custom report generation</li>
              </ul>
            </div>

            {/* Course Management */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                📚
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Management</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive tools for creating, organizing, and delivering 
                structured learning content.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hierarchical course structure</li>
                <li>• Interactive assessments</li>
                <li>• Progress tracking</li>
                <li>• Certificate generation</li>
              </ul>
            </div>

            {/* Enterprise Security */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600 mb-4">
                Production-ready with JWT authentication, rate limiting, 
                and comprehensive logging.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• JWT authentication</li>
                <li>• Role-based access control</li>
                <li>• API rate limiting</li>
                <li>• Comprehensive logging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Status */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            System Status
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-600 mb-3">Backend API</h3>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                All enterprise features are ready
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">AI Services</h3>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-600 font-medium">Ready</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                DeepSeek AI integration active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and educators using our AI-powered platform 
            to achieve better learning outcomes.
          </p>
          <Link to="/register" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">AI</div>
            <span className="text-lg font-semibold">EduAI LMS</span>
          </div>
          <p className="text-gray-400">
            Enterprise Learning Management System with AI-Powered Features
          </p>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
            © 2025 EduAI LMS. Built with modern web technologies.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;