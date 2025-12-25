import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';

export interface BikeModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  brandId: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface BikeModelsResponse {
  success: boolean;
  data: {
    bikeModels: BikeModel[];
  };
}

export const useBikeModels = (filters?: { brandId?: string; isActive?: boolean }) => {
  return useQuery<BikeModel[]>({
    queryKey: ['bikeModels', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.brandId) params.append('brandId', filters.brandId);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      
      const response = await fetch(`${API_BASE_URL}/bike-models?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bike models');
      }
      const result: BikeModelsResponse = await response.json();
      return result.data.bikeModels;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

