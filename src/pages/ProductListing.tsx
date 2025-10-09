import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilteredProducts, ProductsResponse } from '@/hooks/useFilteredProducts';
import ProductCard from '@/components/ProductCard';
import {
  Grid3X3,
  List,
  Filter,
  SlidersHorizontal,
  Search,
  Loader2,
  ArrowLeft,
  Home
} from 'lucide-react';

// Note: Brand filtering is handled by the useFilteredProducts hook with fallback mechanism

const ProductListing = () => {
  const { brand, model, category } = useParams<{ brand?: string; model?: string; category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for filters and view
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });

  // Build filter parameters with proper formatting
  const filterParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    sort: sortBy === 'featured' ? 'createdAt' : sortBy,
    order: (sortBy === 'price-low' ? 'ASC' : 'DESC') as 'ASC' | 'DESC',
    category: category ? category.replace(/-/g, ' ') : undefined, // Convert kebab-case to space-separated
    brand: brand ? brand.replace(/-/g, ' ') : undefined, // Convert kebab-case to space-separated
    model: model ? model.replace(/-/g, ' ') : undefined, // Convert kebab-case to space-separated
    minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    search: searchQuery || undefined
  };

  // Debug logging
  console.log('🔗 Route params:', { brand, model, category });
  console.log('🔍 Filter params:', filterParams);

  // Fetch products
  const { data, isLoading, error } = useFilteredProducts(filterParams);

  const products = (data as ProductsResponse)?.data?.products || [];
  const pagination = (data as ProductsResponse)?.data?.pagination;

  // Handle filter changes by updating URL directly
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params, { replace: true });
  };

  // Generate page title
  const getPageTitle = () => {
    if (brand && model && category) {
      return `${brand.toUpperCase()} ${model.toUpperCase()} ${category.toUpperCase()}`;
    } else if (brand && category) {
      return `${brand.toUpperCase()} ${category.toUpperCase()}`;
    } else if (category) {
      return category.toUpperCase();
    }
    return 'Products';
  };

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const items = [
      { label: 'Home', href: '/' }
    ];
    
    if (brand) {
      items.push({ label: brand.toUpperCase(), href: `/bikes/${brand}` });
    }
    
    if (model) {
      items.push({ label: model.toUpperCase(), href: `/bikes/${brand}/${model}` });
    }
    
    if (category) {
      items.push({ label: category.toUpperCase(), href: '#' });
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button onClick={() => window.location.href = '/'}>
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          {getBreadcrumb().map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href === '#' ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-red-600">
                  {item.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getPageTitle()} ({pagination?.totalItems || 0})
            </h1>
            <p className="text-gray-600">
              {products.length > 0 
                ? `Showing ${products.length} of ${pagination?.totalItems || 0} products`
                : 'No products found'
              }
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateURL({ search: e.target.value });
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              updateURL({ sort: value });
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, min: e.target.value }));
                        updateURL({ minPrice: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, max: e.target.value }));
                        updateURL({ maxPrice: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <Select 
                    value={searchParams.get('inStock') || 'all'} 
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === 'all') {
                        params.delete('inStock');
                      } else {
                        params.set('inStock', value);
                      }
                      setSearchParams(params);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="true">In Stock Only</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <Select 
                    value={searchParams.get('featured') || 'all'} 
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === 'all') {
                        params.delete('featured');
                      } else {
                        params.set('featured', value);
                      }
                      setSearchParams(params);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="true">Featured Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              <Home className="h-4 w-4 mr-2" />
              Browse All Products
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', (pagination.currentPage - 1).toString());
                  setSearchParams(params);
                }}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={pagination.currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      setSearchParams(params);
                    }}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', (pagination.currentPage + 1).toString());
                  setSearchParams(params);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
