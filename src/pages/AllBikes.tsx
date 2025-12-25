import React from 'react';
import { Link } from 'react-router-dom';
import { useBikeModels } from '@/hooks/useBikeModels';
import { Loader2 } from 'lucide-react';

const AllBikes = () => {
  const { data: bikeModels, isLoading, error } = useBikeModels({ isActive: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading bikes...</p>
        </div>
      </div>
    );
  }

  if (error || bikeModels.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">No Bikes Found</h1>
          <p className="text-muted-foreground mb-6">Unable to load bike models. Please try again later.</p>
          <Link to="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            All <span className="text-primary">Bikes</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Browse all available motorcycle models and find compatible accessories for your bike.
          </p>
        </div>

        {/* Grid Layout - 4 columns (4 images per row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 max-w-7xl mx-auto">
          {bikeModels.map((bike) => (
            <Link
              key={bike.id}
              to={`/collections/bikes/${bike.slug}`}
              className="group cursor-pointer"
            >
              {/* Bike Image Container - Fixed aspect ratio for consistent sizing */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted/30 rounded-sm">
                {bike.image ? (
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
              <div className="text-center mt-1 sm:mt-1.5">
                <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                  {bike.name}
                </h3>
                {bike.brand && (
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">
                    {bike.brand.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllBikes;


import { useBikeModels } from '@/hooks/useBikeModels';
import { Loader2 } from 'lucide-react';

const AllBikes = () => {
  const { data: bikeModels, isLoading, error } = useBikeModels({ isActive: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading bikes...</p>
        </div>
      </div>
    );
  }

  if (error || bikeModels.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">No Bikes Found</h1>
          <p className="text-muted-foreground mb-6">Unable to load bike models. Please try again later.</p>
          <Link to="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            All <span className="text-primary">Bikes</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Browse all available motorcycle models and find compatible accessories for your bike.
          </p>
        </div>

        {/* Grid Layout - 4 columns (4 images per row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 max-w-7xl mx-auto">
          {bikeModels.map((bike) => (
            <Link
              key={bike.id}
              to={`/collections/bikes/${bike.slug}`}
              className="group cursor-pointer"
            >
              {/* Bike Image Container - Fixed aspect ratio for consistent sizing */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted/30 rounded-sm">
                {bike.image ? (
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
              <div className="text-center mt-1 sm:mt-1.5">
                <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                  {bike.name}
                </h3>
                {bike.brand && (
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">
                    {bike.brand.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllBikes;

