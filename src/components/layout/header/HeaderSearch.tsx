import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AllProductsDropdown } from "./AllProductsDropdown";
import { SearchResultsDropdown } from "./SearchResultsDropdown";
import { useHeaderSearch } from "./hooks/useHeaderSearch";

interface HeaderSearchProps {
  isScrolledDown: boolean;
}

const categories = [
  "All",
  "Bikes",
  "Accessories",
  "Apparels",
  "ADJUSTABLE LUGGAGE CARRIER",
  "ADV CRASH GUARD",
  "AIRFLY LEG GUARD",
  "AIRFLY WITH ROPE",
  "ANGLO PUNJABI CORE",
  "BACK REST",
  "BACK SEAT REPLACE",
  "BASH PLATE",
  "Body Parts",
  "Brake Parts",
  "Engine Parts",
  "Exhaust Systems",
  "Lighting",
  "Suspension",
  "Wheels & Tires",
];

const HeaderSearch: React.FC<HeaderSearchProps> = ({ isScrolledDown }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Use the search hook for navigation logic
  const {
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    handleSearch,
    handleKeyPress: hookHandleKeyPress,
  } = useHeaderSearch();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchResultsOpen(false);
      handleSearch();
    } else {
      // Allow other key presses to work normally
      hookHandleKeyPress(e);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Show search results dropdown when user types
    setIsSearchResultsOpen(value.length > 0);
  };

  const handleCategorySelect = (category: string) => {
    setSearchCategory(category);
    setIsDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Close category dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }

      // Close search results dropdown
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchResultsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={searchContainerRef}
      className={`hidden md:flex flex-1 mx-6 transition-all duration-300 relative ${
        isScrolledDown ? "max-w-2xl h-12 mt-1 ml-1" : "max-w-2xl h-12"
      }`}
    >
      {/* Search Bar Container */}
      <div className="flex items-stretch w-full rounded overflow-visible border border-gray-200 bg-white transition-colors duration-200">
        {/* Category Dropdown */}
        <div
          ref={dropdownRef}
          className="relative flex-shrink-0 bg-gray-50 border-r border-gray-200 z-[100]"
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`h-full bg-transparent text-gray-800 font-normal cursor-pointer focus:outline-none hover:bg-gray-100 transition-all duration-300 border-0 flex items-center justify-between ${
              isScrolledDown
                ? "pl-4 pr-3 py-2 text-xs min-w-[90px]"
                : "pl-5 pr-4 py-3.5 text-sm min-w-[110px]"
            }`}
          >
            <span className="truncate">{searchCategory}</span>
            <ChevronDown
              className={`ml-2 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
                isDropdownOpen ? "rotate-180" : ""
              } ${isScrolledDown ? "h-3.5 w-3.5" : "h-4 w-4"}`}
            />
          </button>

          {/* Custom Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[100] ${
                searchCategory === "All" 
                  ? "w-[500px] max-w-[90vw]" 
                  : isScrolledDown 
                    ? "w-[240px]" 
                    : "w-[260px]"
              }`}
            >
              {searchCategory === "All" ? (
                // Show all products when "All" is selected
                <>
                  <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-sm font-semibold text-gray-900">
                      All Products
                    </h3>
                  </div>
                  <AllProductsDropdown
                    onProductClick={() => setIsDropdownOpen(false)}
                  />
                </>
              ) : (
                // Show categories list
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        searchCategory === category
                          ? "bg-gray-100 font-medium"
                          : "font-normal"
                      } ${
                        category === "All"
                          ? "font-medium text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (searchQuery.length > 0) {
                setIsSearchResultsOpen(true);
              }
            }}
            placeholder="What are you looking for?"
            className={`w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
              isScrolledDown ? "px-4 py-2 text-sm" : "px-5 py-3 text-sm"
            }`}
          />
          
          {/* Search Results Dropdown */}
          {isSearchResultsOpen && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[100]">
              <SearchResultsDropdown
                searchQuery={searchQuery}
                onProductClick={() => {
                  setIsSearchResultsOpen(false);
                  setSearchQuery("");
                }}
              />
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => {
            setIsSearchResultsOpen(false);
            handleSearch();
          }}
          className={`flex-shrink-0 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center justify-center ${
            isScrolledDown ? "px-5 py-2" : "px-7 py-3"
          }`}
          aria-label="Search"
        >
          <Search
            className={`transition-all duration-300 ${
              isScrolledDown ? "h-4 w-4" : "h-5 w-5"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default HeaderSearch;
