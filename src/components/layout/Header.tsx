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
        className="w-full flex items-center justify-between text-left py-2 px-2 bg-gray-100 dark:bg-card rounded-lg hover:bg-gray-200 dark:hover:bg-card/80 transition-colors"
      >

        <h5 className="font-medium text-gray-800 dark:text-foreground">{title}</h5>
        <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 pl-3 space-y-1">
          {accessories.map((accessory, accIndex: number) => (
            <div key={accIndex}>
              {accessory.link ? (
                <button
                  onClick={() => handleAccessoryClick(accessory)}
                  className="block w-full text-left py-1 text-xs text-gray-500 dark:text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {accessory.title}
                </button>
              ) : (
                <div className="py-1 text-xs text-gray-400 dark:text-muted-foreground/70">
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
        className="w-full flex items-center justify-between text-left py-3 px-4 bg-gray-50 dark:bg-card rounded-lg hover:bg-gray-100 dark:hover:bg-card/80 transition-colors"
      >
        <span className="text-base font-medium text-gray-900 dark:text-foreground">{title}</span>
        <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg p-4 shadow-sm">
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
                          className="font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <h4 className="font-semibold text-red-600">{item.title}</h4>
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
                              className="block py-1 text-sm text-gray-600 dark:text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              {subItem.title}
                            </button>
                          ) : (
                            <div className="py-1 text-sm text-gray-600 dark:text-muted-foreground">
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
                    className="block py-2 px-3 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-card/50 rounded transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className="py-2 px-3 text-gray-700 dark:text-foreground">
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
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear any pending timeout
      clearTimeout(timeoutId);
      
      // Debounce scroll events
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        
        // Set isScrolledDown based on whether we're past the top (2px threshold)
        setIsScrolledDown(currentScrollY > 2);
        
        lastScrollYRef.current = currentScrollY;
      }, 10); // 10ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-background shadow-sm">
      {/* Main Header - White Background - Reduces size when scrolled */}
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-200 ${
          isScrolledDown ? 'h-16' : 'h-24'
        }`}>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img 
                src="/rms-logo.jpeg" 
                alt="Riders Moto Shop" 
                className={`transition-all duration-300 cursor-pointer hover:opacity-90 ${
                  isScrolledDown ? 'h-14' : 'h-20'
                }`}
              />
            </Link>
          </div>

          {/* Search Bar - Desktop - Centered */}
          <div className={`hidden md:flex flex-1 justify-center transition-all duration-300 ${
            isScrolledDown ? 'max-w-lg' : 'max-w-3xl'
          }`}>
            <div className="flex w-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-card">
              {/* Category Filter */}
              <select 
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className={`px-4 bg-white dark:bg-card/50 border-0 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-r focus:border-gray-200 appearance-none cursor-pointer transition-all duration-300 font-medium ${
                  isScrolledDown ? 'py-2 text-xs h-10' : 'py-3 text-sm h-12'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '18px',
                  paddingRight: '36px'
                }}
              >
                <option value="All" className="py-2 px-4 bg-white text-gray-700 hover:bg-red-50">All Categories</option>
                <option value="Bikes" className="py-2 px-4 bg-white text-gray-700 hover:bg-red-50">Bikes</option>
                <option value="Accessories" className="py-2 px-4 bg-white text-gray-700 hover:bg-red-50">Accessories</option>
              </select>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What are you looking for?"
                  className={`rounded-none border-0 bg-white dark:bg-card focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 ${
                    isScrolledDown ? 'h-10 text-xs' : 'h-12 text-sm'
                  }`}
                />
              </div>
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className={`bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-none flex items-center justify-center border-0 focus:ring-0 focus-visible:ring-0 transition-all duration-300 font-medium ${
                  isScrolledDown ? 'px-4 h-10 w-11' : 'px-6 h-12 w-14'
                }`}
              >
                <Search className={`text-white transition-all duration-300 ${
                  isScrolledDown ? 'h-4 w-4' : 'h-5 w-5'
                }`} />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <ThemeToggle />
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Orders
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                className="hidden md:flex"
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
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop - Smaller, White Background - Full Width - ONLY visible when at absolute top */}
      <div className={`hidden md:flex items-center py-1.5 bg-white dark:bg-background w-full transition-all duration-200 ${
        isScrolledDown ? '-translate-y-full opacity-0 h-0 overflow-hidden pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className="container mx-auto px-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {navigationData.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.submenu ? (
                    <NavigationMenuTrigger className="text-gray-900 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 font-medium text-sm bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent rounded-none px-3 py-1.5 h-auto">
                      {item.title}
                    </NavigationMenuTrigger>
                  ) : (
                    <Link 
                      to={item.link}
                      className="text-gray-900 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-1.5 font-medium text-sm"
                    >
                      {item.title}
                    </Link>
                  )}
                  
                  {item.submenu && (
                    <NavigationMenuContent>
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {item.title === "Shop by Bike" ? (
                          <div className="grid grid-cols-3 gap-3 px-3 py-2 w-screen overflow-hidden">
                            {item.submenu.map((brand) => (
                              <div key={brand.title} className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-red-600 dark:text-red-500 uppercase px-1">{brand.title}</h4>
                                <div className="space-y-0">
                                  {brand.submenu?.map((model) => (
                                    <div key={model.title} className="group relative">
                                      <Link
                                        to={model.link}
                                        className="block text-xs text-gray-900 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-card/50"
                                      >
                                        {model.title}
                                      </Link>
                                      {/* Show accessories submenu on hover - positioned below the bike name */}
                                      {model.submenu && (
                                        <div className="hidden group-hover:block absolute top-full left-0 mt-0 bg-white dark:bg-card border border-gray-200 dark:border-border rounded shadow-lg p-1.5 min-w-[160px] z-50 whitespace-nowrap">
                                          <div className="space-y-0.5">
                                            {model.submenu.map((accessoryCategory) => (
                                              <div key={accessoryCategory.title} className="group/accessory relative">
                                                <Link
                                                  to={accessoryCategory.link}
                                                  className="block text-xs font-semibold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-card/80"
                                                >
                                                  {accessoryCategory.title}
                                                </Link>
                                                {/* Show individual accessories on hover - compact */}
                                                {accessoryCategory.submenu && (
                                                  <div className="hidden group-hover/accessory:block absolute top-full left-0 mt-0.5 bg-white dark:bg-card border border-gray-200 dark:border-border rounded shadow-lg p-1.5 min-w-[140px] z-40 whitespace-nowrap">
                                                    <div className="space-y-0 relative">
                                                      {accessoryCategory.submenu.map((individualAccessory) => (
                                                        <Link
                                                          key={individualAccessory.title}
                                                          to={individualAccessory.link}
                                                          className="block text-xs text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors py-0.5 px-1 rounded hover:bg-red-50 dark:hover:bg-card/70"
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
                                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                      <IconComponent className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h4 className="font-bold text-base text-gray-900 group-hover:text-red-600 transition-colors">
                                      {category.title}
                                    </h4>
                                  </div>
                                  
                                  {/* Accessory Items */}
                                  <div className="space-y-2">
                                    {category.submenu?.map((accessoryItem) => (
                                      <Link
                                        key={accessoryItem.title}
                                        to={accessoryItem.link}
                                        className="block text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 group/item"
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
                                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 rounded hover:bg-gray-50"
                              >
                                {scooter.title}
                              </a>
                            ))}
                          </div>
                        ) : item.title === "EV Bikes" ? (
                          <div className="grid grid-cols-1 gap-4 p-6 w-[300px]">
                            {item.submenu.map((brand) => (
                              <div key={brand.title} className="space-y-2">
                                <h4 className="font-semibold text-sm text-red-600">{brand.title}</h4>
                                <div className="space-y-1">
                                  {brand.submenu?.map((model) => (
                                    <a
                                      key={model.title}
                                      href={model.link}
                                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
                                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 rounded hover:bg-gray-50"
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
              className="w-4/5 bg-white flex flex-col h-full"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-900" />
              </button>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img 
                  src="/rms-logo.jpeg" 
                  alt="Riders Moto Shop" 
                  className="h-10 cursor-pointer hover:opacity-90"
                />
              </Link>
              <div className="w-6"></div>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 overflow-y-auto">

            {/* Search */}
            <div className="px-4 py-4 bg-white border-b border-gray-100">
              <div className="flex w-full">
                {/* Category Filter */}
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-l-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="rounded-none border-l-0 border-r-0 bg-white border-gray-200 focus:border-primary focus:ring-0 h-12"
                  />
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="bg-red-600 hover:bg-red-700 rounded-l-none px-4 h-12"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Auth Section - Mobile */}
            {isAuthenticated ? (
              <div className="bg-white dark:bg-card px-4 py-4 border-b border-gray-100 dark:border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-card/50 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 px-3 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-card/50 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-card/50 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-card px-4 py-4 border-b border-gray-100 dark:border-border">
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
                    className="block w-full text-left py-2 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="block w-full text-left py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* Main Menu Items */}
            <div className="bg-white px-4 py-4">

              {navigationData.map((item, index) => (
                <div key={index} className={`py-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                  {item.submenu ? (
                    <button
                      onClick={() => {
                        if (item.title === "Shop by Bike") setIsShopByBikeOpen(!isShopByBikeOpen);
                        else if (item.title === "Shop by Accessories") setIsShopByAccessoriesOpen(!isShopByAccessoriesOpen);
                      }}
                      className="w-full flex items-center justify-between text-left py-3 px-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h2>
                      <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${
                        (item.title === "Shop by Bike" && isShopByBikeOpen) ||
                        (item.title === "Shop by Accessories" && isShopByAccessoriesOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link 
                      to={item.link} 
                      className="block py-3 px-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
                            className="block py-2 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
                            className="block py-2 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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