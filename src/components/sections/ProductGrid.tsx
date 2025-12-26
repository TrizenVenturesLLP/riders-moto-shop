import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Product } from "@/hooks/useProducts";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  error?: unknown;
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  error,
  title = "Products",
}) => {
  const displayedProducts = products.slice(0, 6);
  const hasMoreProducts = products.length > displayedProducts.length;

    return (
    <section className="py-6 sm:py-8 md:py-12 bg-background">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header - Always visible */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {title.split(" ")[0]}{" "}
            <span className="text-primary">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-destructive mb-2">
              Failed to load products
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Please try again later.</p>
          </div>
        )}

        {/* No Products State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              No products found
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Try changing filters or check back later.
            </p>
          </div>
        )}

        {/* Products Display */}
        {!isLoading && !error && products.length > 0 && (
          <>
            {/* Horizontal Scroll */}
            <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px] lg:w-[300px]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}

                {/* View More Card */}
                {hasMoreProducts && (
                  <div className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px] lg:w-[300px]">
                    <Link to="/products" className="block h-full">
                      <div className="bg-foreground h-full rounded-lg flex flex-col items-center justify-center text-center text-background p-4 sm:p-5 md:p-6 hover:bg-foreground/90 transition">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">
                          There's more waiting
                        </h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          View all
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* View All Button - Always show when products exist */}
            {products.length > 0 && (
              <div className="text-center mt-6 sm:mt-8 md:mt-10">
                <Link to="/products">
                  <Button variant="outline" className="rounded-none border-border text-xs sm:text-sm">
                    View All Products
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
