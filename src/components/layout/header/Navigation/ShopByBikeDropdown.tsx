import { Link } from "react-router-dom";
import { Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { BikeBrandGroup } from "../hooks/useBikesByBrand";
import { getProductTypesForCategory } from "@/config/productTypes";
import { useState } from "react";

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
  
  // Track which categories are expanded (using Set for O(1) lookup)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
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
                      onMouseEnter={() => setHoveredBike(bike)}
                      className="group/bike"
                    >
                      <Link
                        to={`/collections/bikes/${bike.slug}`}
                        className="block text-sm text-popover-foreground hover:text-primary transition-colors py-1 px-2 rounded truncate flex items-center justify-between"
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
      <div className="flex-1 p-4 sticky top-0 self-start max-h-[70vh] overflow-y-auto">
        {hoveredBike ? (
          <div className="space-y-4">
            <div className="pb-3 border-b border-border sticky top-0 bg-popover z-10">
              <h3 className="font-bold text-lg text-foreground">
                {hoveredBike.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select accessory category
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {accessoryCategories.map((category) => {
                const productTypes = getProductTypesForCategory(category.slug);
                const isExpanded = expandedCategories.has(category.slug);
                const displayCount = isExpanded ? productTypes.length : 3;
                const hasMore = productTypes.length > 3;
                
                return (
                  <div
                    key={category.slug}
                    className="group/category p-3 border border-border rounded-lg"
                  >
                    <Link
                      to={`/collections/bikes/${hoveredBike.slug}?category=${category.slug}`}
                      className="block font-semibold text-sm text-primary hover:text-primary/80 transition-colors mb-2"
                    >
                      {category.name}
                    </Link>
                    {productTypes.length > 0 && (
                      <div className="space-y-1">
                        {productTypes.slice(0, displayCount).map((productType) => (
                          <Link
                            key={productType.slug}
                            to={`/collections/bikes/${hoveredBike.slug}?category=${category.slug}&productType=${productType.slug}`}
                            className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            • {productType.label}
                          </Link>
                        ))}
                        {hasMore && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleCategory(category.slug);
                            }}
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors w-full text-left"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="h-3 w-3 rotate-180 transition-transform" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 transition-transform" />
                                + {productTypes.length - 3} more
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
