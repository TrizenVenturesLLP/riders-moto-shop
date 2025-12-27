import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useBikesByBrand } from '../hooks/useBikesByBrand';
import { getProductTypesForCategory } from '@/config/productTypes';
import { CollapsibleAccessoryCategory } from './CollapsibleAccessoryCategory';
import rmsLogo from '@/assets/rms-logo.jpg';
import rmsLogoDark from '@/assets/rms-logo-dark.png';
import navbarData from '@/data/navbar.json';
import { NavbarItem } from '@/types/navbar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const navigationData = navbarData.navbar;

// Main categories for accessories
const accessoryCategories = [
  { name: 'Touring Accessories', slug: 'touring-accessories' },
  { name: 'Protection Accessories', slug: 'protection-accessories' },
  { name: 'Performance Accessories', slug: 'performance-accessories' },
  { name: 'Auxiliary Accessories', slug: 'auxiliary-accessories' },
];

export const MobileMenu = ({ isOpen, onClose, onLogout }: MobileMenuProps) => {
  const [isShopByBikeOpen, setIsShopByBikeOpen] = useState(false);
  const [isShopByAccessoriesOpen, setIsShopByAccessoriesOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { totalItems } = useCart();
  const { bikesByBrand, isLoading: isLoadingBikes } = useBikesByBrand();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] md:hidden flex justify-start"
      onClick={onClose}
    >
      <div 
        className="w-4/5 bg-background flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b border-border flex-shrink-0">
          <button onClick={onClose} className="text-foreground hover:bg-accent rounded p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
          <Link to="/" onClick={onClose} className="flex items-center">
            <img 
              src={isDark ? rmsLogoDark : rmsLogo}
              alt="Riders Moto Shop" 
              className="h-10 max-h-10 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="w-6"></div>
        </div>

        {/* Content Container - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Auth Section - Mobile */}
          {isAuthenticated && user ? (
            <div className="bg-background px-4 py-4 border-b border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                  onClick={onClose}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                  onClick={onClose}
                >
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                  onClick={onClose}
                >
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="block w-full text-left py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-background px-4 py-4 border-b border-border">
              <div className="space-y-2">
                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (isLoading) return;
                    onClose();
                    navigate('/login');
                  }}
                  className="block w-full text-left py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (isLoading) return;
                    onClose();
                    navigate('/signup');
                  }}
                  className="block w-full text-left py-2 px-3 text-primary hover:text-primary/90 hover:bg-primary/10 rounded transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Main Menu Items */}
          <div className="bg-background px-4 py-4">
            {navigationData.map((item, index) => (
              <div key={index} className={`py-4 ${index > 0 ? 'border-t border-border' : ''}`}>
                {item.submenu ? (
                  <button
                    onClick={() => {
                      if (item.title === "Shop by Bike") setIsShopByBikeOpen(!isShopByBikeOpen);
                      else if (item.title === "Shop by Accessories") setIsShopByAccessoriesOpen(!isShopByAccessoriesOpen);
                    }}
                    className="w-full flex items-center justify-between text-left py-3 px-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                      (item.title === "Shop by Bike" && isShopByBikeOpen) ||
                      (item.title === "Shop by Accessories" && isShopByAccessoriesOpen) ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link 
                    to={item.link} 
                    className="block py-3 px-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </Link>
                )}
                
                {item.submenu && (
                  <div className={`mt-4 space-y-1 ${
                    (item.title === "Shop by Bike" && !isShopByBikeOpen) ||
                    (item.title === "Shop by Accessories" && !isShopByAccessoriesOpen) ? 'hidden' : ''
                  }`}>
                    {item.title === "Shop by Bike" ? (
                      isLoadingBikes ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="ml-2 text-sm text-muted-foreground">Loading bikes...</span>
                        </div>
                      ) : Object.keys(bikesByBrand).length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No bikes available
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(bikesByBrand).map(([brandKey, brandData]) => (
                            <div key={brandKey} className="space-y-1.5">
                              <h4 className="font-bold text-sm text-primary uppercase">{brandData.brandName}</h4>
                              <div className="space-y-0.5 pl-2">
                                {brandData.bikes
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((bike) => (
                                    <Link
                                      key={bike.id}
                                      to={`/collections/bikes/${bike.slug}`}
                                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                                      onClick={onClose}
                                    >
                                      {bike.name}
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : item.title === "Shop by Accessories" ? (
                      <div className="space-y-1">
                        {item.submenu.map((subItem: NavbarItem, subIndex: number) => (
                          <div key={subIndex}>
                            {subItem.submenu ? (
                              <CollapsibleAccessoryCategory 
                                title={subItem.title}
                                accessories={subItem.submenu}
                              />
                            ) : subItem.link ? (
                              <Link
                                to={subItem.link}
                                className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={onClose}
                              >
                                {subItem.title}
                              </Link>
                            ) : (
                              <div className="py-1 text-sm text-muted-foreground">
                                {subItem.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : item.title === "Scooters" ? (
                      <div className="space-y-1">
                        {item.submenu.map((scooter: NavbarItem) => (
                          <Link
                            key={scooter.title}
                            to={scooter.link || '#'}
                            className="block py-2 px-3 text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                            onClick={onClose}
                          >
                            {scooter.title}
                          </Link>
                        ))}
                      </div>
                    ) : item.title === "EV Bikes" ? (
                      <div className="space-y-1">
                        {item.submenu.map((brand: NavbarItem) => (
                          <CollapsibleAccessoryCategory
                            key={brand.title}
                            title={brand.title}
                            accessories={brand.submenu || []}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {item.submenu.map((subItem: NavbarItem, subIndex: number) => (
                          <div key={subIndex}>
                            {subItem.submenu ? (
                              <CollapsibleAccessoryCategory 
                                title={subItem.title}
                                accessories={subItem.submenu}
                              />
                            ) : subItem.link ? (
                              <Link
                                to={subItem.link}
                                className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={onClose}
                              >
                                {subItem.title}
                              </Link>
                            ) : (
                              <div className="py-1 text-sm text-muted-foreground">
                                {subItem.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Apparels Link - Mobile */}
            <div className="py-4 border-t border-border">
              <Link 
                to="/apparels" 
                className="block py-3 px-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={onClose}
              >
                <h3 className="text-lg font-semibold">Apparels</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

