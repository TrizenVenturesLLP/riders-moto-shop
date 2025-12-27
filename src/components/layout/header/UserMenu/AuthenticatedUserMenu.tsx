import { Link } from 'react-router-dom';
import { User, ShoppingCart, Heart, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthenticatedUserMenuProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export const AuthenticatedUserMenu = ({
  user,
  isOpen,
  onToggle,
  onLogout,
}: AuthenticatedUserMenuProps) => {
  return (
    <div className="relative" data-user-menu>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="hidden md:flex items-center space-x-2"
      >
        <UserCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {user.firstName}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {/* User Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate" title={user.email}>
                {user.email}
              </p>
            </div>
            
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={onToggle}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={onToggle}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Link>
            
            <Link
              to="/wishlist"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              onClick={onToggle}
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Link>
            
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


