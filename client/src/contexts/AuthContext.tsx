
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Mock API call - replace with actual API
    try {
      const mockUser: User = {
        id: '1',
        fullName: 'John Doe',
        email: email,
        role: 'student',
        domain: 'Engineering',
        branch: 'Computer Science',
        year: '2024',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('lms_user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Mock Google OAuth - replace with actual Google OAuth
    try {
      const mockUser: User = {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        domain: 'Engineering',
        branch: 'Computer Science',
        year: '2024',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('lms_user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('lms_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
