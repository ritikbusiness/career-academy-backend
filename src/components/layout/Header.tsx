
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ShoppingCart, Bell, User, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Desired Career Academy
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for anything..."
                className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Courses
            </Link>
            <Link to="/business" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Business
            </Link>
            <Link to="/teach" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Teach on DCA
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search icon */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {isAuthenticated && user ? (
              <>
                {/* Shopping Cart */}
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2 px-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.fullName}</span>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Dashboard
                      </Link>
                      <Link to="/my-learning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Learning
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Wishlist
                      </Link>
                      <Link to="/instructor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Instructor Dashboard
                      </Link>
                      <div className="border-t my-2"></div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Profile & Account
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white font-medium">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
