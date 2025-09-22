import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import ProductGrid from '@/components/sections/ProductGrid';

const Index = () => {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <ProductGrid />
    </main>
  );
};

export default Index;
