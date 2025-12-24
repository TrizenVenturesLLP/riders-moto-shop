import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";

interface BikeModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
}

interface Response {
  success: boolean;
  data: BikeModel;
}

export const useBikeModelBySlug = (slug: string) => {
  return useQuery<Response>({
    queryKey: ["bike-model", slug],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/bike-models/slug/${slug}`);

      if (!res.ok) {
        throw new Error("Bike model not found");
      }

      return res.json();
    },
    enabled: !!slug,
  });
};
