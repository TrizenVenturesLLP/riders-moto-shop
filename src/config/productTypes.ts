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
  
  // Apparels (Category: Apparels, Product Types: jackets, pants, t-shirts, etc.)
  'apparels': [
    { value: 'jacket', label: 'Jacket', slug: 'jacket' },
    { value: 'pants', label: 'Pants', slug: 'pants' },
    { value: 't-shirt', label: 'T-Shirt', slug: 't-shirt' },
    { value: 'gloves', label: 'Gloves', slug: 'gloves' },
    { value: 'apparel-accessory', label: 'Apparel Accessory', slug: 'apparel-accessory' },
  ],
};

// Sub-product types for apparels (shown when product type is selected)
export const APPAREL_SUB_PRODUCT_TYPES: Record<string, ProductTypeOption[]> = {
  'jacket': [
    { value: 'riding-jacket', label: 'Riding Jacket', slug: 'riding-jacket' },
    { value: 'leather-jacket', label: 'Leather Jacket', slug: 'leather-jacket' },
    { value: 'textile-jacket', label: 'Textile Jacket', slug: 'textile-jacket' },
    { value: 'mesh-jacket', label: 'Mesh Jacket', slug: 'mesh-jacket' },
    { value: 'winter-jacket', label: 'Winter Jacket', slug: 'winter-jacket' },
  ],
  'pants': [
    { value: 'riding-pants', label: 'Riding Pants', slug: 'riding-pants' },
    { value: 'leather-pants', label: 'Leather Pants', slug: 'leather-pants' },
    { value: 'textile-pants', label: 'Textile Pants', slug: 'textile-pants' },
    { value: 'jeans', label: 'Riding Jeans', slug: 'jeans' },
    { value: 'overpants', label: 'Overpants', slug: 'overpants' },
  ],
  't-shirt': [
    { value: 'casual-t-shirt', label: 'Casual T-Shirt', slug: 'casual-t-shirt' },
    { value: 'graphic-t-shirt', label: 'Graphic T-Shirt', slug: 'graphic-t-shirt' },
    { value: 'polo-t-shirt', label: 'Polo T-Shirt', slug: 'polo-t-shirt' },
    { value: 'v-neck-t-shirt', label: 'V-Neck T-Shirt', slug: 'v-neck-t-shirt' },
    { value: 'crew-neck-t-shirt', label: 'Crew Neck T-Shirt', slug: 'crew-neck-t-shirt' },
  ],
  'gloves': [
    { value: 'summer-gloves', label: 'Summer Gloves', slug: 'summer-gloves' },
    { value: 'winter-gloves', label: 'Winter Gloves', slug: 'winter-gloves' },
    { value: 'racing-gloves', label: 'Racing Gloves', slug: 'racing-gloves' },
    { value: 'touring-gloves', label: 'Touring Gloves', slug: 'touring-gloves' },
    { value: 'waterproof-gloves', label: 'Waterproof Gloves', slug: 'waterproof-gloves' },
  ],
  'apparel-accessory': [
    { value: 'knee-guards', label: 'Knee Guards', slug: 'knee-guards' },
    { value: 'elbow-guards', label: 'Elbow Guards', slug: 'elbow-guards' },
    { value: 'back-protector', label: 'Back Protector', slug: 'back-protector' },
    { value: 'neck-warmer', label: 'Neck Warmer', slug: 'neck-warmer' },
    { value: 'balaclava', label: 'Balaclava', slug: 'balaclava' },
    { value: 'socks', label: 'Riding Socks', slug: 'socks' },
  ],
};

// Get sub-product types for an apparel product type
export const getSubProductTypesForApparel = (productType: string): ProductTypeOption[] => {
  return APPAREL_SUB_PRODUCT_TYPES[productType] || [];
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

