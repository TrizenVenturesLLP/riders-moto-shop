import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  stockQuantity: number;
  lowStockThreshold: number;
  weight: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  categoryId: string | null;
  brandId: string | null;
  compatibleModels: string[] | null;
  isActive: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  attributes: any;
  createdAt: string;
  updatedAt: string;
  category: any;
  brand: any;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface FilteredProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  category?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

const fetchFilteredProducts = async (params: FilteredProductsParams = {}): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();
  
  // Add all parameters to search params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/products?${searchParams.toString()}`;
  console.log('🔍 Fetching filtered products:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  console.log('✅ Filtered products received:', data);
  return data;
};

export const useFilteredProducts = (params: FilteredProductsParams = {}) => {
  return useQuery({
    queryKey: ['filtered-products', params],
    queryFn: () => fetchFilteredProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useFilteredProducts;
