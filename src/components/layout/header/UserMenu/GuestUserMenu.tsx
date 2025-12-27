import { Link } from 'react-router-dom';
import { User, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestUserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const GuestUserMenu = ({
  isOpen,
  onToggle,
  isLoading = false,
}: GuestUserMenuProps) => {
  return (
    <div className="relative hidden md:block" data-user-menu>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-foreground hover:bg-accent flex items-center space-x-2"
        disabled={isLoading}
        onClick={onToggle}
      >
        <User className="h-5 w-5" />
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {/* Guest User Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">Guest</p>
              <p className="text-xs text-muted-foreground">Sign in to access your account</p>
            </div>
            
            <Link
              to="/wishlist"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={onToggle}
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Link>
            
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={onToggle}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


