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

// Fallback function to fetch all products and filter client-side
const fetchAllProductsWithClientFiltering = async (params: FilteredProductsParams) => {
  console.log('🔄 Fetching all products for client-side filtering...');
  
  const response = await fetch(`${API_BASE_URL}/products?page=1&limit=1000`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  let products = data.data.products || [];
  
  // Client-side filtering
  if (params.brand) {
    products = products.filter((product: any) => 
      product.brand?.slug?.toLowerCase() === params.brand?.toLowerCase() ||
      product.brand?.name?.toLowerCase() === params.brand?.toLowerCase()
    );
  }
  
  if (params.model) {
    products = products.filter((product: any) => 
      product.compatibleModels?.some((model: string) => 
        model.toLowerCase().includes(params.model?.toLowerCase() || '')
      )
    );
  }
  
  if (params.category) {
    products = products.filter((product: any) => 
      product.category?.slug?.toLowerCase() === params.category?.toLowerCase() ||
      product.category?.name?.toLowerCase() === params.category?.toLowerCase()
    );
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    products = products.filter((product: any) => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  console.log(`✅ Client-side filtering complete: ${paginatedProducts.length} products found`);
  
  return {
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
        totalItems: products.length,
        itemsPerPage: limit
      }
    }
  };
};

export const useFilteredProducts = (params: FilteredProductsParams = {}) => {
  return useQuery({
    queryKey: ['filtered-products', params],
    queryFn: async () => {
      try {
        // Try the filtered API first
        return await fetchFilteredProducts(params);
      } catch (error: any) {
        // If filtered API fails (e.g., 500 error), fallback to client-side filtering
        if (error?.response?.status === 500 || error?.message?.includes('500') || error?.message?.includes('invalid input syntax')) {
          console.warn('Filtered API failed, falling back to client-side filtering:', error.message);
          return await fetchAllProductsWithClientFiltering(params);
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useFilteredProducts;
