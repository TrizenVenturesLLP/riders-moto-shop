import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Folder } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import categoryBrakes from '@/assets/category-brakes.jpg';
import categoryTires from '@/assets/category-tires.jpg';
import categoryEngine from '@/assets/category-engine.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

// Fallback images for categories
const fallbackImages = {
  'brakes': categoryBrakes,
  'tires': categoryTires,
  'engine-parts': categoryEngine,
  'accessories': categoryAccessories,
} as const;

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find exactly what you need to upgrade your ride. From performance parts to essential accessories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Categories are being loaded. Please check back soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find exactly what you need to upgrade your ride. From performance parts to essential accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category) => {
            // Get fallback image based on slug or use default
            const fallbackImage = fallbackImages[category.slug as keyof typeof fallbackImages] || categoryAccessories;
            const categoryImage = category.bannerImage || category.image || fallbackImage;
            
            return (
              <div 
                key={category.id}
                className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={categoryImage} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to default image if category image fails to load
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-200 text-sm mb-2">{category.description}</p>
                  <p className="text-primary text-sm font-medium mb-4">{category.productCount}+ products</p>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/90 text-black border-white/20 hover:bg-white hover:text-black transition-colors"
                    onClick={() => {
                      // Navigate to category page or filter products
                      window.location.href = `#category-${category.slug}`;
                    }}
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              // Navigate to all categories page
              window.location.href = '#categories';
            }}
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;