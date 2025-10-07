import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  categoryType?: string;
  sortOrder: number;
  isActive: boolean;
  isVisibleInMenu: boolean;
  icon?: string;
  bannerImage?: string;
  featuredOrder?: number;
  productCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

interface CategoryTreeResponse {
  success: boolean;
  data: {
    tree: Category[];
    totalCategories: number;
  };
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const result: CategoriesResponse = await response.json();
    return result.data.categories.filter(category => category.isActive && category.isVisibleInMenu);
  } catch (error) {
    console.warn('Failed to fetch categories from backend, using fallback data:', error);
    
    // Fallback to static categories if backend is not available
    return [
      {
        id: "cat-1",
        name: "Brakes",
        slug: "brakes",
        description: "High-performance brake systems",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 1,
        productCount: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-2",
        name: "Tires",
        slug: "tires",
        description: "Premium motorcycle tires",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 2,
        productCount: 300,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-3",
        name: "Engine Parts",
        slug: "engine-parts",
        description: "Performance engine components",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 3,
        productCount: 800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-4",
        name: "Accessories",
        slug: "accessories",
        description: "Gear, tools & essentials",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 4,
        productCount: 600,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

const fetchCategoryTree = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/tree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category tree');
    }

    const result: CategoryTreeResponse = await response.json();
    return result.data.tree;
  } catch (error) {
    console.warn('Failed to fetch category tree from backend, using fallback data:', error);
    
    // Fallback to static tree structure
    return [
      {
        id: "cat-1",
        name: "Brakes",
        slug: "brakes",
        description: "High-performance brake systems",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 1,
        productCount: 500,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-2",
        name: "Tires",
        slug: "tires",
        description: "Premium motorcycle tires",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 2,
        productCount: 300,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-3",
        name: "Engine Parts",
        slug: "engine-parts",
        description: "Performance engine components",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 3,
        productCount: 800,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat-4",
        name: "Accessories",
        slug: "accessories",
        description: "Gear, tools & essentials",
        isActive: true,
        isVisibleInMenu: true,
        level: 1,
        sortOrder: 4,
        productCount: 600,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: fetchCategoryTree,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

