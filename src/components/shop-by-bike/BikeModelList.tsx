import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

interface BikeModel {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  brandId: string;
  brandSlug: string;
}

export default function BikeModelList({ brandId, brandSlug }: Props) {
  const [models, setModels] = useState<BikeModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/bike-models?brandId=${brandId}`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data.data || data);
      });
  }, [brandId]);

  return (
    <div className="bike-model-list">
      {models.map((model) => (
        <button
          key={model.id}
          className="bike-model-item"
          onClick={() => navigate(`/bikes/${brandSlug}/${model.slug}`)}
        >
          {model.name}
        </button>
      ))}
    </div>
  );
}
