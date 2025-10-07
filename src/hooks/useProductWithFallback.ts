import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';

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
  price: number;
  comparePrice?: number;
  description?: string;
  shortDescription?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  images: ProductImage[];
  isActive: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
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

export const useProductWithFallback = (productId: string) => {
  // First try to get the product directly
  const directQuery = useQuery<ProductResponse>({
    queryKey: ['product', productId],
    queryFn: async () => {
      console.log('🔍 Fetching product directly with ID:', productId);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // If direct query fails, try to find the product in the products list
  const fallbackQuery = useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('🔍 Fallback: Fetching all products to find:', productId);
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products list');
      }
      
      return response.json();
    },
    enabled: !!productId && directQuery.isError,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
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

  return {
    data: null,
    isLoading: directQuery.isLoading || fallbackQuery.isLoading,
    error: directQuery.error || fallbackQuery.error,
    source: 'none'
  };
};

export default useProductWithFallback;
