import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { trackEvent } from '@/hooks/useAnalytics';
import { API_BASE_URL } from '@/config/api';

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
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getActiveSessions: () => Promise<any[]>;
  logoutAllSessions: () => Promise<void>;
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
        // Verify token by fetching user profile (cookies sent automatically)
        const response = await fetch(`${API_BASE_URL}/customer/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include httpOnly cookies
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.user) {
            setUser(result.data.user);
            // Store user data in localStorage for analytics (userId needed)
            localStorage.setItem('user_data', JSON.stringify(result.data.user));
            console.log('✅ Restored user from cookie');
          } else {
            setUser(null);
            localStorage.removeItem('user_data');
          }
        } else {
          // Token invalid or expired
          setUser(null);
          localStorage.removeItem('user_data');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('🔐 Attempting login to:', `${API_BASE_URL}/customer/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/customer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include httpOnly cookies
        body: JSON.stringify({ email, password, rememberMe }),
      });

      console.log('📡 Login response status:', response.status, response.statusText);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok || !result.success) {
        console.error('❌ Login failed:', result);
        
        // If there are validation errors, show them
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          const errorMessages = result.errors.map((err: any) => err.message).join(', ');
          throw new Error(`Validation error: ${errorMessages}`);
        }
        
        throw new Error(result.message || 'Login failed. Please try again.');
      }

      // Tokens are in httpOnly cookies, just store user data
      const userData = result.data.user;
      setUser(userData);
      // Store user data in localStorage for analytics (userId needed)
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      console.log('✅ Login successful, user:', userData.email);
      
      // Track login event
      trackEvent('login', {
        metadata: {
          loginMethod: 'email',
          rememberMe: rememberMe || false,
        },
      });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      // Provide more specific error messages
      if (error.message) {
        throw new Error(error.message);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check your connection.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
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
      console.log('🔐 Attempting signup to:', `${API_BASE_URL}/customer/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/customer/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include httpOnly cookies
        body: JSON.stringify(userData),
      });

      console.log('📡 Signup response status:', response.status, response.statusText);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok || !result.success) {
        console.error('❌ Signup failed:', result);
        throw new Error(result.message || 'Signup failed. Please try again.');
      }

      // Tokens are in httpOnly cookies, just store user data
      const newUser = result.data.user;
      setUser(newUser);
      // Store user data in localStorage for analytics (userId needed)
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      console.log('✅ Signup successful, user:', newUser.email);
      
      // Track signup event
      trackEvent('signup', {
        metadata: {
          bikeBrand: userData.bikeBrand,
          bikeModel: userData.bikeModel,
          source: 'web',
        },
      });
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      // Provide more specific error messages
      if (error.message) {
        throw new Error(error.message);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check your connection.');
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('🔐 Attempting Google sign-in...');
      
      // Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      console.log('✅ Firebase authentication successful, sending token to backend...');
      
      // Send Firebase ID token to your backend
      const response = await fetch(`${API_BASE_URL}/customer/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include httpOnly cookies
        body: JSON.stringify({ idToken }),
      });

      console.log('📡 Google sign-in response status:', response.status, response.statusText);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let apiResult;
      
      if (contentType && contentType.includes('application/json')) {
        apiResult = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok || !apiResult.success) {
        console.error('❌ Google sign-in failed:', apiResult);
        throw new Error(apiResult.message || 'Google sign-in failed. Please try again.');
      }

      // Tokens are in httpOnly cookies, just store user data
      const userData = apiResult.data.user;
      setUser(userData);
      // Store user data in localStorage for analytics
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      console.log('✅ Google sign-in successful, user:', userData.email);
      
      // Track login event
      trackEvent('login', {
        metadata: {
          loginMethod: 'google',
        },
      });
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      
      // Handle Firebase-specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint to clear httpOnly cookies
      await fetch(`${API_BASE_URL}/customer/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API fails
    }
    
    // Clear local storage
    localStorage.removeItem('user_data');
    setUser(null);
    console.log('✅ Logout successful');
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
      const response = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Cookies sent automatically
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Profile update failed. Please try again.');
      }

      // Update user data
      const updatedUser = result.data.user;
      setUser(updatedUser);
      // Update localStorage for analytics
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      console.log('✅ Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Profile update failed. Please try again.');
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
    signInWithGoogle,
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
