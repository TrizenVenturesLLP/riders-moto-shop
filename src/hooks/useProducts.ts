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

const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
