import { useMemo } from 'react';
import { useBikeModels } from '@/hooks/useBikeModels';

const BRAND_ORDER = [
  'ROYAL ENFIELD',
  'KTM',
  'HONDA',
  'HERO',
  'TRIUMPH',
  'YAMAHA',
  'BAJAJ',
  'TVS',
  'SUZUKI',
  'KAWASAKI',
  'BENELLI',
  'DUCATI'
];

export interface BikeBrandGroup {
  brandId?: string;
  brandSlug?: string;
  brandName: string;
  bikes: Array<{
    id: string;
    name: string;
    slug: string;
    brand?: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export const useBikesByBrand = () => {
  const { data: bikeModels = [], isLoading } = useBikeModels({ isActive: true });

  const bikesByBrand = useMemo(() => {
    if (!bikeModels || bikeModels.length === 0) return {};
    
    const grouped = bikeModels.reduce((acc, bike) => {
      const brandName = bike.brand?.name?.toUpperCase() || 'OTHER';
      if (!acc[brandName]) {
        acc[brandName] = {
          brandId: bike.brand?.id,
          brandSlug: bike.brand?.slug,
          brandName: bike.brand?.name || 'Other', // Keep original case for display
          bikes: []
        };
      }
      acc[brandName].bikes.push(bike);
      return acc;
    }, {} as Record<string, BikeBrandGroup>);

    // Sort brands according to brandOrder, then alphabetically for others
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      const indexA = BRAND_ORDER.indexOf(a);
      const indexB = BRAND_ORDER.indexOf(b);
      
      // If both are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in the list, A comes first
      if (indexA !== -1) return -1;
      // If only B is in the list, B comes first
      if (indexB !== -1) return 1;
      // If neither is in the list, sort alphabetically
      return a.localeCompare(b);
    });

    // Convert back to object with correct order
    const ordered: Record<string, BikeBrandGroup> = {};
    sortedEntries.forEach(([key, value]) => {
      ordered[key] = value;
    });

    return ordered;
  }, [bikeModels]);

  return { bikesByBrand, isLoading };
};


