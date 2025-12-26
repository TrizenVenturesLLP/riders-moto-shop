import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';

interface HeroCarouselItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  bikeModelId: string | null;
  link: string | null;
  buttonText: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  bikeModel?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface HeroCarouselResponse {
  success: boolean;
  data: {
    carouselItems: HeroCarouselItem[];
  };
}

// Fetch hero carousel items (public endpoint - only active items)
const fetchHeroCarousel = async (pageType?: string): Promise<HeroCarouselResponse> => {
  const url = new URL(`${API_BASE_URL}/hero-carousel`);
  if (pageType) {
    url.searchParams.append('pageType', pageType);
  }
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hero carousel items');
  }

  return response.json();
};

// Hook to fetch hero carousel items
export const useHeroCarousel = (pageType?: string) => {
  return useQuery<HeroCarouselResponse>({
    queryKey: ['hero-carousel', pageType],
    queryFn: () => fetchHeroCarousel(pageType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export type { HeroCarouselItem };

