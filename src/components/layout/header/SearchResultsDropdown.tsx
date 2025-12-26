import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResultsDropdownProps {
  searchQuery: string;
  onProductClick?: () => void;
}

export const SearchResultsDropdown = ({ 
  searchQuery, 
  onProductClick 
}: SearchResultsDropdownProps) => {
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, error } = useProducts({
    search: debouncedSearchQuery,
    limit: 20, // Limit to 20 results for performance
  });

  const allProducts = data?.data?.products || [];
  
  // Client-side filtering as safety check - ensure products actually match the search query
  const products = React.useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 1) {
      return [];
    }
    
    const searchTerm = debouncedSearchQuery.toLowerCase().trim();
    
    return allProducts.filter((product: any) => {
      const productName = (product.name || '').toLowerCase();
      const brandName = (product.brand?.name || '').toLowerCase();
      const sku = (product.sku || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      
      // Strict matching: must contain the search term in name, brand, SKU, or description
      return productName.includes(searchTerm) ||
             brandName.includes(searchTerm) ||
             sku.includes(searchTerm) ||
             description.includes(searchTerm);
    });
  }, [allProducts, debouncedSearchQuery]);

  // Don't show dropdown if search query is too short
  if (!debouncedSearchQuery || debouncedSearchQuery.length < 1) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
        <span className="ml-2 text-sm text-gray-600">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Failed to load results
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">No results found.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="p-2">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug || product.id}`}
            onClick={onProductClick}
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                {product.brand && (
                  <p className="text-xs text-gray-500 uppercase mb-0.5">
                    {product.brand.name}
                  </p>
                )}
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                {product.price && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{typeof product.price === 'string' 
                      ? parseFloat(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })
                      : product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

