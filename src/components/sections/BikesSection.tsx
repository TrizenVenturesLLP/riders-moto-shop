import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBikeModels } from '@/hooks/useBikeModels';

const BikesSection = () => {
  const { data: bikeModels, isLoading, error } = useBikeModels({ isActive: true });

  if (isLoading) {
    return (
      <section id="shop-bikes" className="mt-8 sm:mt-10 md:mt-12 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading bikes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || bikeModels.length === 0) {
    return null; // Don't show section if no bikes or error
  }

  // Show only first 8 bikes on home page
  const displayedBikes = bikeModels.slice(0, 8);
  const hasMoreBikes = bikeModels.length > 8;

  return (
    <section id="shop-bikes" className="mt-8 sm:mt-10 md:mt-12 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Clean Header */}
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1.5 sm:mb-2">
            Shop by <span className="text-primary">Bikes</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Find accessories perfectly compatible with your motorcycle model. 
            Select your bike to explore custom-fit parts and upgrades.
          </p>
        </div>

        {/* Clean Grid Layout - 4 columns (4 images per row) - Only 8 bikes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 max-w-7xl mx-auto">
          {displayedBikes.map((bike) => (
            <Link
              key={bike.id}
              to={`/collections/bikes/${bike.slug}`}
              className="group cursor-pointer"
            >
              {/* Bike Image Container - Fixed aspect ratio for consistent sizing */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted/30">
                {bike.image ? (
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              {/* Bike Name - Below image */}
              <div className="text-center mt-0.5 sm:mt-1">
                <h3 className="text-[8px] sm:text-[9px] font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                  {bike.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Clean View All Button - Only show if there are more than 8 bikes */}
        {hasMoreBikes && (
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link to="/all-bikes">
              <Button 
                size="default" 
                variant="outline" 
                className="bg-background border border-border text-foreground hover:bg-accent px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-medium text-sm sm:text-base"
              >
                View All Bikes
                <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BikesSection;

