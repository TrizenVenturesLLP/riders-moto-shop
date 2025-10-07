import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

const APITest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Get products list (like homepage)
      console.log('🔍 Testing products list API...');
      const listResponse = await fetch(`${API_BASE_URL}/products`);
      console.log('📋 List API Status:', listResponse.status);
      
      if (listResponse.ok) {
        const listData = await listResponse.json();
        console.log('📋 List API Data:', listData);
        setProducts(listData.data?.products || []);
        
        // Test 2: Try to get first product individually
        if (listData.data?.products?.length > 0) {
          const firstProduct = listData.data.products[0];
          console.log('🔍 Testing single product API with ID:', firstProduct.id);
          console.log('🔍 Product isActive:', firstProduct.isActive);
          console.log('🔍 Product details:', {
            id: firstProduct.id,
            name: firstProduct.name,
            isActive: firstProduct.isActive,
            stockQuantity: firstProduct.stockQuantity
          });
          
          const singleResponse = await fetch(`${API_BASE_URL}/products/${firstProduct.id}`);
          console.log('📄 Single API Status:', singleResponse.status);
          
          if (singleResponse.ok) {
            const singleData = await singleResponse.json();
            console.log('📄 Single API Data:', singleData);
          } else {
            const errorText = await singleResponse.text();
            console.error('❌ Single API Error:', errorText);
            setError(`Single product API failed: ${singleResponse.status} - ${errorText}`);
          }
        }
      } else {
        const errorText = await listResponse.text();
        console.error('❌ List API Error:', errorText);
        setError(`List API failed: ${listResponse.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">API Test Results</h3>
      
      {loading && <div className="text-blue-600">Testing APIs...</div>}
      
      {error && (
        <div className="text-red-600 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {products.length > 0 && (
        <div>
          <div className="text-green-600 mb-2">
            ✅ Found {products.length} products
          </div>
          <div className="space-y-2">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="p-2 bg-white rounded border text-sm">
                <div><strong>Name:</strong> {product.name}</div>
                <div><strong>ID:</strong> {product.id}</div>
                <div><strong>SKU:</strong> {product.sku}</div>
                <div><strong>Images:</strong> {product.images?.length || 0}</div>
                <a 
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Test Product Page →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={testAPI}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Re-test APIs
      </button>
    </div>
  );
};

export default APITest;
