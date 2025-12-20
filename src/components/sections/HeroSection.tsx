import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[560px] md:h-[640px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Premium motorcycle parts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Zap className="h-5 w-5 text-red-600" />
          <span className="text-sm font-semibold tracking-wide text-red-600 uppercase">
            Premium Bike Parts
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
          Ride Better.
          <br />
          <span className="text-red-600">Shop Smarter.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Premium motorcycle parts and accessories built for performance,
          protection, and everyday riding.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md"
            onClick={() => scrollToSection('featured-products')}
          >
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-12 px-8 border-white text-white hover:bg-white hover:text-black font-semibold rounded-md"
            onClick={() => scrollToSection('shop-accessories')}
          >
            Browse Accessories
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto">
          {[
            { value: '5000+', label: 'Products' },
            { value: '50k+', label: 'Riders' },
            { value: '24/7', label: 'Support' }
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-xl font-bold text-red-600">
                {item.value}
              </div>
              <div className="text-xs text-gray-400 tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
