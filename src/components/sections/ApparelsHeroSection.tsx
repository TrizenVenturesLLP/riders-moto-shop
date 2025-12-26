import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeroCarousel } from '@/hooks/useHeroCarousel';

const ApparelsHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch apparels hero carousel from backend
  const { data: carouselData, isLoading } = useHeroCarousel('apparels');
  
  // Use backend data if available, otherwise fallback to static slides
  const apparelsCarouselSlides = useMemo(() => {
    if (carouselData?.data?.carouselItems && carouselData.data.carouselItems.length > 0) {
      return carouselData.data.carouselItems.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle || '',
        image: item.image,
        link: item.link || '/collections/apparels',
        buttonText: item.buttonText || 'Shop Now',
      }));
    }
    
    // Fallback static slides
    return [
  {
    id: 'apparels-1',
    title: 'Premium Motorcycle Gear',
    subtitle: 'Ride in Style & Safety',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&h=1080&fit=crop&q=80',
    link: '/collections/apparels',
    buttonText: 'Shop Now',
  },
  {
    id: 'apparels-2',
    title: 'Racing Apparel Collection',
    subtitle: 'Professional Grade Protection',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80',
    link: '/collections/apparels',
    buttonText: 'Explore Collection',
  },
  {
    id: 'apparels-3',
    title: 'Touring Gear Essentials',
    subtitle: 'Comfort for Long Rides',
    image: 'https://images.unsplash.com/photo-1558980664-1db506751751?w=1920&h=1080&fit=crop&q=80',
    link: '/collections/apparels',
    buttonText: 'Shop Now',
  },
  {
    id: 'apparels-4',
    title: 'Urban Riding Apparel',
    subtitle: 'Style Meets Functionality',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80',
    link: '/collections/apparels',
    buttonText: 'Shop Now',
  },
  ];
  }, [carouselData]);

  // Auto-play carousel - always running
  useEffect(() => {
    if (apparelsCarouselSlides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % apparelsCarouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [apparelsCarouselSlides.length]);

  const nextSlide = () => {
    if (apparelsCarouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % apparelsCarouselSlides.length);
  };

  const prevSlide = () => {
    if (apparelsCarouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + apparelsCarouselSlides.length) % apparelsCarouselSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-[450px] sm:h-[500px] md:h-[550px] flex items-center justify-center overflow-hidden bg-muted">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Loading hero carousel...</p>
        </div>
      </section>
    );
  }

  if (apparelsCarouselSlides.length === 0) {
    return (
      <section className="relative h-[450px] sm:h-[500px] md:h-[550px] flex items-center justify-center overflow-hidden bg-muted">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No apparel banners available.</p>
        </div>
      </section>
    );
  }

  const currentSlideData = apparelsCarouselSlides[currentSlide];

  return (
    <section className="relative h-[450px] sm:h-[500px] md:h-[550px] flex flex-col overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {apparelsCarouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to placeholder
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&h=1080&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 px-2">
          {currentSlideData.title}
        </h1>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mb-4 sm:mb-6">
          {apparelsCarouselSlides.map((_, index) => (
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
          <Link to={currentSlideData.link}>
            <Button 
              size="default" 
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-none font-semibold text-sm sm:text-base w-auto max-w-[200px] sm:max-w-none"
            >
              {currentSlideData.buttonText}
              <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ApparelsHeroSection;

