import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

import categoryBrakes from '@/assets/category-brakes.jpg';
import categoryTires from '@/assets/category-tires.jpg';
import categoryEngine from '@/assets/category-engine.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

// Fallback images
const fallbackImages = {
  brakes: categoryBrakes,
  tires: categoryTires,
  'engine-parts': categoryEngine,
  accessories: categoryAccessories,
} as const;

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <section className="py-14 bg-surface">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Performance upgrades and essential accessories, curated for every rider.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error / Empty */}
        {!isLoading && (error || !categories?.length) && (
          <div className="text-center text-muted-foreground text-sm">
            Categories are loading. Please check back shortly.
          </div>
        )}

        {/* Categories */}
        {!isLoading && categories?.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.slice(0, 4).map((category) => {
                const fallbackImage =
                  fallbackImages[
                    category.slug as keyof typeof fallbackImages
                  ] || categoryAccessories;

                const image =
                  category.bannerImage || category.image || fallbackImage;

                return (
                  <div
                    key={category.id}
                    className="group relative overflow-hidden rounded-lg border border-border
                    bg-card transition-all duration-300 hover:-translate-y-1
                    hover:border-primary/50"
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackImage;
                        }}
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-base font-semibold mb-1">
                        {category.name}
                      </h3>

                      <p className="text-xs text-white/80 line-clamp-2 mb-3">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 bg-primary/90 rounded text-white font-medium">
                          {category.productCount}+ items
                        </span>

                        <Button
                          size="sm"
                          className="h-8 px-4 rounded-md bg-white/90 text-gray-900
                          hover:bg-white transition"
                          onClick={() =>
                            (window.location.href = `#category-${category.slug}`)
                          }
                        >
                          Shop
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All */}
            <div className="text-center mt-10">
              <Button
                variant="outline"
                className="h-11 px-6 rounded-md border-primary text-primary
                hover:bg-primary hover:text-primary-foreground"
                onClick={() => (window.location.href = '#categories')}
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
