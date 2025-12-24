import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Static bikes data - 8 popular models
const bikes = [
  {
    id: 'super-meteor-650',
    name: 'SUPER METEOR 650',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/super-meteor-650.webp',
    link: '/collections/super-meteor-650'
  },
  {
    id: 'himalayan-450',
    name: 'HIMALAYAN 450',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/himalayan-450.webp',
    link: '/collections/himalayan-450'
  },
  {
    id: 'classic-350',
    name: 'CLASSIC 350',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/classic-350.webp',
    link: '/collections/classic-350'
  },
  {
    id: 'hunter-350',
    name: 'HUNTER 350',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/hunter-350.webp',
    link: '/collections/hunter-350'
  },
  {
    id: 'scram-411',
    name: 'SCRAM 411',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/scram-411.webp',
    link: '/collections/scram-411'
  },
  {
    id: 'meteor-350',
    name: 'METEOR 350',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/meteor-350.webp',
    link: '/collections/meteor-350'
  },
  {
    id: 'continental-gt-650',
    name: 'CONTINENTAL GT 650',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/continental-gt-650.webp',
    link: '/collections/continental-gt-650'
  },
  {
    id: 'interceptor-650',
    name: 'INTERCEPTOR 650',
    brand: 'Royal Enfield',
    image: '/shop_by_bikes_imgs/interceptor-650.webp',
    link: '/collections/interceptor-650'
  }
];

const BikesSection = () => {
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

        {/* Clean Grid Layout - 4 columns (4 images per row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 max-w-7xl mx-auto">
          {bikes.map((bike) => {
            return (
              <div 
                key={bike.id}
                className="group cursor-pointer"
                onClick={() => {
                  window.location.href = bike.link;
                }}
              >
                {/* Bike Image Container - Wider aspect ratio, no top/bottom spacing */}
                <div className="relative aspect-[5/3] flex items-center justify-center">
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                    }}
                  />
                </div>

                {/* Bike Name - Below image */}
                <div className="text-center mt-0.5 sm:mt-1">
                  <h3 className="text-[8px] sm:text-[9px] font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                    {bike.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean View All Button */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Button 
            size="default" 
            variant="outline" 
            className="bg-background border border-border text-foreground hover:bg-accent px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-medium text-sm sm:text-base"
            onClick={() => {
              // Scroll to header's Shop by Bike dropdown or navigate to a bikes listing page
              const shopByBikeLink = document.querySelector('a[href*="shop-by-bike"]');
              if (shopByBikeLink) {
                (shopByBikeLink as HTMLElement).click();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            View All Bikes
            <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BikesSection;

