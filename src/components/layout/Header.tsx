import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        className="w-full flex items-center justify-between text-left py-2 px-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <h5 className="font-medium text-gray-800">{title}</h5>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 pl-3 space-y-1">
          {accessories.map((accessory, accIndex: number) => (
            <button
              key={accIndex}
              onClick={() => handleAccessoryClick(accessory)}
              className="block w-full text-left py-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              {accessory.title}
            </button>
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
        className="w-full flex items-center justify-between text-left py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-base font-medium text-gray-900">{title}</span>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            {data.map((item: NavbarItem, index: number) => (
              <div key={index}>
                {item.link ? (
                  <Link
                    to={item.link}
                    className="block py-2 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">{item.title}</h4>
                    <div className="pl-3 space-y-2">
                      {item.submenu && item.submenu.map((subItem: NavbarItem, subIndex: number) => (
                        <div key={subIndex}>
                          {subItem.link ? (
                            <button
                              onClick={() => navigate(subItem.link!)}
                              className="block py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                              {subItem.title}
                            </button>
                          ) : (
                            <CollapsibleAccessoryCategory 
                              title={subItem.title}
                              accessories={subItem.submenu || []}
                            />
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
      )}
    </div>
  );
};

// Navigation data from JSON
const navigationData = navbarData.navbar;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopByBikeOpen, setIsShopByBikeOpen] = useState(false);
  const [isShopByAccessoriesOpen, setIsShopByAccessoriesOpen] = useState(false);
  const [isScootersOpen, setIsScootersOpen] = useState(false);
  const [isEvBikesOpen, setIsEvBikesOpen] = useState(false);

  // Using static navigation data from JSON

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-red-600 text-glow">
              Riders Moto Shop
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="flex w-full">
              {/* Category Filter */}
              <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All</option>
                <option>Bikes</option>
                <option>Accessories</option>
                <option>Scooters</option>
                <option>EV Bikes</option>
              </select>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  placeholder="What are you looking for?"
                  className="rounded-none border-l-0 border-r-0 bg-white border-gray-200 focus:border-primary focus:ring-0"
                />
              </div>
              
              {/* Search Button */}
              <Button className="bg-red-600 hover:bg-red-700 rounded-l-none px-4">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center py-4 border-t border-gray-200">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {navigationData.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.submenu ? (
                    <NavigationMenuTrigger className="text-gray-900 hover:text-red-600 font-medium">
                      {item.title}
                    </NavigationMenuTrigger>
                  ) : (
                    <Link 
                      to={item.link}
                      className="text-gray-900 hover:text-red-600 transition-colors px-4 py-2 font-medium"
                    >
                      {item.title}
                    </Link>
                  )}
                  
                  {item.submenu && (
                    <NavigationMenuContent>
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {item.title === "Shop by Bike" ? (
                          <div className="grid grid-cols-4 gap-6 p-6 w-[1000px]">
                            {item.submenu.map((brand) => (
                              <div key={brand.title} className="space-y-2">
                                <h4 className="font-semibold text-sm text-red-600">{brand.title}</h4>
                                <div className="space-y-1">
                                  {brand.submenu?.map((model) => (
                                    <div key={model.title} className="group relative w-fit">
                                      <Link
                                        to={model.link}
                                        className="block text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                                      >
                                        {model.title}
                                      </Link>
                                      {/* Show accessories submenu on hover */}
                                      {model.submenu && (
                                        <div className="hidden group-hover:block absolute left-full top-0 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[300px] z-50">
                                          <div className="space-y-3">
                                            {model.submenu.map((accessoryCategory) => (
                                              <div key={accessoryCategory.title} className="group/accessory relative">
                                                <Link
                                                  to={accessoryCategory.link}
                                                  className="block text-sm font-semibold text-red-600 hover:text-red-700 transition-colors py-1"
                                                >
                                                  {accessoryCategory.title}
                                                </Link>
                                                {/* Show individual accessories on hover */}
                                                {accessoryCategory.submenu && (
                                                  <div className="hidden group-hover/accessory:block absolute left-full top-0 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px] z-50">
                                                    <div className="space-y-1">
                                                      {accessoryCategory.submenu.map((individualAccessory) => (
                                                        <Link
                                                          key={individualAccessory.title}
                                                          to={individualAccessory.link}
                                                          className="block text-xs text-gray-600 hover:text-red-600 transition-colors py-1"
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
                          <div className="grid grid-cols-2 gap-6 p-6 w-[600px]">
                            {item.submenu.map((category) => (
                              <div key={category.title} className="space-y-2">
                                <h4 className="font-semibold text-sm text-red-600">{category.title}</h4>
                                <div className="space-y-1">
                                  {category.submenu?.map((item) => (
                                    <Link
                                      key={item.title}
                                      to={item.link}
                                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                      {item.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
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
              <h1 className="text-xl font-bold text-red-600 text-glow">
                Riders Moto Shop
              </h1>
              <div className="w-6"></div>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 overflow-y-auto">

            {/* Search */}
            <div className="px-4 py-4 bg-white border-b border-gray-100">
              <div className="flex w-full">
                {/* Category Filter */}
                <select className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-l-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>All</option>
                  <option>Bikes</option>
                  <option>Accessories</option>
                  <option>Scooters</option>
                  <option>EV Bikes</option>
                </select>
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Input
                    placeholder="What are you looking for?"
                    className="rounded-none border-l-0 border-r-0 bg-white border-gray-200 focus:border-primary focus:ring-0 h-12"
                  />
                </div>
                
                {/* Search Button */}
                <Button className="bg-red-600 hover:bg-red-700 rounded-l-none px-4 h-12">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Menu Items */}
            <div className="bg-white px-4 py-4">

              {navigationData.map((item, index) => (
                <div key={index} className={`py-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                  {item.submenu ? (
                    <button
                      onClick={() => {
                        if (item.title === "Shop by Bike") setIsShopByBikeOpen(!isShopByBikeOpen);
                        else if (item.title === "Shop by Accessories") setIsShopByAccessoriesOpen(!isShopByAccessoriesOpen);
                        else if (item.title === "Scooters") setIsScootersOpen(!isScootersOpen);
                        else if (item.title === "EV Bikes") setIsEvBikesOpen(!isEvBikesOpen);
                      }}
                      className="w-full flex items-center justify-between text-left py-3 px-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h2>
                      <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${
                        (item.title === "Shop by Bike" && isShopByBikeOpen) ||
                        (item.title === "Shop by Accessories" && isShopByAccessoriesOpen) ||
                        (item.title === "Scooters" && isScootersOpen) ||
                        (item.title === "EV Bikes" && isEvBikesOpen) ? 'rotate-180' : ''
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
                      (item.title === "Shop by Accessories" && !isShopByAccessoriesOpen) ||
                      (item.title === "Scooters" && !isScootersOpen) ||
                      (item.title === "EV Bikes" && !isEvBikesOpen) ? 'hidden' : ''
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
      </div>
    </header>
  );
};

export default Header;