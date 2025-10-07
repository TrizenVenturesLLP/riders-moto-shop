import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import AccessoriesSection from '@/components/sections/AccessoriesSection';
import ProductGrid from '@/components/sections/ProductGrid';
import DebugProducts from '@/components/DebugProducts';
import APITest from '@/components/APITest';

const Index = () => {
  return (
    <main>
      <HeroSection />
      <AccessoriesSection />
      <ProductGrid />
      <APITest />
      <DebugProducts />
    </main>
  );
};

export default Index;
