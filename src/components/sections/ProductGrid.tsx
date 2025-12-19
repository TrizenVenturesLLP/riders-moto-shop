import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';

const ProductGrid = () => {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Failed to load products</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const products = (data as { data?: { products?: Product[] } })?.data?.products || [];
  const displayedProducts = products.slice(0, 6); // Show only 5-6 products
  const hasMoreProducts = products.length > displayedProducts.length;

  return (
    <section id="featured-products" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Clean Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Featured <span className="text-red-600">Products</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-2">
            Discover our curated selection of premium motorcycle parts and accessories, 
            engineered for performance, durability, and style.
          </p>
        </div>

        {/* Horizontal Scroll Layout */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-visible">
          <div className="flex gap-4 sm:gap-6 min-w-max">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px]">
                <ProductCard product={product} />
              </div>
            ))}
            
            {/* "There's plenty more" Card */}
            {hasMoreProducts && (
              <div className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px]">
                <Link to="/products" className="block h-full">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center hover:bg-gray-900 transition-colors min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
                      There's plenty more
                    </h3>
                    <div className="flex items-center text-white text-xs sm:text-sm font-medium group">
                      <span className="mr-2">View more</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="mt-4 sm:mt-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Show message if no products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No products found</h3>
            <p className="text-sm text-gray-600">Check back later for new products.</p>
          </div>
        )}

        {/* Clean View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Button 
              variant="outline" 
              size="default"
              className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-medium text-sm sm:text-base"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;