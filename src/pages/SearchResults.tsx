import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  
  // Enhanced search logic - try multiple search strategies
  const buildSearchParams = (searchQuery: string, searchCategory: string) => {
    const baseParams = {
      page: 1,
      limit: 100, // Show more results for search
      sort: 'createdAt',
      order: 'DESC' as 'ASC' | 'DESC',
      category: searchCategory === 'All' ? undefined : searchCategory.toLowerCase(),
      brand: undefined,
      model: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      featured: undefined
    };

    if (!searchQuery.trim()) {
      return baseParams;
    }

    // For multi-word searches, try different strategies
    const words = searchQuery.trim().split(/\s+/);
    
    if (words.length > 1) {
      // Try the full query first
      return {
        ...baseParams,
        search: searchQuery.trim()
      };
    } else {
      // Single word search
      return {
        ...baseParams,
        search: searchQuery.trim()
      };
    }
  };

  const filterParams = buildSearchParams(query, category);

  const { data, isLoading, error } = useFilteredProducts(filterParams);
  
  const products = data?.data?.products || [];
  const totalResults = data?.data?.pagination?.total || 0;

  // Debug logging
  console.log('🔍 Search Results Debug:', {
    query,
    category,
    filterParams,
    productsFound: products.length,
    totalResults,
    sampleProducts: products.slice(0, 3).map(p => ({ name: p.name, brand: p.brand?.name, category: p.category?.name }))
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading search results</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Search className="h-6 w-6 text-red-600" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            
            <div className="text-gray-600">
              {query ? (
                <>
                  <span>Searching for: </span>
                  <span className="font-semibold text-red-600">"{query}"</span>
                  {category !== 'All' && (
                    <>
                      <span> in </span>
                      <span className="font-semibold text-red-600">{category}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span>Showing all </span>
                  <span className="font-semibold text-red-600">{category.toLowerCase()}</span>
                </>
              )}
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {query ? 
                `No products match your search for "${query}"` :
                `No ${category.toLowerCase()} found`
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                Browse All Products
              </Button>
              {query && (
                <Button onClick={() => navigate('/search?category=' + encodeURIComponent(category))}>
                  Show All {category}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Load More Button (if needed) */}
            {totalResults > products.length && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
