import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBikeModels } from '@/hooks/useBikeModels';
import { Link } from 'react-router-dom';

// Default taglines for bike models (can be extended)
const defaultTaglines: Record<string, string> = {
  'super-meteor-650': 'Cruise in Style',
  'himalayan-450': 'Adventure Awaits',
  'classic-350': 'Timeless Legend',
  'hunter-350': 'Urban Explorer',
  'interceptor-650': 'Pure Performance',
  'continental-gt-650': 'Racing Heritage',
  'scram-411': 'Off-Road Ready',
  'meteor-350': 'Smooth Cruiser',
};

const HeroSection = () => {
  const { data: bikeModels = [], isLoading } = useBikeModels({ isActive: true });
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // Transform bike models into slides format
  const bikeSlides = useMemo(() => {
    return bikeModels.slice(0, 5).map((bike) => ({
      id: bike.id,
      name: bike.name,
      brand: bike.brand?.name || '',
      tagline: defaultTaglines[bike.slug] || 'Premium Parts Available',
      image: bike.image || '/shop_by_bikes_imgs/default-bike.webp',
      link: `/collections/bikes/${bike.slug}`
    }));
  }, [bikeModels]);

  // Auto-play carousel - always running
  useEffect(() => {
    if (bikeSlides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bikeSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bikeSlides.length]);

  const nextSlide = () => {
    if (bikeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % bikeSlides.length);
  };

  const prevSlide = () => {
    if (bikeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + bikeSlides.length) % bikeSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show loading state
  if (isLoading || bikeSlides.length === 0) {
    return (
      <section className="relative h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading featured bikes...</p>
        </div>
      </section>
    );
  }

  const currentBike = bikeSlides[currentSlide];

  return (
    <section className="relative h-[400px] sm:h-[450px] md:h-[500px] flex flex-col overflow-hidden">
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
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Content - Positioned at Bottom */}
      <div className="relative z-10 mt-auto text-center max-w-3xl mx-auto px-4 pb-6 sm:pb-8 md:pb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
          {currentBike.name}
        </h1>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mb-4 sm:mb-6">
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

        {/* Shop Now Button */}
        <div className="flex justify-center px-2">
          <Link to={currentBike.link}>
            <Button 
              size="default" 
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-semibold text-sm sm:text-base w-auto max-w-[200px] sm:max-w-none"
            >
              Shop Now
              <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;