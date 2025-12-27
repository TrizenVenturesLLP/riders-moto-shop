import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import { useProducts, ProductsResponse } from "@/hooks/useProducts";
import { mockProducts } from "@/mock/products";
import {
  Grid3X3,
  List,
  Filter,
  Search,
  Loader2,
  Home,
  X,
  ChevronDown
} from "lucide-react";

const formatTitle = (slug?: string) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const BikePage = () => {
  // Support both new URL structure (/collections/:model) and old structure (/bikes/:brand/:model)
  const params = useParams<{
    model?: string; // New structure: /collections/:model OR old: /bikes/:brand/:model
    brand?: string; // Old structure: /bikes/:brand/:model
    category?: string; // Old structure: /bikes/:brand/:model/:category
    productType?: string; // Old structure: /bikes/:brand/:model/:category/:productType
  }>();

  // Extract model - available in both structures
  const model = params.model;
  const brand = params.brand; // Only available in old structure

  // Extract category and productType from query params (new structure) or URL params (old structure)
  const [searchParams, setSearchParams] = useSearchParams();
  // Support multiple categories (comma-separated)
  const categoryParam = searchParams.get('category') || params.category || undefined;
  const categories = categoryParam 
    ? categoryParam.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  const productType = searchParams.get('productType') || params.productType || undefined;

  // State for filters and view - persist viewMode in URL
  const initialViewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get('search') || '');
  // Support both 'sort' and 'sort_by' query params
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  
  // Debounce search query
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const viewModeUpdateRef = useRef(false);
  
  // Update viewMode in URL when it changes (but not on initial load)
  useEffect(() => {
    if (!viewModeUpdateRef.current) {
      viewModeUpdateRef.current = true;
      return;
    }
    
    const params = new URLSearchParams(searchParams);
    if (viewMode === 'grid') {
      params.delete('view'); // Remove view param for default (grid)
    } else {
      params.set('view', viewMode);
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);
  
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      setSearchParams(params, { replace: true });
    }, 300); // 300ms debounce delay
    
    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, searchParams, setSearchParams]);

  // Extract unique categories from products for the selected bike model
  const availableCategories = useMemo(() => {
    const categories = mockProducts
      .filter(p => p.compatibleModels.includes(model || ''))
      .map(p => ({ name: p.category.name, slug: p.category.slug }));
    
    // Remove duplicates
    const uniqueCategories = Array.from(
      new Map(categories.map(c => [c.slug, c])).values()
    );
    
    return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [model]);

  // Extract unique product types for the selected categories
  const availableProductTypes = useMemo(() => {
    const productTypes = mockProducts
      .filter(p => 
        p.compatibleModels.includes(model || '') &&
        (categories.length === 0 || categories.includes(p.category.slug))
      )
      .filter(p => p.productType)  // Only products with productType
      .map(p => ({ name: p.productType!.name, slug: p.productType!.slug }));
    
    // Remove duplicates
    const uniqueProductTypes = Array.from(
      new Map(productTypes.map(pt => [pt.slug, pt])).values()
    );
    
    return uniqueProductTypes.sort((a, b) => a.name.localeCompare(b.name));
  }, [model, categories]);

  // Build filter parameters
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

  const filterParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    sort: getSortField(sortBy),
    order: getSortOrder(sortBy),
    brand: searchParams.get('brand') || brand || undefined,  // From query params (new) or URL params (old)
    model: model,  // Required - bike model slug
    category: categories.length > 0 ? categories.join(',') : undefined,  // Multiple categories (comma-separated)
    productType: productType,  // From query params (new) or URL params (old)
    minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    search: debouncedSearchQuery || undefined  // Use debounced search query
  };

  // Debug logging
  console.log('🔍 BikePage Filter Params:', filterParams);
  console.log('🔍 URL Search Params:', Object.fromEntries(searchParams.entries()));
  console.log('🔍 Sort By:', sortBy);

  const { data, isLoading, error } = useProducts(filterParams);

  const products = (data as ProductsResponse)?.data?.products || [];
  const pagination = (data as ProductsResponse)?.data?.pagination;

  // Handle filter changes by updating URL
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

  // Extract unique brands from products for the selected bike model
  // Use mock data only to avoid infinite loops with API products
  const availableBrands = useMemo(() => {
    // Use mock data to extract brands - this avoids dependency on products array
    const brands = mockProducts
      .filter(p => p.compatibleModels.includes(model || ''))
      .filter(p => p.brand) // Only products with brand
      .map(p => ({ name: p.brand!.name, slug: p.brand!.slug }));
    
    // Remove duplicates
    const uniqueBrands = Array.from(
      new Map(brands.map(b => [b.slug, b])).values()
    );
    
    return uniqueBrands.sort((a, b) => a.name.localeCompare(b.name));
  }, [model]);

  // Clear all filters
  const clearAllFilters = () => {
    // Reset all state
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('featured');
    setPriceRange({ min: '', max: '' });
    
    // Clear all URL parameters except page (keep page=1)
    const params = new URLSearchParams();
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  // Handle category selection (multi-select)
  const handleCategoryToggle = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    const currentCategories = categories;
    
    if (currentCategories.includes(categorySlug)) {
      // Remove category
      const newCategories = currentCategories.filter(c => c !== categorySlug);
      if (newCategories.length === 0) {
        params.delete('category');
        params.delete('productType'); // Clear productType when clearing all categories
      } else {
        params.set('category', newCategories.join(','));
      }
    } else {
      // Add category
      const newCategories = [...currentCategories, categorySlug];
      params.set('category', newCategories.join(','));
    }
    
    setSearchParams(params, { replace: true });
  };

  // Clear all categories
  const handleClearAllCategories = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('productType'); // Clear productType when clearing categories
    setSearchParams(params, { replace: true });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      categories.length > 0 ||
      productType ||
      searchParams.get('brand') ||
      searchParams.get('minPrice') ||
      searchParams.get('maxPrice') ||
      searchParams.get('inStock') ||
      (sortBy && sortBy !== 'featured') ||
      searchQuery
    );
  }, [categories, productType, searchParams, sortBy, searchQuery]);

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
          <p className="text-muted-foreground mb-6">Failed to load products for this bike.</p>
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
          <a href="/shop-by-bike" className="hover:text-primary transition-colors">Shop by Bike</a>
          <span>/</span>
          <span className="text-foreground font-medium">{formatTitle(model)}</span>
          {category && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">{formatTitle(category)}</span>
            </>
          )}
          {productType && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">{formatTitle(productType)}</span>
            </>
          )}
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {formatTitle(model)}
              {category && <span className="text-primary"> - {formatTitle(category)}</span>}
              {productType && <span className="text-primary"> - {formatTitle(productType)}</span>}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {products.length > 0 
                ? `Showing ${products.length} of ${pagination?.totalItems || 0} compatible products`
                : 'No compatible products found'
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
                className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 border-2"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              updateURL({ sort_by: value }); // Use sort_by to match reference sites
            }}>
              <SelectTrigger className="w-48 border-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters Section - Always Visible */}
        <Card className="mb-6">
          <CardContent className="p-6">
              {/* Filter Header with Active Count */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-foreground" />
                  <h3 className="text-base font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[
                        category && '1',
                        productType && '1',
                        searchParams.get('brand') && '1',
                        (searchParams.get('minPrice') || searchParams.get('maxPrice')) && '1',
                        searchParams.get('inStock') && '1',
                        (sortBy && sortBy !== 'featured') && '1',
                        searchQuery && '1'
                      ].filter(Boolean).length} active
                    </Badge>
                  )}
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                {/* Category Filter - Multi-select */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Category
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-background hover:bg-accent"
                      >
                        <span className="truncate">
                          {categories.length === 0
                            ? "All Categories"
                            : categories.length === 1
                            ? availableCategories.find(c => c.slug === categories[0])?.name || "Selected"
                            : `${categories.length} categories selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <div className="border-b border-border px-4 py-2.5 bg-muted/50 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">
                            Select Categories
                          </h3>
                          {categories.length > 0 && (
                            <button
                              onClick={handleClearAllCategories}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        {/* Search input for categories */}
                        <div className="relative mt-2">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search categories..."
                            className="pl-8 h-8 text-sm"
                            // TODO: Add search functionality if needed
                          />
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto p-2">
                        <div className="space-y-1">
                          {availableCategories.map((cat) => {
                            const isSelected = categories.includes(cat.slug);
                            return (
                              <div
                                key={cat.slug}
                                className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
                                onClick={() => handleCategoryToggle(cat.slug)}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleCategoryToggle(cat.slug)}
                                />
                                <label
                                  className="flex-1 text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {cat.name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                        {availableCategories.length === 0 && (
                          <div className="text-center py-8 text-sm text-muted-foreground">
                            No categories available
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* Show selected categories as badges */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {categories.map((catSlug) => {
                        const cat = availableCategories.find(c => c.slug === catSlug);
                        return cat ? (
                          <Badge
                            key={catSlug}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat.name}
                            <button
                              onClick={() => handleCategoryToggle(catSlug)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Brand
                  </label>
                  <Select 
                    value={searchParams.get('brand') || 'all'} 
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === 'all') {
                        params.delete('brand');
                      } else {
                        params.set('brand', value);
                      }
                      setSearchParams(params, { replace: true });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {availableBrands.length > 0 ? (
                        availableBrands.map(b => (
                          <SelectItem key={b.slug} value={b.slug}>
                            {b.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="all" disabled>No brands available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Type Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Product Type
                  </label>
                  <Select 
                    value={productType || 'all'} 
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === 'all') {
                        params.delete('productType');
                      } else {
                        params.set('productType', value);
                      }
                      setSearchParams(params, { replace: true });
                    }}
                    disabled={!category}
                  >
                    <SelectTrigger className="w-full" disabled={!category}>
                      <SelectValue placeholder={category ? "Select type" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Product Types</SelectItem>
                      {availableProductTypes.length > 0 ? (
                        availableProductTypes.map(pt => (
                          <SelectItem key={pt.slug} value={pt.slug}>
                            {pt.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="all" disabled>No types available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!category && (
                    <p className="text-xs text-muted-foreground/70 mt-1">Select a category first</p>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min ₹"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, min: e.target.value }));
                        updateURL({ minPrice: e.target.value });
                      }}
                      className="w-full"
                    />
                    <Input
                      placeholder="Max ₹"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, max: e.target.value }));
                        updateURL({ maxPrice: e.target.value });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="true">In Stock Only</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">No products found</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
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

export default BikePage;
