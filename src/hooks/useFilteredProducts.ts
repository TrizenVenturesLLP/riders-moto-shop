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
  console.log('🌐 API Base URL:', API_BASE_URL);
  
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
  
  // Debug: Log the actual product data structure
  console.log('📦 Raw products data:', products.length > 0 ? products[0] : 'No products');
  console.log('📦 Sample product structure:', {
    name: products[0]?.name,
    brand: products[0]?.brand,
    category: products[0]?.category,
    compatibleModels: products[0]?.compatibleModels
  });
  
  // Client-side filtering with improved logic
  console.log('🔍 Filtering parameters:', params);
  
  if (params.brand) {
    const brandFilter = params.brand.toLowerCase();
    const brandSpaced = brandFilter.replace(/-/g, ' ');
    console.log('🏷️ Filtering by brand:', brandFilter, '->', brandSpaced);
    products = products.filter((product: any) => {
      const productBrand = product.brand?.slug?.toLowerCase() || product.brand?.name?.toLowerCase();
      const productName = product.name?.toLowerCase() || '';
      
      // More flexible brand matching
      const brandMatch = productBrand === brandFilter || 
                        productBrand === brandSpaced ||
                        productBrand?.includes(brandFilter) ||
                        productBrand?.includes(brandSpaced) ||
                        brandFilter.includes(productBrand || '') ||
                        brandSpaced.includes(productBrand || '');
      
      // Check if product name contains the brand
      const nameMatch = productName.includes(brandFilter) || 
                       productName.includes(brandSpaced) ||
                       productName.includes(brandFilter.replace(' ', '')) ||
                       productName.includes(brandSpaced.replace(' ', ''));
      
      const matches = brandMatch || nameMatch;
      if (matches) console.log('✅ Brand match:', product.name, '->', { brandMatch, nameMatch, productBrand, productName });
      return matches;
    });
    console.log(`📊 After brand filter: ${products.length} products`);
  }
  
  if (params.model) {
    const modelFilter = params.model.toLowerCase();
    const modelSpaced = modelFilter.replace(/-/g, ' ');
    console.log('🏍️ Filtering by model:', modelFilter, '->', modelSpaced);
    products = products.filter((product: any) => {
      // Check multiple possible model fields
      const productName = product.name?.toLowerCase() || '';
      const compatibleModels = product.compatibleModels || [];
      
      // More flexible model matching - check various combinations
      const nameMatch = productName.includes(modelFilter) || 
                       productName.includes(modelSpaced) ||
                       productName.includes(modelFilter.replace(' ', '')) ||
                       productName.includes(modelSpaced.replace(' ', '')) ||
                       // Handle cases like "aerox 155" vs "aerox-155"
                       productName.includes(modelFilter.replace('-', '')) ||
                       productName.includes(modelSpaced.replace('-', ''));
      
      // Check if compatible models contain the model
      const compatibleMatch = compatibleModels.some((model: string) => 
        model.toLowerCase().includes(modelFilter) || 
        model.toLowerCase().includes(modelSpaced) ||
        model.toLowerCase().includes(modelFilter.replace(' ', '')) ||
        model.toLowerCase().includes(modelSpaced.replace(' ', ''))
      );
      
      const matches = nameMatch || compatibleMatch;
      if (matches) console.log('✅ Model match:', product.name, '->', { nameMatch, compatibleMatch, productName });
      return matches;
    });
    console.log(`📊 After model filter: ${products.length} products`);
  }
  
  if (params.category) {
    const categoryFilter = params.category.toLowerCase();
    console.log('📂 Filtering by category:', categoryFilter);
    products = products.filter((product: any) => {
      const productCategory = product.category?.slug?.toLowerCase() || product.category?.name?.toLowerCase();
      const productName = product.name?.toLowerCase() || '';
      
      // Convert kebab-case to space-separated for better matching
      const categorySpaced = categoryFilter.replace(/-/g, ' ');
      const categoryNoSpaces = categoryFilter.replace(/-/g, '');
      const categoryNoHyphens = categoryFilter.replace(/-/g, '');
      
      // Check category slug/name match
      const categoryMatch = productCategory === categoryFilter || 
                           productCategory === categorySpaced ||
                           productCategory?.includes(categoryFilter) ||
                           productCategory?.includes(categorySpaced) ||
                           productCategory?.includes(categoryNoSpaces);
      
      // Check if product name contains category keywords - be more flexible
      const nameMatch = productName.includes(categorySpaced) || 
                       productName.includes(categoryNoSpaces) ||
                       productName.includes(categoryFilter) ||
                       productName.includes(categoryNoHyphens) ||
                       // Handle variations like "crash guard" vs "crashguard"
                       productName.includes(categorySpaced.replace(' ', '')) ||
                       productName.includes(categoryNoSpaces.replace(' ', ''));
      
      const matches = categoryMatch || nameMatch;
      if (matches) console.log('✅ Category match:', product.name, '->', { categoryMatch, nameMatch, productCategory, productName });
      return matches;
    });
    console.log(`📊 After category filter: ${products.length} products`);
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
  let paginatedProducts = products.slice(startIndex, endIndex);
  
  console.log(`✅ Client-side filtering complete: ${paginatedProducts.length} products found`);
  
  // If no products found after filtering, let's try a more relaxed approach
  if (paginatedProducts.length === 0 && (params.brand || params.model || params.category)) {
    console.log('⚠️ No products found with strict filtering, trying relaxed approach...');
    
    // Reset products and try more relaxed filtering
    products = data.data.products || [];
    let relaxedProducts = [...products];
    
    if (params.brand) {
      const brandFilter = params.brand.toLowerCase();
      const brandSpaced = brandFilter.replace(/-/g, ' ');
      relaxedProducts = relaxedProducts.filter((product: any) => {
        const productName = product.name?.toLowerCase() || '';
        return productName.includes(brandFilter) || productName.includes(brandSpaced);
      });
      console.log(`🔄 Relaxed brand filter: ${relaxedProducts.length} products`);
    }
    
    if (params.model && relaxedProducts.length > 0) {
      const modelFilter = params.model.toLowerCase();
      const modelSpaced = modelFilter.replace(/-/g, ' ');
      relaxedProducts = relaxedProducts.filter((product: any) => {
        const productName = product.name?.toLowerCase() || '';
        return productName.includes(modelFilter) || productName.includes(modelSpaced);
      });
      console.log(`🔄 Relaxed model filter: ${relaxedProducts.length} products`);
    }
    
    if (params.category && relaxedProducts.length > 0) {
      const categoryFilter = params.category.toLowerCase();
      const categorySpaced = categoryFilter.replace(/-/g, ' ');
      relaxedProducts = relaxedProducts.filter((product: any) => {
        const productName = product.name?.toLowerCase() || '';
        return productName.includes(categorySpaced) || productName.includes(categoryFilter);
      });
      console.log(`🔄 Relaxed category filter: ${relaxedProducts.length} products`);
    }
    
    // Apply pagination to relaxed results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    paginatedProducts = relaxedProducts.slice(startIndex, endIndex);
    
    console.log(`🔄 Relaxed filtering complete: ${paginatedProducts.length} products found`);
  }
  
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
        const result = await fetchFilteredProducts(params);
        console.log('🔍 API filtering result:', result);
        
        // If API returns 0 products, try client-side filtering as fallback
        if (result.data.products.length === 0 && (params.brand || params.model || params.category)) {
          console.warn('⚠️ API returned 0 products, trying client-side filtering as fallback');
          return await fetchAllProductsWithClientFiltering(params);
        }
        
        return result;
      } catch (error: any) {
        // If filtered API fails (e.g., 500 error), fallback to client-side filtering
        console.warn('🚨 API call failed, falling back to client-side filtering:', error.message);
        return await fetchAllProductsWithClientFiltering(params);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useFilteredProducts;
