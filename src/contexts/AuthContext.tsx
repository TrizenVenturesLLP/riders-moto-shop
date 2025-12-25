import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackEvent } from '@/hooks/useAnalytics';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bikeBrand?: string;
  bikeModel?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    bikeBrand: string;
    bikeModel: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getActiveSessions: () => Promise<any[]>;
  logoutAllSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount (localStorage-based for testing)
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user_data');
        const savedToken = localStorage.getItem('auth_token');
        
        if (savedUser && savedToken) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            console.log('✅ Restored user from localStorage');
          } catch (e) {
            console.error('Failed to parse user data:', e);
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setIsLoading(true);
    try {
      // DISABLED: API call for testing - using localStorage instead
      // const response = await fetch(`${API_BASE_URL}/customer/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify({ email, password, rememberMe }),
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For testing: Accept any email/password combination
      // In production, this would validate against backend
      const mockUser: User = {
        id: `user_${Date.now()}`,
        firstName: email.split('@')[0].split('.')[0] || 'John',
        lastName: email.split('@')[0].split('.')[1] || 'Doe',
        email: email,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      const token = `demo_token_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      if (rememberMe) {
        localStorage.setItem('refresh_token', `demo_refresh_${Date.now()}`);
      }
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
      console.log('✅ Login successful (localStorage mode)');
      
      // Track login event
      trackEvent('login', {
        metadata: {
          loginMethod: 'email',
          rememberMe: rememberMe || false,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    bikeBrand: string;
    bikeModel: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      // DISABLED: API call for testing - using localStorage instead
      // const response = await fetch(`${API_BASE_URL}/customer/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(userData),
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user already exists (in localStorage for testing)
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      if (existingUsers.some((u: any) => u.email === userData.email)) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        bikeBrand: userData.bikeBrand,
        bikeModel: userData.bikeModel,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      const token = `demo_token_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', `demo_refresh_${Date.now()}`);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      // Also store in demo_users list for duplicate checking
      existingUsers.push({ email: userData.email, id: newUser.id });
      localStorage.setItem('demo_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      console.log('✅ Signup successful (localStorage mode)');
      
      // Track signup event
      trackEvent('signup', {
        metadata: {
          bikeBrand: userData.bikeBrand,
          bikeModel: userData.bikeModel,
          source: 'web',
        },
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // DISABLED: API call for testing
      // await fetch(`${API_BASE_URL}/customer/auth/logout`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
    console.log('✅ Logout successful (localStorage mode)');
  };

  const getActiveSessions = async (): Promise<any[]> => {
    // DISABLED: API call for testing
    // Return empty array for now
    return [];
  };

  const logoutAllSessions = async (): Promise<void> => {
    // DISABLED: API call for testing
    // Just logout current session
    await logout();
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      // DISABLED: API call for testing - using localStorage instead
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user data locally
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      console.log('✅ Profile updated successfully (localStorage mode)');
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Profile update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    getActiveSessions,
    logoutAllSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

    signup,
    logout,
    updateProfile,
    getActiveSessions,
    logoutAllSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
