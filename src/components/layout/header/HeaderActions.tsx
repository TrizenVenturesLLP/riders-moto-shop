import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthenticatedUserMenu } from './UserMenu/AuthenticatedUserMenu';
import { GuestUserMenu } from './UserMenu/GuestUserMenu';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface HeaderActionsProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const HeaderActions = ({
  isUserMenuOpen,
  setIsUserMenuOpen,
  onLogout,
}: HeaderActionsProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated && user ? (
        <AuthenticatedUserMenu
          user={user}
          isOpen={isUserMenuOpen}
          onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          onLogout={onLogout}
        />
      ) : (
        <GuestUserMenu
          isOpen={isUserMenuOpen}
          onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isLoading={isLoading}
        />
      )}
      
      {/* Theme Toggle - Mobile and Desktop */}
      <div className="flex items-center">
        <ThemeToggle />
      </div>
      
      {/* Cart Icon - Only visible when logged in */}
      {isAuthenticated && (
        <Link to="/cart">
          <Button variant="ghost" size="sm" className="relative text-foreground hover:bg-accent">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </Link>
      )}
    </div>
  );
};


