import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Wrench, Shield, Zap, Settings, Headphones, Camera, Lock, Star, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import navbarData from '@/data/navbar.json';
import mobileMenuBg from '@/assets/mobile-menu-bg.jpg';
import rmsLogo from '@/assets/rms-logo.jpg';
import { NavbarItem } from '@/types/navbar';

// Collapsible Accessory Category Component
const CollapsibleAccessoryCategory = ({ title, accessories }: {
  title: string;
  accessories: NavbarItem[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAccessoryClick = (accessory: NavbarItem) => {
    if (accessory.link) {
      navigate(accessory.link);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 px-2 bg-muted rounded-lg hover:bg-accent transition-colors"
      >
        <h5 className="font-medium text-foreground">{title}</h5>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 pl-3 space-y-1">
          {accessories.map((accessory, accIndex: number) => (
            <div key={accIndex}>
              {accessory.link ? (
                <button
                  onClick={() => handleAccessoryClick(accessory)}
                  className="block w-full text-left py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {accessory.title}
                </button>
              ) : (
                <div className="py-1 text-xs text-muted-foreground/60">
                  {accessory.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile Dropdown Component
const MobileDropdown = ({ title, data }: {
  title: string;
  data: NavbarItem[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-3 px-4 bg-muted rounded-lg hover:bg-accent transition-colors"
      >
        <span className="text-base font-medium text-foreground">{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            {data.map((item: NavbarItem, index: number) => (
              <div key={index}>
                {/* If item has submenu, show clickable title + expandable submenu */}
                {item.submenu ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {item.link ? (
                        <Link
                          to={item.link}
                          className="font-semibold text-primary hover:text-primary/90 transition-colors"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <h4 className="font-semibold text-primary">{item.title}</h4>
                      )}
                    </div>
                    <div className="pl-3 space-y-2">
                      {item.submenu.map((subItem: NavbarItem, subIndex: number) => (
                        <div key={subIndex}>
                          {subItem.submenu ? (
                            <CollapsibleAccessoryCategory 
                              title={subItem.title}
                              accessories={subItem.submenu}
                            />
                          ) : subItem.link ? (
                            <button
                              onClick={() => navigate(subItem.link!)}
                              className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {subItem.title}
                            </button>
                          ) : (
                            <div className="py-1 text-sm text-muted-foreground">
                              {subItem.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : item.link ? (
                  <Link
                    to={item.link}
                    className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className="py-2 px-3 text-foreground">
                    {item.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation data from JSON
const navigationData = navbarData.navbar;

// Helper function to get appropriate icon for accessory categories
const getAccessoryIcon = (categoryTitle: string) => {
  const title = categoryTitle.toLowerCase();
  if (title.includes('protection') || title.includes('safety') || title.includes('guard')) return Shield;
  if (title.includes('performance') || title.includes('exhaust') || title.includes('engine')) return Zap;
  if (title.includes('tool') || title.includes('maintenance') || title.includes('repair')) return Wrench;
  if (title.includes('audio') || title.includes('sound') || title.includes('speaker')) return Headphones;
  if (title.includes('camera') || title.includes('recording') || title.includes('dash')) return Camera;
  if (title.includes('security') || title.includes('alarm') || title.includes('lock')) return Lock;
  if (title.includes('premium') || title.includes('luxury') || title.includes('special')) return Star;
  return Settings; // Default icon
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopByBikeOpen, setIsShopByBikeOpen] = useState(false);
  const [isShopByAccessoriesOpen, setIsShopByAccessoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { totalItems } = useCart();

  // Debug authentication state
  console.log('Header - Auth state:', { isAuthenticated, isLoading, user: user?.email });

  // Using static navigation data from JSON

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results with query and category
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(searchCategory)}`);
    } else {
      // If no search query, navigate based on category
      if (searchCategory === 'All') {
        navigate('/collections/all');
      } else if (searchCategory === 'Bikes') {
        navigate('/collections/bikes');
      } else if (searchCategory === 'Accessories') {
        navigate('/collections/accessories');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-user-menu]')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Handle scroll - hide blue bar and reduce top bar size when scrolling down
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;
    
    const handleScroll = () => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce scroll events to prevent rapid state changes
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastKnownScrollY;
        
        // Only show bottom bar when at absolute top (0px or very close to 0)
        setIsScrolledDown((prev) => {
          // Only show when at absolute top (within 5px)
          if (currentScrollY <= 5) {
            if (prev === false) return prev; // Already showing, no change needed
            lastKnownScrollY = currentScrollY;
            return false;
          }
          
          // Any scroll down - hide immediately
          if (scrollDelta > 0) {
            if (prev === true) return prev; // Already hidden, no change needed
            lastKnownScrollY = currentScrollY;
            return true;
          }
          
          // Scrolling up but not at top - keep hidden
          if (scrollDelta < 0 && currentScrollY > 5) {
            if (prev === true) return prev; // Already hidden, no change needed
            lastKnownScrollY = currentScrollY;
            return true;
          }
          
          // No change needed
          return prev;
        });
        
        lastKnownScrollY = currentScrollY;
      }, 50); // 50ms debounce to prevent rapid updates
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      {/* Main Header - White Background - Reduces size when scrolled */}
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-[height] duration-300 ease-in-out ${
          isScrolledDown ? 'h-16' : 'h-24'
        }`}>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground hover:bg-accent rounded p-1 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src={rmsLogo}
                alt="Riders Moto Shop" 
                className={`h-auto transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 ${
                  isScrolledDown ? 'max-h-14' : 'max-h-20'
                }`}
              />
            </Link>
          </div>

          {/* Search Bar - Desktop - Enhanced Design */}
          <div className={`hidden md:flex flex-1 mx-8 transition-all duration-300 ${
            isScrolledDown ? 'max-w-xl' : 'max-w-2xl'
          }`}>
            <div className="flex w-full border-2 border-border hover:border-primary/50 focus-within:border-primary rounded-none overflow-hidden bg-card transition-all duration-300">
              {/* Category Filter */}
              <div className="relative">
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className={`px-3 pr-7 bg-muted/50 hover:bg-muted border-0 border-r-2 border-border text-foreground font-medium focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-all duration-300 w-24 ${
                    isScrolledDown ? 'py-1.5 text-xs h-9' : 'py-3 text-sm h-12'
                  }`}
                >
                  <option value="All">All</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground transition-all duration-300 ${
                  isScrolledDown ? 'h-3 w-3' : 'h-4 w-4'
                }`} />
              </div>
              
              {/* Search Input */}
              <div className="relative flex-1 bg-background">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What are you looking for?"
                  className={`rounded-none border-0 bg-transparent focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 font-normal placeholder:text-muted-foreground/60 transition-all duration-300 ${
                    isScrolledDown ? 'h-9 text-xs' : 'h-12 text-sm'
                  }`}
                />
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className={`bg-primary hover:bg-primary/90 active:bg-primary/80 rounded-none flex items-center justify-center border-0 focus:ring-0 focus-visible:ring-0 font-semibold transition-all duration-300 shadow-none ${
                  isScrolledDown ? 'px-5 h-9 w-12' : 'px-6 h-12 w-14'
                }`}
              >
                <Search className={`text-primary-foreground transition-all duration-300 ${
                  isScrolledDown ? 'h-4 w-4' : 'h-5 w-5'
                }`} />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="relative" data-user-menu>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center space-x-2"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user?.firstName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Orders
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Non-authenticated User Button
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex text-foreground hover:bg-accent"
                disabled={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  console.log('Account icon clicked, navigating to login');
                  try {
                    navigate('/login');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    // Fallback to window.location if navigate fails
                    window.location.href = '/login';
                  }
                }}
              >
                <User className="h-5 w-5" />
              </Button>
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
        </div>
      </div>

      {/* Navigation - Desktop - Full Width - Hide when scrolled down */}
      <div className={`hidden md:flex items-center py-1.5 bg-background border-t border-border w-full transition-[transform,opacity,height] duration-300 ease-in-out ${
        isScrolledDown ? '-translate-y-full opacity-0 h-0 overflow-hidden pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className="container mx-auto px-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {navigationData.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.submenu ? (
                    <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium text-sm bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent rounded-none px-3 py-1.5 h-auto">
                      {item.title}
                    </NavigationMenuTrigger>
                  ) : (
                    <Link 
                      to={item.link}
                      className="text-foreground hover:text-primary transition-colors px-3 py-1.5 font-medium text-sm"
                    >
                      {item.title}
                    </Link>
                  )}
                  
                  {item.submenu && (
                    <NavigationMenuContent>
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-popover">
                        {item.title === "Shop by Bike" ? (
                          <div className="grid grid-cols-4 gap-8 p-6 w-[900px] bg-popover">
                            {item.submenu.map((brand) => (
                              <div key={brand.title} className="space-y-2">
                                <h4 className="font-bold text-base text-primary uppercase">{brand.title}</h4>
                                <div className="space-y-1">
                                  {brand.submenu?.map((model) => (
                                    <div key={model.title} className="group relative">
                                      <Link
                                        to={model.link}
                                        className="block text-sm text-popover-foreground hover:text-primary transition-colors py-0.5"
                                      >
                                        {model.title}
                                      </Link>
                                      {/* Show accessories submenu on hover - with gap for mouse movement */}
                                      {model.submenu && (
                                        <div className="hidden group-hover:block absolute left-full top-0 ml-2 bg-card border border-border rounded shadow-md p-4 min-w-[280px] z-[100]">
                                          {/* Invisible hover bridge to maintain hover when moving to nested menu */}
                                          <div className="absolute -left-2 top-0 w-2 h-full"></div>
                                          <div className="space-y-2 relative">
                                            {model.submenu.map((accessoryCategory) => (
                                              <div key={accessoryCategory.title} className="group/accessory relative">
                                                <Link
                                                  to={accessoryCategory.link}
                                                  className="block text-sm font-semibold text-primary hover:text-primary/90 transition-colors py-1 pr-3"
                                                >
                                                  {accessoryCategory.title}
                                                </Link>
                                                {/* Show individual accessories on hover - positioned beside category */}
                                                {accessoryCategory.submenu && (
                                                  <div className="hidden group-hover/accessory:block absolute left-full top-0 -ml-1 bg-card border border-border rounded shadow-md p-3 min-w-[220px] z-[100]">
                                                    {/* Invisible hover bridge */}
                                                    <div className="absolute -left-1 top-0 w-1 h-full"></div>
                                                    <div className="space-y-1 relative">
                                                      {accessoryCategory.submenu.map((individualAccessory) => (
                                                        <Link
                                                          key={individualAccessory.title}
                                                          to={individualAccessory.link}
                                                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded hover:bg-accent"
                                                        >
                                                          {individualAccessory.title}
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : item.title === "Shop by Accessories" ? (
                          <div className="grid grid-cols-3 gap-8 p-8 w-[900px]">
                            {item.submenu.map((category) => {
                              const IconComponent = getAccessoryIcon(category.title);
                              return (
                                <div key={category.title} className="group">
                                  {/* Category Header */}
                                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                      <IconComponent className="h-5 w-5 text-primary" />
                                    </div>
                                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                      {category.title}
                                    </h4>
                                  </div>
                                  
                                  {/* Accessory Items */}
                                  <div className="space-y-2">
                                    {category.submenu?.map((accessoryItem) => (
                                      <Link
                                        key={accessoryItem.title}
                                        to={accessoryItem.link}
                                        className="block text-sm text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded-lg transition-all duration-200 group/item"
                                      >
                                        <span className="group-hover/item:translate-x-1 transition-transform inline-block">
                                          {accessoryItem.title}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : item.title === "Scooters" ? (
                          <div className="grid grid-cols-2 gap-4 p-6 w-[400px]">
                            {item.submenu.map((scooter) => (
                              <a
                                key={scooter.title}
                                href={scooter.link}
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-accent"
                              >
                                {scooter.title}
                              </a>
                            ))}
                          </div>
                        ) : item.title === "EV Bikes" ? (
                          <div className="grid grid-cols-1 gap-4 p-6 w-[300px]">
                            {item.submenu.map((brand) => (
                              <div key={brand.title} className="space-y-2">
                                <h4 className="font-semibold text-sm text-primary">{brand.title}</h4>
                                <div className="space-y-1">
                                  {brand.submenu?.map((model) => (
                                    <a
                                      key={model.title}
                                      href={model.link}
                                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      {model.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 p-6 w-[300px]">
                            {item.submenu.map((subItem) => (
                              <a
                                key={subItem.title}
                                href={subItem.link}
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-accent"
                              >
                                {subItem.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[9999] md:hidden flex justify-start"
            onClick={() => setIsMenuOpen(false)}
          >
            <div 
              className="w-4/5 bg-background flex flex-col h-full"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-background border-b border-border flex-shrink-0">
              <button onClick={() => setIsMenuOpen(false)} className="text-foreground hover:bg-accent rounded p-1 transition-colors">
                <X className="h-6 w-6" />
              </button>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <img 
                  src={rmsLogo}
                  alt="Riders Moto Shop" 
                  className="h-10 max-h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="w-6"></div>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 overflow-y-auto">

            {/* Search */}
            <div className="px-4 py-4 bg-background border-b border-border">
              <div className="flex w-full">
                {/* Category Filter */}
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-3 py-3 bg-muted/50 border border-border rounded-l-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Accessories">Accessories</option>
                </select>
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What are you looking for?"
                    className="rounded-none border-l-0 border-r-0 bg-background border-border focus:border-primary focus:ring-0 h-12"
                  />
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 rounded-l-none px-4 h-12"
                >
                  <Search className="h-4 w-4 text-primary-foreground" />
                </Button>
              </div>
            </div>

            {/* Auth Section - Mobile */}
            {isAuthenticated ? (
              <div className="bg-background px-4 py-4 border-b border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {/* Cart - Mobile - Only visible when logged in */}
                  {isAuthenticated && (
                    <Link
                      to="/cart"
                      className="block py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
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
                      console.log('Mobile Sign In clicked');
                      setIsMenuOpen(false);
                      try {
                        navigate('/login');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/login';
                      }
                    }}
                    className="block w-full text-left py-2 px-3 text-foreground hover:text-primary hover:bg-accent rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign In
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      if (isLoading) return;
                      console.log('Mobile Create Account clicked');
                      setIsMenuOpen(false);
                      try {
                        navigate('/signup');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/signup';
                      }
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
                        item.submenu.map((brand) => (
                          <div key={brand.title} className="py-2">
                            <MobileDropdown 
                              title={brand.title} 
                              data={brand.submenu || []}
                            />
                          </div>
                        ))
                      ) : item.title === "Shop by Accessories" ? (
                        item.submenu.map((category) => (
                          <MobileDropdown 
                            key={category.title}
                            title={category.title} 
                            data={category.submenu || []}
                          />
                        ))
                      ) : item.title === "Scooters" ? (
                        item.submenu.map((scooter) => (
                          <a
                            key={scooter.title}
                            href={scooter.link}
                            className="block py-2 px-3 text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                          >
                            {scooter.title}
                          </a>
                        ))
                      ) : item.title === "EV Bikes" ? (
                        item.submenu.map((brand) => (
                          <MobileDropdown 
                            key={brand.title}
                            title={brand.title} 
                            data={brand.submenu || []}
                          />
                        ))
                      ) : (
                        item.submenu.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.link}
                            className="block py-2 px-3 text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                          >
                            {subItem.title}
                          </a>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Scroll to Top Button */}
            <div className="fixed bottom-4 right-4 z-50">
              <Button 
                size="sm" 
                className="rounded-full w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            </div>
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;