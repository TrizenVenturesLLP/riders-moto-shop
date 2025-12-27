import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { mockProducts } from "../mock/products";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  comparePrice?: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
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
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

const USE_MOCK_DATA = false; // Changed to fetch from API

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

/**
 * Filters supported:
 * - brand, model, category, productType (slug)
 * - minPrice, maxPrice
 * - inStock, featured
 * - search, sort, order, page, limit
 */
export interface UseProductsParams {
  brand?: string;
  model?: string;
  category?: string;
  productType?: string;
  subProductType?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  endpoint?: string; // Optional: specify custom endpoint (e.g., '/products/apparels')
}

const fetchProducts = async (
  params: UseProductsParams
): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();

  // Determine endpoint - use custom endpoint if provided, otherwise default to /products
  const endpoint = params.endpoint || '/products';
  
  // Remove endpoint from params before building query string
  const { endpoint: _, ...queryParams } = params;

  // Add all parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}${endpoint}?${searchParams.toString()}`;

  console.log("🔍 Fetching products:", url);
  console.log("🔍 API Base URL:", API_BASE_URL);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add credentials for CORS if needed
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Product fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url
      });
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Products fetched successfully:", data);
    return data;
  } catch (error: any) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error("❌ Network error (CORS or connection issue):", error.message);
      console.error("❌ API URL:", url);
      throw new Error(`Network error: Unable to reach API at ${API_BASE_URL}. Please check CORS configuration and API availability.`);
    }
    throw error;
  }
};

const filterMockProducts = (params: UseProductsParams): ProductsResponse => {
  let filtered = [...mockProducts];

  // Apply filters
  if (params.brand) {
    filtered = filtered.filter((p) => p.brand?.slug === params.brand);
  }

  if (params.model) {
    filtered = filtered.filter(
      (p) => p.compatibleModels && p.compatibleModels.includes(params.model)
    );
  }

  if (params.category) {
    filtered = filtered.filter((p) => p.category?.slug === params.category);
  }

  if (params.productType) {
    filtered = filtered.filter((p) => p.productType?.slug === params.productType);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) <= params.maxPrice!);
  }

  if (params.inStock) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  if (params.featured) {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (params.sort) {
    const sortField = params.sort;
    const isAsc = params.order === 'ASC';
    
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      if (sortField === 'price') {
        aVal = parseFloat(a.price);
        bVal = parseFloat(b.price);
      } else if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortField === 'createdAt') {
        // For mock data, use name as fallback since we don't have createdAt
        aVal = a.name;
        bVal = b.name;
      } else {
        aVal = (a as any)[sortField];
        bVal = (b as any)[sortField];
      }
      
      if (typeof aVal === 'string') {
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return isAsc ? aVal - bVal : bVal - aVal;
    });
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const paginatedProducts = filtered.slice(start, start + limit);

  return {
    success: true,
    data: {
      products: paginatedProducts as unknown as Product[],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filtered.length / limit),
        totalItems: filtered.length,
        itemsPerPage: limit,
      },
    },
  };
};

export const useProducts = (params: UseProductsParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        console.log("🧪 Using MOCK products", params);
        await new Promise((r) => setTimeout(r, 300)); // fake latency
        return filterMockProducts(params);
      }

      return fetchProducts(params);
    },
    staleTime: 5 * 60 * 1000, // 5 min
    // cacheTime: 10 * 60 * 1000, // 10 min
  });
};
