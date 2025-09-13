import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  provider: string;
  imageUrl?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
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

const API_BASE = '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Refresh access token using httpOnly refresh cookie
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Include httpOnly refresh cookie
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data.accessToken) {
          // Store new access token in memory
          setAuthState({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Store access token for API calls
          localStorage.setItem('accessToken', data.data.accessToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        // Try to get user profile with existing token
        try {
          const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setAuthState({
                user: data.data.user,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            }
          }
        } catch (error) {
          console.error('Profile fetch failed:', error);
        }
      }

      // Try to refresh token if no valid access token
      const refreshed = await refreshToken();
      if (!refreshed) {
        // No valid refresh token, user needs to log in
        localStorage.removeItem('accessToken');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    initAuth();
  }, []);

  // Clear any cached test data with john@example.com
  useEffect(() => {
    const clearTestData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.email === 'john@example.com') {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            console.log('Cleared cached test user data');
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    };
    clearTestData();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      if (data.success && data.data.accessToken) {
        // Store access token
        localStorage.setItem('accessToken', data.data.accessToken);
        
        setAuthState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: string = 'student'): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password, name, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      if (data.success && data.data.accessToken) {
        // Store access token
        localStorage.setItem('accessToken', data.data.accessToken);
        
        setAuthState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const loginWithGoogle = (): void => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint to revoke refresh token
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('accessToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};