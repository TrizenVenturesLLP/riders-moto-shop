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

export const useProduct = (productId: string) => {
  return useQuery<ProductResponse>({
    queryKey: ['product', productId],
    queryFn: async () => {
      console.log('🔍 Fetching product with ID:', productId);
      console.log('🔍 API URL:', `${API_BASE_URL}/products/${productId}`);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Product data received:', data);
      return data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useProduct;
