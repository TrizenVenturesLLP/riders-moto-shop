import React from 'react';
import { useProducts } from '@/hooks/useProducts';

const DebugProducts = () => {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const products = data?.data?.products || [];

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Available Products ({products.length})</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="p-2 bg-white rounded border">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-600">ID: {product.id}</div>
            <div className="text-sm text-gray-600">SKU: {product.sku}</div>
            <div className="text-sm text-gray-600">Price: Rs. {product.price}</div>
            <div className="text-sm text-gray-600">Images: {product.images?.length || 0}</div>
            <a 
              href={`/products/${product.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View Product Page
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugProducts;
