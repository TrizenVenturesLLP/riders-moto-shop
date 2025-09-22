import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <Zap className="h-8 w-8 text-primary mr-3" />
          <span className="text-primary font-semibold">Premium Bike Parts</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-glow">
          Ride Better.
          <br />
          <span className="text-primary">Shop Smarter.</span>
        </h1>
        
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Discover premium motorcycle parts and accessories. From performance upgrades to essential maintenance, we've got everything to keep you riding at your best.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 glow-red">
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
            Browse Categories
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">5000+</div>
            <div className="text-sm text-gray-300">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">50k+</div>
            <div className="text-sm text-gray-300">Happy Riders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;