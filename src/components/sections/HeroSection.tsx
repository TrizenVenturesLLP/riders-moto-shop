import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  // Function to smoothly scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="Premium motorcycle with parts"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
          <span className="text-xs sm:text-sm text-red-600 font-medium">Premium Bike Parts</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
          Ride Better.
          <br />
          <span className="text-red-600">Shop Smarter.</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
          Discover premium motorcycle parts and accessories. From performance upgrades to essential maintenance, we've got everything to keep you riding at your best.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2">
          <Button 
            size="default" 
            className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-semibold text-sm sm:text-base w-full sm:w-auto"
            onClick={() => scrollToSection('featured-products')}
          >
            Shop Now
            <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className="bg-white/10 border border-white/30 text-white hover:bg-white hover:text-black px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-medium text-sm sm:text-base w-full sm:w-auto"
            onClick={() => scrollToSection('shop-accessories')}
          >
            Browse Accessories
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10 max-w-md mx-auto px-2">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-red-600">5000+</div>
            <div className="text-[10px] sm:text-xs text-gray-300">Products</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-red-600">50k+</div>
            <div className="text-[10px] sm:text-xs text-gray-300">Happy Riders</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-red-600">24/7</div>
            <div className="text-[10px] sm:text-xs text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;