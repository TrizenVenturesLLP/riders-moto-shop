import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

// Static accessories data matching HT Exhaust style with actual images
const accessories = [
  {
    id: 'sump-guard',
    name: 'SUMP GUARD',
    image: '/shop_by_accessories_imgs/Sump_Guard.webp',
    link: '/collections/sump-guard'
  },
  {
    id: 'crash-guard',
    name: 'CRASH GUARD',
    image: '/shop_by_accessories_imgs/Crash_Guard.webp',
    link: '/collections/crash-guard'
  },
  {
    id: 'foot-rest',
    name: 'FOOT REST',
    image: '/shop_by_accessories_imgs/Foot_Rest.webp',
    link: '/collections/foot-rest'
  },
  {
    id: 'tail-tidy',
    name: 'TAIL TIDY',
    image: '/shop_by_accessories_imgs/Tail_Tidy.webp',
    link: '/collections/tail-tidy'
  },
  {
    id: 'radiator-guard',
    name: 'RADIATOR GUARD',
    image: '/shop_by_accessories_imgs/Radiator_Guard.webp',
    link: '/collections/radiator-guard'
  },
  {
    id: 'frame-slider',
    name: 'FRAME SLIDER',
    image: '/shop_by_accessories_imgs/Frame_Slider.webp',
    link: '/collections/frame-slider'
  },
  {
    id: 'carrier',
    name: 'CARRIER',
    image: '/shop_by_accessories_imgs/Carrier.webp',
    link: '/collections/carrier'
  },
  {
    id: 'saddle-stay',
    name: 'SADDLE STAY',
    image: '/shop_by_accessories_imgs/Saddle_Stay.webp',
    link: '/collections/saddle-stay'
  },
  {
    id: 'silencer-black',
    name: 'SILENCER BLACK',
    image: '/shop_by_accessories_imgs/Silencer_Black.webp',
    link: '/collections/silencer-black'
  },
  {
    id: 'fluid-tank-cap',
    name: 'FLUID TANK CAP',
    image: '/shop_by_accessories_imgs/Fluid-tank-cap.webp',
    link: '/collections/fluid-tank-cap'
  }
];

const AccessoriesSection = () => {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-red-600">Accessories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Premium motorcycle accessories for protection, performance, and style. Upgrade your ride with our quality parts.
          </p>
        </div>

        {/* Grid Layout - Exact HT Exhaust style: 5 columns, 2 rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {accessories.map((accessory) => (
            <div 
              key={accessory.id}
              className="bg-white border-2 border-red-500 rounded-lg overflow-hidden hover:border-red-600 transition-all duration-300 cursor-pointer"
              onClick={() => {
                window.location.href = accessory.link;
              }}
            >
              {/* Product Image Container */}
              <div className="aspect-square bg-white flex items-center justify-center p-4">
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Actual product image */}
                  <img 
                    src={accessory.image} 
                    alt={accessory.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to a simple placeholder if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback icon if image fails */}
                  <div className="hidden w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Accessory Name - Centered below image */}
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
                  {accessory.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              window.location.href = '/collections/accessories';
            }}
          >
            View All Accessories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AccessoriesSection;
