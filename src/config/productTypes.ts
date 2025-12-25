// Product Types mapping by Category
// Based on the 4 main categories: Touring, Protection, Performance, Auxiliary

export interface ProductTypeOption {
  value: string;
  label: string;
  slug: string;
}

export const CATEGORY_PRODUCT_TYPES: Record<string, ProductTypeOption[]> = {
  // Touring Accessories
  'touring-accessories': [
    { value: 'back-rest', label: 'Back Rest', slug: 'back-rest' },
    { value: 'top-rack', label: 'Top Rack', slug: 'top-rack' },
    { value: 'luggage-carrier', label: 'Luggage Carrier', slug: 'luggage-carrier' },
    { value: 'saddle-stay', label: 'Saddle Stay', slug: 'saddle-stay' },
    { value: 'gps-mount', label: 'GPS Mount', slug: 'gps-mount' },
    { value: 'fog-light-clamp', label: 'Fog Light Clamp', slug: 'fog-light-clamp' },
    { value: 'toprack-saddle-stay', label: 'Toprack Saddle Stay', slug: 'toprack-saddle-stay' },
    { value: 'top-plate', label: 'Top Plate', slug: 'top-plate' },
  ],
  
  // Protection Accessories
  'protection-accessories': [
    { value: 'crash-guard', label: 'Crash Guard', slug: 'crash-guard' },
    { value: 'engine-guard', label: 'Engine Guard', slug: 'engine-guard' },
    { value: 'radiator-guard', label: 'Radiator Guard', slug: 'radiator-guard' },
    { value: 'chain-guard', label: 'Chain Guard', slug: 'chain-guard' },
    { value: 'sump-guard', label: 'Sump Guard', slug: 'sump-guard' },
    { value: 'tank-pad', label: 'Tank Pad', slug: 'tank-pad' },
    { value: 'frame-slider', label: 'Frame Slider', slug: 'frame-slider' },
  ],
  
  // Performance Accessories
  'performance-accessories': [
    { value: 'silencer', label: 'Silencer', slug: 'silencer' },
    { value: 'exhaust', label: 'Exhaust', slug: 'exhaust' },
    { value: 'air-filter', label: 'Air Filter', slug: 'air-filter' },
    { value: 'ecu-tuning', label: 'ECU Tuning', slug: 'ecu-tuning' },
    { value: 'suspension', label: 'Suspension', slug: 'suspension' },
    { value: 'brake-kit', label: 'Brake Kit', slug: 'brake-kit' },
  ],
  
  // Auxiliary Accessories
  'auxiliary-accessories': [
    { value: 'foot-rest', label: 'Foot Rest', slug: 'foot-rest' },
    { value: 'master-cylinder-cap', label: 'Master Cylinder Cap', slug: 'master-cylinder-cap' },
    { value: 'paddock-stand', label: 'Paddock Stand', slug: 'paddock-stand' },
    { value: 'handle-bar', label: 'Handle Bar', slug: 'handle-bar' },
    { value: 'visor', label: 'Visor', slug: 'visor' },
    { value: 'side-stand-base', label: 'Side Stand Base', slug: 'side-stand-base' },
    { value: 'tail-tidy', label: 'Tail Tidy', slug: 'tail-tidy' },
  ],
};

// Get product types for a category
export const getProductTypesForCategory = (categorySlug: string): ProductTypeOption[] => {
  return CATEGORY_PRODUCT_TYPES[categorySlug] || [];
};

// Get all product types (flattened)
export const getAllProductTypes = (): ProductTypeOption[] => {
  return Object.values(CATEGORY_PRODUCT_TYPES).flat();
};

// Find product type by value
export const findProductType = (value: string): ProductTypeOption | undefined => {
  return getAllProductTypes().find(pt => pt.value === value || pt.slug === value);
};

