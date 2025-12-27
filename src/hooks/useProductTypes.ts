import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  description?: string;
  sortOrder: number;
  isActive: boolean;
  subProductTypes?: SubProductType[];
}

export interface SubProductType {
  id: string;
  name: string;
  slug: string;
  productTypeId: string;
  productType?: {
    id: string;
    name: string;
    slug: string;
  };
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductTypeOption {
  value: string;
  label: string;
  slug: string;
  name?: string; // For backward compatibility
}

interface ProductTypesResponse {
  success: boolean;
  data: {
    productTypes: ProductType[];
  };
}

interface SubProductTypesResponse {
  success: boolean;
  data: {
    subProductTypes: SubProductType[];
  };
}

// Get product types by category slug
export const useProductTypesByCategory = (categorySlug?: string, includeSubTypes = false) => {
  return useQuery({
    queryKey: ["productTypes", categorySlug, includeSubTypes],
    queryFn: async () => {
      if (!categorySlug) {
        return { success: true, data: { productTypes: [] } };
      }

      const url = `${API_BASE_URL}/product-types?categorySlug=${categorySlug}&includeSubTypes=${includeSubTypes}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product types: ${response.statusText}`);
      }
      
      return response.json() as Promise<ProductTypesResponse>;
    },
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
  });
};

// Get sub product types by product type slug(s)
export const useSubProductTypesByProductType = (productTypeSlugs?: string[]) => {
  return useQuery({
    queryKey: ["subProductTypes", productTypeSlugs],
    queryFn: async () => {
      if (!productTypeSlugs || productTypeSlugs.length === 0) {
        return { success: true, data: { subProductTypes: [] } };
      }

      // Fetch sub product types for each product type slug
      const promises = productTypeSlugs.map(async (slug) => {
        const url = `${API_BASE_URL}/product-types/sub-product-types?productTypeSlug=${slug}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch sub product types for ${slug}:`, response.statusText);
          return { success: true, data: { subProductTypes: [] } };
        }
        
        return response.json() as Promise<SubProductTypesResponse>;
      });

      const results = await Promise.all(promises);
      
      // Combine all sub product types and remove duplicates
      const allSubProductTypes = results.flatMap(result => result.data?.subProductTypes || []);
      const uniqueSubProductTypes = Array.from(
        new Map(allSubProductTypes.map(spt => [spt.slug, spt])).values()
      );

      return {
        success: true,
        data: { subProductTypes: uniqueSubProductTypes }
      } as SubProductTypesResponse;
    },
    enabled: !!productTypeSlugs && productTypeSlugs.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Get all sub product types for apparels (when no product type is selected)
export const useAllSubProductTypesForApparels = () => {
  return useQuery({
    queryKey: ["allSubProductTypes", "apparels"],
    queryFn: async () => {
      // First get all product types for apparels
      const productTypesUrl = `${API_BASE_URL}/product-types?categorySlug=apparels`;
      const productTypesResponse = await fetch(productTypesUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      });

      if (!productTypesResponse.ok) {
        throw new Error(`Failed to fetch product types: ${productTypesResponse.statusText}`);
      }

      const productTypesData = await productTypesResponse.json() as ProductTypesResponse;
      const productTypeSlugs = productTypesData.data.productTypes.map(pt => pt.slug);

      if (productTypeSlugs.length === 0) {
        return { success: true, data: { subProductTypes: [] } };
      }

      // Then fetch sub product types for all product types
      const promises = productTypeSlugs.map(async (slug) => {
        const url = `${API_BASE_URL}/product-types/sub-product-types?productTypeSlug=${slug}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch sub product types for ${slug}:`, response.statusText);
          return { success: true, data: { subProductTypes: [] } };
        }
        
        return response.json() as Promise<SubProductTypesResponse>;
      });

      const results = await Promise.all(promises);
      
      // Combine all sub product types and remove duplicates
      const allSubProductTypes = results.flatMap(result => result.data?.subProductTypes || []);
      const uniqueSubProductTypes = Array.from(
        new Map(allSubProductTypes.map(spt => [spt.slug, spt])).values()
      ).sort((a, b) => a.name.localeCompare(b.name));

      return {
        success: true,
        data: { subProductTypes: uniqueSubProductTypes }
      } as SubProductTypesResponse;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Convert ProductType to ProductTypeOption format (for backward compatibility)
export const convertToProductTypeOption = (pt: ProductType): ProductTypeOption => ({
  value: pt.slug,
  label: pt.name,
  slug: pt.slug,
  name: pt.name, // Add name for compatibility
});

export const convertSubToProductTypeOption = (spt: SubProductType): ProductTypeOption => ({
  value: spt.slug,
  label: spt.name,
  slug: spt.slug,
  name: spt.name, // Add name for compatibility
});

