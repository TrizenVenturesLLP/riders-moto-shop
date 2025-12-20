import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
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

  const products = (data as { data?: { products?: Product[] } })?.data?.products || [];

  return (
    <section id="featured-products" className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
      <div className="container mx-auto px-4">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Premium Collection
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Featured <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our curated selection of premium motorcycle parts and accessories, 
            engineered for performance, durability, and style.
          </p>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show message if no products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-foreground">No products found</h3>
            <p className="text-muted-foreground">Check back later for new products.</p>
          </div>
        )}

        {/* HT Exhaust Style View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
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