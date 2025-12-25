import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoginPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is not logged in and modal hasn't been shown yet
    if (!user && !hasShown) {
      // Show modal after 10 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [user, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleSignup = () => {
    setIsOpen(false);
    navigate('/signup');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border-2 border-border rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Welcome to <span className="text-primary">Riders Moto Shop</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Sign in to unlock exclusive features, track your orders, save your favorite products, and enjoy a personalized shopping experience!
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-6 space-y-2">
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Track your orders in real-time</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Save products to your wishlist</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Get personalized recommendations</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Faster checkout with saved addresses</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-none shadow-none transition-all duration-300"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login to Your Account
            </Button>
            
            <Button
              onClick={handleSignup}
              variant="outline"
              className="w-full border-2 border-border hover:bg-accent font-semibold py-6 rounded-none transition-all duration-300"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create New Account
            </Button>
          </div>

          {/* Continue Browsing */}
          <div className="mt-4 text-center">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Continue browsing without login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPromptModal;


