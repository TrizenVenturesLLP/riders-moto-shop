import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';
import { mockProducts } from '@/mock/products';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  comparePrice?: string | number;
  description?: string;
  shortDescription?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  category?: {
    id?: string;
    name: string;
    slug: string;
  };
  brand?: {
    id?: string;
    name: string;
    slug: string;
    logo?: string;
  };
  images: ProductImage[];
  isActive: boolean;
  isDigital?: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

interface ProductsResponse {
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

const USE_MOCK_DATA = true;

export const useProductWithFallback = (productId: string) => {
  // Check mock products immediately (synchronous)
  const mockProduct = mockProducts.find(p => p.id === productId);
  const foundInMock = !!mockProduct && USE_MOCK_DATA;
  
  // If found in mock data, return it immediately
  if (foundInMock) {
    console.log('✅ Found product in mock data:', mockProduct.name);
    return {
      data: {
        success: true,
        data: { product: mockProduct as Product }
      },
      isLoading: false,
      error: null,
      source: 'mock'
    };
  }

  // If not in mock, try API (even if USE_MOCK_DATA is true)
  const directQuery = useQuery<ProductResponse>({
    queryKey: ['product', productId],
    queryFn: async () => {
      console.log('🔍 Fetching product directly with ID:', productId);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Product fetched from API:', data);
      return data;
    },
    enabled: !!productId && !foundInMock, // Enable API if not found in mock
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  // If direct query fails, try to find the product in the products list
  const fallbackQuery = useQuery<ProductsResponse>({
    queryKey: ['products', 'fallback', productId],
    queryFn: async () => {
      console.log('🔍 Fallback: Fetching all products to find:', productId);
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products list');
      }
      
      return response.json();
    },
    enabled: !!productId && !foundInMock && directQuery.isError && !directQuery.isLoading, // Enable fallback only if direct query failed and is not loading
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  // Determine which data to use
  if (directQuery.isSuccess && directQuery.data?.data?.product) {
    return {
      data: directQuery.data,
      isLoading: false,
      error: null,
      source: 'direct'
    };
  }

  if (fallbackQuery.isSuccess && fallbackQuery.data?.data?.products) {
    const foundProduct = fallbackQuery.data.data.products.find(p => p.id === productId);
    if (foundProduct) {
      console.log('✅ Found product in fallback list:', foundProduct.name);
      return {
        data: {
          success: true,
          data: { product: foundProduct }
        },
        isLoading: false,
        error: null,
        source: 'fallback'
      };
    }
  }

  // Return loading/error state
  return {
    data: null,
    isLoading: !foundInMock && (directQuery.isLoading || fallbackQuery.isLoading),
    error: !foundInMock ? (directQuery.error || fallbackQuery.error) : null,
    source: 'none'
  };
};

export default useProductWithFallback;
