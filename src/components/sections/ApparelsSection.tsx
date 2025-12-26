import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Apparel product types for navigation
const apparelProductTypes = [
  {
    id: 'jacket',
    name: 'JACKETS',
    slug: 'jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    link: '/collections/apparels?productType=jacket'
  },
  {
    id: 'pants',
    name: 'PANTS',
    slug: 'pants',
    image: 'https://images.unsplash.com/photo-1593341646790-2457430057c7?w=400&h=300&fit=crop',
    link: '/collections/apparels?productType=pants'
  },
  {
    id: 't-shirt',
    name: 'T-SHIRTS',
    slug: 't-shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    link: '/collections/apparels?productType=t-shirt'
  },
  {
    id: 'gloves',
    name: 'GLOVES',
    slug: 'gloves',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcd435ce?w=400&h=300&fit=crop',
    link: '/collections/apparels?productType=gloves'
  },
  {
    id: 'apparel-accessory',
    name: 'APPAREL ACCESSORIES',
    slug: 'apparel-accessory',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    link: '/collections/apparels?productType=apparel-accessory'
  },
];

const ApparelsSection = () => {
  return (
    <section id="shop-apparels" className="mt-8 sm:mt-10 md:mt-12 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Clean Header */}
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1.5 sm:mb-2">
            Shop by <span className="text-primary">Apparels</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Premium motorcycle apparel for safety, comfort, and style. 
            Gear up with our quality clothing and protective wear.
          </p>
        </div>

        {/* Product Types Grid - Show product types (jacket, t-shirt, pants, etc.) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 max-w-7xl mx-auto">
          {apparelProductTypes.map((productType) => (
            <Link
              key={productType.id}
              to={productType.link}
              className="group cursor-pointer"
            >
              {/* Product Type Image Container - Fixed aspect ratio for consistent sizing */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted/30 rounded-sm">
                {productType.image ? (
                  <img 
                    src={productType.image} 
                    alt={productType.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center rounded-sm">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Type Name - Below image */}
              <div className="text-center mt-0.5 sm:mt-1">
                <h3 className="text-[8px] sm:text-[9px] font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                  {productType.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Clean View All Button - Shows all apparels without productType filter */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link to="/collections/apparels">
            <Button 
              size="default" 
              variant="outline" 
              className="bg-background border border-border text-foreground hover:bg-accent px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-medium text-sm sm:text-base"
            >
              View All Apparels
              <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ApparelsSection;

