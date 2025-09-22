import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-glow">
              Riders Moto Shop
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bike parts..."
                className="pl-10 bg-surface border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 py-4 border-t border-border">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Brakes</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Tires</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Engine Parts</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Accessories</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Deals</a>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bike parts..."
                  className="pl-10 bg-surface border-border"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <a href="#" className="block py-2 text-foreground hover:text-primary">Home</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Brakes</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Tires</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Engine Parts</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Accessories</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Deals</a>
              <Button variant="ghost" className="w-full justify-start mt-4">
                <User className="h-4 w-4 mr-2" />
                My Account
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;