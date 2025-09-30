import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

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

  const products = (data as any)?.data?.products || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* HT Exhaust Style Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-red-600">Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium motorcycle parts and accessories designed for performance and durability
          </p>
        </div>

        {/* HT Exhaust Style Grid - 5 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show message if no products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No products found</h3>
            <p className="text-gray-600">Check back later for new products.</p>
          </div>
        )}

        {/* HT Exhaust Style View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
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