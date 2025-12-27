import { Link } from "react-router-dom";
import { Loader2, ChevronRight } from "lucide-react";
import { BikeBrandGroup } from "../hooks/useBikesByBrand";
import { ProductTypesForCategory } from "./ProductTypesForCategory";
import { useState, useRef, useEffect } from "react";

interface ShopByBikeDropdownProps {
  bikesByBrand: Record<string, BikeBrandGroup>;
  isLoadingBikes: boolean;
  accessoryCategories: Array<{ name: string; slug: string }>;
}

export const ShopByBikeDropdown = ({
  bikesByBrand,
  isLoadingBikes,
  accessoryCategories,
}: ShopByBikeDropdownProps) => {
  const [hoveredBike, setHoveredBike] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(null);
  
  // Track which bike is "locked" (when user is interacting with accessories)
  const [lockedBike, setLockedBike] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(null);
  
  // Track which categories are expanded (using Set for O(1) lookup)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Use refs to track hover timeout and pending bike
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingBikeRef = useRef<{ id: string; slug: string; name: string } | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  const handleBikeHover = (bike: { id: string; slug: string; name: string }) => {
    // If a bike is locked, don't change it
    if (lockedBike) {
      return;
    }
    
    // Store the pending bike
    pendingBikeRef.current = bike;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a delay before switching (200ms)
    hoverTimeoutRef.current = setTimeout(() => {
      // Only update if the pending bike hasn't changed
      if (pendingBikeRef.current === bike && !lockedBike) {
        setHoveredBike(bike);
      }
      hoverTimeoutRef.current = null;
    }, 200);
  };
  
  const handleBikeLeave = () => {
    // Clear pending bike when leaving
    pendingBikeRef.current = null;
    // Don't clear the timeout - let it complete if user is moving to accessories
  };
  
  const handleAccessoriesEnter = () => {
    // Lock the current hovered bike when entering accessories area
    if (hoveredBike) {
      setLockedBike(hoveredBike);
    }
    // Clear any pending hover changes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    pendingBikeRef.current = null;
  };
  
  const handleAccessoriesLeave = () => {
    // Unlock when leaving accessories area
    setLockedBike(null);
  };
  
  // Use locked bike if available, otherwise use hovered bike
  const activeBike = lockedBike || hoveredBike;
  
  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categorySlug)) {
        newSet.delete(categorySlug);
      } else {
        newSet.add(categorySlug);
      }
      return newSet;
    });
  };

  return (
    <div className="flex w-[1200px] max-w-[calc(100vw-80px)] mx-auto bg-popover">
      {/* Left side: Bike brands and models */}
      <div className="grid grid-cols-4 gap-6 p-4 flex-shrink-0 w-[700px] border-r border-border">
        {isLoadingBikes ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading bikes...
            </span>
          </div>
        ) : Object.keys(bikesByBrand).length === 0 ? (
          <div className="col-span-4 text-center py-8 text-sm text-muted-foreground">
            No bikes available
          </div>
        ) : (
          Object.entries(bikesByBrand).map(([brandKey, brandData]) => (
            <div key={brandKey} className="space-y-1.5">
              <h4 className="font-bold text-sm text-primary uppercase">
                {brandData.brandName}
              </h4>
              <div className="space-y-0.5">
                {brandData.bikes
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((bike) => (
                    <div
                      key={bike.id}
                      onMouseEnter={() => handleBikeHover(bike)}
                      onMouseLeave={handleBikeLeave}
                      className="group/bike"
                    >
                      <Link
                        to={`/collections/bikes/${bike.slug}`}
                        className={`block text-sm text-popover-foreground hover:text-primary transition-colors py-1 px-2 rounded truncate flex items-center justify-between ${
                          activeBike?.id === bike.id ? 'text-primary font-medium' : ''
                        }`}
                        title={bike.name}
                      >
                        <span>{bike.name}</span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover/bike:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right side: Accessories for hovered bike - STICKY */}
      <div 
        className="flex-1 p-4 sticky top-0 self-start max-h-[70vh] overflow-y-auto"
        onMouseEnter={handleAccessoriesEnter}
        onMouseLeave={handleAccessoriesLeave}
      >
        {activeBike ? (
          <div className="space-y-4">
            <div className="pb-3 border-b border-border sticky top-0 bg-popover z-10">
              <h3 className="font-bold text-lg text-foreground">
                {activeBike.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select accessory category
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {accessoryCategories.map((category) => {
                const isExpanded = expandedCategories.has(category.slug);
                
                return (
                  <ProductTypesForCategory
                    key={category.slug}
                    category={category}
                    bikeSlug={activeBike.slug}
                    isExpanded={isExpanded}
                    onToggle={() => toggleCategory(category.slug)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">Hover over a bike model</p>
              <p className="text-xs mt-1">to see available accessories</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
