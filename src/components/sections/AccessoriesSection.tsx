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
    <section id="shop-accessories" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Premium Accessories
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Shop by <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Accessories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Premium motorcycle accessories for protection, performance, and style. 
            Upgrade your ride with our quality parts engineered for the ultimate riding experience.
          </p>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {accessories.map((accessory) => {
            const IconComponent = getAccessoryIcon(accessory.name);
            return (
              <div 
                key={accessory.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  window.location.href = accessory.link;
                }}
              >
                {/* Product Image Container */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                  {/* Actual product image */}
                  <img 
                    src={accessory.image} 
                    alt={accessory.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500 ease-out"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback icon if image fails */}
                  <div className="hidden w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-red-600" />
                  </div>
                </div>

                {/* Accessory Name */}
                <div className="p-4 text-center">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide group-hover:text-red-600 transition-colors">
                    {accessory.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern View All Button */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
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
