import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Wrench, Zap, Settings, Lock, Star, Camera, Headphones, Award } from 'lucide-react';

// Helper function to get appropriate icon for each accessory
const getAccessoryIcon = (accessoryName: string) => {
  const name = accessoryName.toLowerCase();
  if (name.includes('guard') || name.includes('protection') || name.includes('crash')) return Shield;
  if (name.includes('performance') || name.includes('exhaust') || name.includes('silencer')) return Zap;
  if (name.includes('tool') || name.includes('maintenance') || name.includes('foot')) return Wrench;
  if (name.includes('audio') || name.includes('sound') || name.includes('speaker')) return Headphones;
  if (name.includes('camera') || name.includes('recording') || name.includes('dash')) return Camera;
  if (name.includes('security') || name.includes('alarm') || name.includes('lock')) return Lock;
  if (name.includes('premium') || name.includes('luxury') || name.includes('special')) return Star;
  if (name.includes('carrier') || name.includes('saddle') || name.includes('frame')) return Award;
  return Settings; // Default icon
};

// Static accessories data matching HT Exhaust style with actual images
const accessories = [
  {
    id: 'sump-guard',
    name: 'SUMP GUARD',
    image: '/shop_by_accessories_imgs/Sump_Guard.webp',
    link: '/collections/accessories/sump-guard'
  },
  {
    id: 'crash-guard',
    name: 'CRASH GUARD',
    image: '/shop_by_accessories_imgs/Crash_Guard.webp',
    link: '/collections/accessories/crash-guard'
  },
  {
    id: 'foot-rest',
    name: 'FOOT REST',
    image: '/shop_by_accessories_imgs/Foot_Rest.webp',
    link: '/collections/accessories/foot-rest'
  },
  {
    id: 'tail-tidy',
    name: 'TAIL TIDY',
    image: '/shop_by_accessories_imgs/Tail_Tidy.webp',
    link: '/collections/accessories/tail-tidy'
  },
  {
    id: 'radiator-guard',
    name: 'RADIATOR GUARD',
    image: '/shop_by_accessories_imgs/Radiator_Guard.webp',
    link: '/collections/accessories/radiator-guard'
  },
  {
    id: 'frame-slider',
    name: 'FRAME SLIDER',
    image: '/shop_by_accessories_imgs/Frame_Slider.webp',
    link: '/collections/accessories/frame-slider'
  },
  {
    id: 'carrier',
    name: 'CARRIER',
    image: '/shop_by_accessories_imgs/Carrier.webp',
    link: '/collections/accessories/carrier'
  },
  {
    id: 'saddle-stay',
    name: 'SADDLE STAY',
    image: '/shop_by_accessories_imgs/Saddle_Stay.webp',
    link: '/collections/accessories/saddle-stay'
  },
  {
    id: 'silencer-black',
    name: 'SILENCER BLACK',
    image: '/shop_by_accessories_imgs/Silencer_Black.webp',
    link: '/collections/accessories/silencer-black'
  },
  {
    id: 'fluid-tank-cap',
    name: 'FLUID TANK CAP',
    image: '/shop_by_accessories_imgs/Fluid-tank-cap.webp',
    link: '/collections/accessories/fluid-tank-cap'
  }
];

const AccessoriesSection = () => {
  return (
    <section id="shop-accessories" className="mt-8 sm:mt-10 md:mt-12 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Clean Header */}
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1.5 sm:mb-2">
            Shop by <span className="text-primary">Accessories</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Premium motorcycle accessories for protection, performance, and style. 
            Upgrade your ride with our quality parts engineered for the ultimate riding experience.
          </p>
        </div>

        {/* Clean Grid Layout - Responsive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 max-w-7xl mx-auto">
          {accessories.map((accessory) => {
            const IconComponent = getAccessoryIcon(accessory.name);
            return (
              <div 
                key={accessory.id}
                className="group cursor-pointer"
                onClick={() => {
                  window.location.href = accessory.link;
                }}
              >
                {/* Product Image Container - Wider, no top/bottom spacing */}
                <div className="relative aspect-[5/3] flex items-center justify-center">
                  {/* Actual product image */}
                  <img 
                    src={accessory.image} 
                    alt={accessory.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback icon if image fails */}
                  <div className="hidden w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Accessory Name - Below image */}
                <div className="text-center mt-0.5 sm:mt-1">
                  <h3 className="text-[8px] sm:text-[9px] font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                    {accessory.name}
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
              window.location.href = '/collections/accessories';
            }}
          >
            View All Accessories
            <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AccessoriesSection;
