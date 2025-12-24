import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

interface Brand {
  id: string;
  name: string;
  slug?: string;
}

interface SelectedBrand {
  id: string;
  slug: string;
}

interface Props {
  selectedBrandId: string | null;
  onSelectBrand: (brand: SelectedBrand) => void;
}

export default function BrandList({ selectedBrandId, onSelectBrand }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/brands`)
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.data || data);
      });
  }, []);

  return (
    <div className="brand-list">
      {brands.map((brand) => (
        <button
          key={brand.id}
          className={`brand-item ${
            selectedBrandId === brand.id ? "active" : ""
          }`}
          onClick={() => onSelectBrand({ id: brand.id, slug: brand.slug || brand.name.toLowerCase() })}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}
