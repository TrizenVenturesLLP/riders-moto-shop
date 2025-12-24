import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import HeroSection from '@/components/sections/HeroSection';
import BikesSection from '@/components/sections/BikesSection';
import AccessoriesSection from '@/components/sections/AccessoriesSection';
import ProductGrid from '@/components/sections/ProductGrid';

const Index = () => {
  // Fetch featured products from API
  const { data, isLoading, error } = useProducts({ 
    featured: true,  // Only fetch featured products
    limit: 12,       // Show more products (12 instead of 6)
    sort: 'createdAt',
    order: 'DESC'
  });
  const products = (data as any)?.data?.products || [];

  return (
    <main>
      <HeroSection />
      <BikesSection />
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
