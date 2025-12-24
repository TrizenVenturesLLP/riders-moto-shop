import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

// Bike carousel data
const bikeSlides = [
  {
    id: 'super-meteor-650',
    name: 'Super Meteor 650',
    brand: 'Royal Enfield',
    tagline: 'Cruise in Style',
    image: '/shop_by_bikes_imgs/super-meteor-650.webp',
    link: '/collections/super-meteor-650'
  },
  {
    id: 'himalayan-450',
    name: 'Himalayan 450',
    brand: 'Royal Enfield',
    tagline: 'Adventure Awaits',
    image: '/shop_by_bikes_imgs/himalayan-450.webp',
    link: '/collections/himalayan-450'
  },
  {
    id: 'classic-350',
    name: 'Classic 350',
    brand: 'Royal Enfield',
    tagline: 'Timeless Legend',
    image: '/shop_by_bikes_imgs/classic-350.webp',
    link: '/collections/classic-350'
  },
  {
    id: 'hunter-350',
    name: 'Hunter 350',
    brand: 'Royal Enfield',
    tagline: 'Urban Explorer',
    image: '/shop_by_bikes_imgs/hunter-350.webp',
    link: '/collections/hunter-350'
  },
  {
    id: 'interceptor-650',
    name: 'Interceptor 650',
    brand: 'Royal Enfield',
    tagline: 'Pure Performance',
    image: '/shop_by_bikes_imgs/interceptor-650.webp',
    link: '/collections/interceptor-650'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel - always running
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bikeSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bikeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bikeSlides.length) % bikeSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentBike = bikeSlides[currentSlide];

  return (
    <section className="relative h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {bikeSlides.map((bike, index) => (
          <div
            key={bike.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={bike.image} 
              alt={bike.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to placeholder
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
          <span className="text-xs sm:text-sm text-red-600 font-medium">Premium Bike Parts</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
          {currentBike.name}
          <br />
          <span className="text-red-600">{currentBike.tagline}</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
          Discover premium motorcycle parts and accessories for your {currentBike.name}. From performance upgrades to essential maintenance, we've got everything to keep you riding at your best.
        </p>

        <div className="flex justify-center px-2">
          <Button 
            size="default" 
            className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-semibold text-sm sm:text-base w-full sm:w-auto"
            onClick={() => window.location.href = currentBike.link}
          >
            Shop Now
            <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {bikeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-red-600 w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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