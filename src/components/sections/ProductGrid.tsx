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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header - Always visible */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title.split(" ")[0]}{" "}
            <span className="text-primary">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-destructive mb-2">
              Failed to load products
            </h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        )}

        {/* No Products State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-foreground">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try changing filters or check back later.
            </p>
          </div>
        )}

        {/* Products Display */}
        {!isLoading && !error && products.length > 0 && (
          <>
            {/* Horizontal Scroll */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[260px] sm:w-[300px]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}

                {/* View More Card */}
                {hasMoreProducts && (
                  <div className="flex-shrink-0 w-[260px] sm:w-[300px]">
                    <Link to="/products" className="block h-full">
                      <div className="bg-foreground h-full rounded-lg flex flex-col items-center justify-center text-center text-background p-6 hover:bg-foreground/90 transition">
                        <h3 className="text-xl font-bold mb-3">
                          There's more waiting
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          View all
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* View All Button */}
            {products.length > 6 && (
              <div className="text-center mt-10">
                <Button variant="outline" className="rounded-none border-border">
                  View All Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
