import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { HeaderLogo } from "./header/HeaderLogo";
import HeaderSearch from "./header/HeaderSearch";
import { HeaderActions } from "./header/HeaderActions";
import { MobileMenu } from "./header/Navigation/MobileMenu";
import { DesktopNavigation } from "./header/Navigation/DesktopNavigation";
import { useHeaderScroll } from "./header/hooks/useHeaderScroll";
import { useBikesByBrand } from "./header/hooks/useBikesByBrand";
import { useHeaderSearch } from "./header/hooks/useHeaderSearch";
import navbarData from "@/data/navbar.json";

// Navigation data from JSON
const navigationData = navbarData.navbar;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Use custom hooks
  const { isScrolledDown } = useHeaderScroll();
  const { bikesByBrand, isLoading: isLoadingBikes } = useBikesByBrand();

  // Main categories for accessories (static for now, can be made dynamic later)
  const accessoryCategories = [
    { name: "Touring Accessories", slug: "touring-accessories" },
    { name: "Protection Accessories", slug: "protection-accessories" },
    { name: "Performance Accessories", slug: "performance-accessories" },
    { name: "Auxiliary Accessories", slug: "auxiliary-accessories" },
  ];

  // Using static navigation data from JSON for non-bike items

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest("[data-user-menu]")) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Main Header - White Background - Reduces size when scrolled */}
      <div className="container mx-auto px-4 relative">
        {/* Top Row: Menu, Logo, Actions (Mobile) */}
        <div
          className={`flex items-center justify-between transition-[height] duration-300 ease-in-out relative ${
            isScrolledDown ? "h-16" : "h-20"
          }`}
        >
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:bg-accent rounded p-1 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <HeaderLogo isScrolledDown={isScrolledDown} />

          {/* Search Bar - Desktop Only (Centered) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-[100]">
            <HeaderSearch isScrolledDown={isScrolledDown} />
          </div>

          {/* Actions */}
          <HeaderActions
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            onLogout={handleLogout}
          />
        </div>

        {/* Search Bar - Mobile Only (Below top row) */}
        <div className="md:hidden pt-2 pb-3">
          <HeaderSearch isScrolledDown={isScrolledDown} />
        </div>
      </div>

      {/* Navigation - Desktop */}
      <DesktopNavigation
        navigationData={navigationData}
        bikesByBrand={bikesByBrand}
        isLoadingBikes={isLoadingBikes}
        accessoryCategories={accessoryCategories}
        isScrolledDown={isScrolledDown}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
