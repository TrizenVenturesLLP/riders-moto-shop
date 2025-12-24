import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import HeroSection from '@/components/sections/HeroSection';
import AccessoriesSection from '@/components/sections/AccessoriesSection';
import ProductGrid from '@/components/sections/ProductGrid';

const Index = () => {
  const { data, isLoading, error } = useProducts({ limit: 6 });
  const products = (data as any)?.data?.products || [];

  return (
    <main>
      <HeroSection />
      <AccessoriesSection />
      <ProductGrid 
        products={products}
        isLoading={isLoading}
        error={error}
        title="Featured Products"
      />
    </main>
  );
};

export default Index;
