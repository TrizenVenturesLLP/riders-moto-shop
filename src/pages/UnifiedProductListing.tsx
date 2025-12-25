import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { useProducts, ProductsResponse } from '@/hooks/useProducts';
import { mockProducts } from '@/mock/products';
import { trackEvent } from '@/hooks/useAnalytics';
import {
  Grid3X3,
  List,
  Search,
  Loader2,
  Home,
  X
} from 'lucide-react';

const formatTitle = (slug?: string) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Known accessory productTypes (these are actual productTypes, not categories)
const ACCESSORY_PRODUCT_TYPES = [
  // Keep this list for actual productTypes if needed in future
  // For now, most accessories are categories, not productTypes
];

const UnifiedProductListing = () => {
  const location = useLocation();
  const params = useParams<{ model?: string; category?: string; slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine page context
  const isBikePage = location.pathname.includes('/bikes/');
  const isAccessoryPage = location.pathname.includes('/accessories/');

  // Extract identifiers
  const model = params.model;
  const identifier = params.category || params.slug;

  // Determine if identifier is a productType or category
  // In our database: crash-guard, foot-rest, etc. are CATEGORIES, not productTypes
  // productType field is currently unused/null in the database
  const isProductType = identifier && ACCESSORY_PRODUCT_TYPES.includes(identifier);
  const category = !isProductType ? identifier : undefined; // Default to category
  const productType = isProductType ? identifier : undefined;

  // State for filters and view - persist viewMode in URL
  const initialViewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });

  // Refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const viewModeUpdateRef = useRef(false);

  // Update viewMode in URL when it changes
  useEffect(() => {
    if (!viewModeUpdateRef.current) {
      viewModeUpdateRef.current = true;
      return;
    }

    const params = new URLSearchParams(searchParams);
    if (viewMode === 'grid') {
      params.delete('view');
    } else {
      params.set('view', viewMode);
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Debounce search query
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      setSearchParams(params, { replace: true });
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, searchParams, setSearchParams]);

  // Map sort options to backend field names
  const getSortField = (sortBy: string): string => {
    switch (sortBy) {
      case 'featured':
      case 'best-selling':
        return 'createdAt';
      case 'price-low':
      case 'price-high':
        return 'price';
      case 'name-asc':
      case 'name-desc':
        return 'name';
      case 'newest':
        return 'createdAt';
      default:
        return sortBy;
    }
  };

  const getSortOrder = (sortBy: string): 'ASC' | 'DESC' => {
    switch (sortBy) {
      case 'price-low':
      case 'name-asc':
        return 'ASC';
      case 'price-high':
      case 'name-desc':
      case 'featured':
      case 'best-selling':
      case 'newest':
      default:
        return 'DESC';
    }
  };

  // Build filter parameters
  const filterParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    sort: getSortField(sortBy),
    order: getSortOrder(sortBy),
    brand: searchParams.get('brand') || undefined,
    // Send model slug as-is (with hyphens) - backend will handle matching both slug and name formats
    model: model || undefined,
    category: category ? category.replace(/-/g, ' ') : undefined,
    productType: productType || undefined, // Send as-is without converting hyphens
    minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    search: debouncedSearchQuery || undefined
  };

  // Debug logging
  console.log('🔍 Unified Listing Context:', { isBikePage, isAccessoryPage, model, category, productType });
  console.log('🔍 Filter Params:', filterParams);

  const { data, isLoading, error } = useProducts(filterParams);

  const products = (data as ProductsResponse)?.data?.products || [];
  const pagination = (data as ProductsResponse)?.data?.pagination;

  // Track bike page view
  useEffect(() => {
    if (isBikePage && model && !isLoading) {
      trackEvent('bike_page_view', {
        bikeModelSlug: model,
        metadata: {
          pageUrl: window.location.href,
          productCount: products.length,
          category: category || null,
          productType: productType || null,
        },
      });
    }
  }, [isBikePage, model, isLoading, products.length, category, productType]);

  // Extract available options for filters (only for bike pages)
  // These depend on the products array, so they must be defined after products
  const availableBrands = useMemo(() => {
    if (!isBikePage || !model) return [];

    // First try to get brands from actual API products
    const apiBrands = products
      .filter(p => p.brand)
      .map(p => ({ 
        name: typeof p.brand === 'string' ? p.brand : p.brand.name, 
        slug: typeof p.brand === 'string' ? p.brand.toLowerCase().replace(/\s+/g, '-') : p.brand.slug || p.brand.name?.toLowerCase().replace(/\s+/g, '-') || ''
      }))
      .filter(b => b.name && b.slug);

    // Fallback to mock products if API products are empty
    const mockBrands = mockProducts
      .filter(p => p.compatibleModels?.includes(model))
      .filter(p => p.brand)
      .map(p => ({ name: p.brand!.name, slug: p.brand!.slug }));

    // Combine both sources
    const allBrands = [...apiBrands, ...mockBrands];

    const uniqueBrands = Array.from(
      new Map(allBrands.map(b => [b.slug, b])).values()
    );

    return uniqueBrands.sort((a, b) => a.name.localeCompare(b.name));
  }, [model, isBikePage, products]);

  const availableCategories = useMemo(() => {
    if (!isBikePage || !model) return [];

    // First try to get categories from actual API products
    const apiCategories = products
      .filter(p => p.category)
      .map(p => ({ 
        name: typeof p.category === 'string' ? p.category : p.category.name, 
        slug: typeof p.category === 'string' ? p.category.toLowerCase().replace(/\s+/g, '-') : p.category.slug || p.category.name?.toLowerCase().replace(/\s+/g, '-') || ''
      }))
      .filter(c => c.name && c.slug);

    // Fallback to mock products if API products are empty
    const mockCategories = mockProducts
      .filter(p => p.compatibleModels?.includes(model))
      .map(p => ({ name: p.category.name, slug: p.category.slug }));

    // Combine both sources
    const allCategories = [...apiCategories, ...mockCategories];

    const uniqueCategories = Array.from(
      new Map(allCategories.map(c => [c.slug, c])).values()
    );

    return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [model, isBikePage, products]);

  const availableProductTypes = useMemo(() => {
    if (!isBikePage || !model) return [];

    // First try to get product types from actual API products
    const apiProductTypes = products
      .filter(p => p.productType)
      .map(p => {
        const pt = p.productType;
        return {
          name: typeof pt === 'string' ? pt : pt.name || '',
          slug: typeof pt === 'string' ? pt.toLowerCase().replace(/\s+/g, '-') : pt.slug || pt.name?.toLowerCase().replace(/\s+/g, '-') || ''
        };
      })
      .filter(pt => pt.name && pt.slug);

    // Fallback to mock products if API products are empty
    const mockProductTypes = mockProducts
      .filter(p => p.compatibleModels?.includes(model))
      .filter(p => p.productType)
      .map(p => ({ name: p.productType!.name, slug: p.productType!.slug }));

    // Combine both sources
    const allProductTypes = [...apiProductTypes, ...mockProductTypes];

    const uniqueProductTypes = Array.from(
      new Map(allProductTypes.map(pt => [pt.slug, pt])).values()
    );

    return uniqueProductTypes.sort((a, b) => a.name.localeCompare(b.name));
  }, [model, isBikePage, products]);

  // Handle filter changes
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('featured');
    setPriceRange({ min: '', max: '' });

    const params = new URLSearchParams();
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      category ||
      productType ||
      searchParams.get('brand') ||
      searchParams.get('minPrice') ||
      searchParams.get('maxPrice') ||
      searchParams.get('inStock') ||
      (sortBy && sortBy !== 'featured') ||
      searchQuery
    );
  }, [category, productType, searchParams, sortBy, searchQuery]);

  // Generate page title
  const getPageTitle = () => {
    if (model) {
      return formatTitle(model);
    } else if (productType) {
      return formatTitle(productType);
    } else if (category) {
      return formatTitle(category);
    }
    return 'Products';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">Error Loading Products</h1>
          <p className="text-muted-foreground mb-6">Failed to load products.</p>
          <Button onClick={() => window.location.href = '/'}>
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">

        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap space-x-2 text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          {isBikePage ? (
            <>
              <a href="/shop-by-bike" className="hover:text-primary transition-colors">Shop by Bike</a>
              <span>/</span>
              <span className="text-foreground font-medium">{formatTitle(model)}</span>
            </>
          ) : (
            <>
              <a href="/#shop-accessories" className="hover:text-primary transition-colors">Shop by Accessories</a>
              <span>/</span>
              <span className="text-foreground font-medium">{getPageTitle()}</span>
            </>
          )}
        </nav>

        {/* Header with Title and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{getPageTitle()}</h1>
            {products.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {pagination?.totalItems || products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-9 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-9 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-border bg-background"
            />
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            updateURL({ sort_by: value });
          }}>
            <SelectTrigger className="w-full sm:w-[200px] border-2 border-border bg-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters Section - Always Visible */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Brand Filter - Only for Bike Pages */}
              {isBikePage && availableBrands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                  <Select
                    value={searchParams.get('brand') || 'all-brands'}
                    onValueChange={(value) => updateURL({ brand: value === 'all-brands' ? '' : value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-brands">All Brands</SelectItem>
                      {availableBrands.map((brand) => (
                        <SelectItem key={brand.slug} value={brand.slug}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Category Filter - Only for Bike Pages */}
              {isBikePage && availableCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <Select
                    value={category || 'all-categories'}
                    onValueChange={(value) => {
                      const newUrl = value === 'all-categories' ? '' : `?category=${value}`;
                      window.location.href = `/collections/bikes/${model}${newUrl}`;
                    }}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Products Filter - For Bike Pages (shows all compatible products) */}
              {isBikePage && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Products</label>
                  <Select
                    value={productType || 'all-products'}
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === 'all-products') {
                        params.delete('productType');
                      } else {
                        params.set('productType', value);
                      }
                      setSearchParams(params, { replace: true });
                    }}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-products">All Products</SelectItem>
                      {availableProductTypes.map((pt) => (
                        <SelectItem key={pt.slug} value={pt.slug}>
                          {pt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min ₹"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    onBlur={() => updateURL({ minPrice: priceRange.min })}
                    className="bg-background border-border"
                  />
                  <Input
                    type="number"
                    placeholder="Max ₹"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    onBlur={() => updateURL({ maxPrice: priceRange.max })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Availability</label>
                <Select
                  value={searchParams.get('inStock') || 'all'}
                  onValueChange={(value) => updateURL({ inStock: value === 'in-stock' ? 'true' : '' })}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="in-stock">In Stock Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-primary hover:text-primary/80"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your filters or search terms.
            </p>
            {hasActiveFilters && (
              <Button onClick={clearAllFilters} variant="outline">
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
              : 'flex flex-col gap-4'
          }>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => updateURL({ page: String(pagination.currentPage - 1) })}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => updateURL({ page: String(pagination.currentPage + 1) })}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UnifiedProductListing;

