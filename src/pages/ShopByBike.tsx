import { useState } from 'react';
import BrandList from '@/components/shop-by-bike/BrandList';
import BikeModelList from '@/components/shop-by-bike/BikeModelList';

interface SelectedBrand {
  id: string;
  slug: string;
}

export default function ShopByBike() {
  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(null);

  return (
    <div className="page-container">
      <h1 className="page-title">Shop by Bike</h1>

      <BrandList
        selectedBrandId={selectedBrand?.id || null}
        onSelectBrand={setSelectedBrand}
      />

      {selectedBrand && (
        <BikeModelList brandId={selectedBrand.id} brandSlug={selectedBrand.slug} />
      )}
    </div>
  );
}
