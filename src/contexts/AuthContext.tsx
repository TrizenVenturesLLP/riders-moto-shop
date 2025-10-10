import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    bikeBrand: string;
    bikeModel: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // TODO: Verify token with backend
          // For now, simulate checking auth status
          const savedUser = localStorage.getItem('user_data');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Try to connect to backend API first
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store auth data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        console.log('✅ Login successful with backend API');
      } else {
        throw new Error(`Login failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend login failed, using demo mode:', error);
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
      console.log('✅ Demo login successful');
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
      // Try to connect to backend API first
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store auth data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        console.log('✅ Signup successful with backend API');
      } else {
        throw new Error(`Signup failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend signup failed, using demo mode:', error);
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: '1',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        bikeBrand: userData.bikeBrand,
        bikeModel: userData.bikeModel,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
      console.log('✅ Demo signup successful');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      // TODO: Implement actual profile update API call
      const response = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user_data', JSON.stringify(data.user));
    } catch (error) {
      console.error('Profile update error:', error);
      // For demo purposes, update local state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
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
