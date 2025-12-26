import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ChevronDown } from 'lucide-react';
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
  const isApparelsPage = location.pathname.includes('/apparels');

  // Extract identifiers
  const model = params.model;
  const identifier = params.category || params.slug;
  
  // Get categories from query params (supporting multiple selections)
  const categoriesFromQuery = searchParams.get('category')?.split(',').filter(Boolean) || [];
  // For apparels page, always set category to "apparels" if not explicitly set
  const categoryFromRoute = identifier && !ACCESSORY_PRODUCT_TYPES.includes(identifier) ? [identifier] : [];
  // If on apparels page and no category in query, set to "apparels"
  const selectedCategories = categoriesFromQuery.length > 0 
    ? categoriesFromQuery 
    : (isApparelsPage && identifier === 'apparels' ? ['apparels'] : categoryFromRoute);
  
  // Determine if identifier is a productType or category
  // In our database: crash-guard, foot-rest, etc. are CATEGORIES, not productTypes
  // productType field is currently unused/null in the database
  const isProductType = identifier && ACCESSORY_PRODUCT_TYPES.includes(identifier);
  const productTypeFromRoute = isProductType ? identifier : undefined;
  
  // Get product types from query params (supporting multiple selections)
  const productTypesFromQuery = searchParams.get('productType')?.split(',').filter(Boolean) || [];
  const selectedProductTypes = productTypesFromQuery.length > 0 ? productTypesFromQuery : (productTypeFromRoute ? [productTypeFromRoute] : []);
  
  // Get sub product types from query params (for apparels)
  const subProductTypesFromQuery = searchParams.get('subProductType')?.split(',').filter(Boolean) || [];
  const selectedSubProductTypes = subProductTypesFromQuery;

  // State for filters and view - persist viewMode in URL
  const initialViewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState({
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

  // Debounce price range
  useEffect(() => {
    const priceTimer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
      // Update URL with debounced values
      const params = new URLSearchParams(searchParams);
      if (priceRange.min) {
        params.set('minPrice', priceRange.min);
      } else {
        params.delete('minPrice');
      }
      if (priceRange.max) {
        params.set('maxPrice', priceRange.max);
      } else {
        params.delete('maxPrice');
      }
      params.delete('page'); // Reset to page 1 when price changes
      setSearchParams(params, { replace: true });
    }, 800); // 800ms debounce for price range

    return () => clearTimeout(priceTimer);
  }, [priceRange.min, priceRange.max, searchParams, setSearchParams]);

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
  // For multiple categories/productTypes, we'll send them as comma-separated or handle in backend
  // When sort_by=featured, also filter to show only featured products
  const isFeaturedSort = sortBy === 'featured';
  const filterParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    sort: getSortField(sortBy),
    order: getSortOrder(sortBy),
    brand: searchParams.get('brand') || undefined,
    // Send model slug as-is (with hyphens) - backend will handle matching both slug and name formats
    model: model || undefined,
    // Send all selected categories as comma-separated (backend supports multiple)
    category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    productType: selectedProductTypes.length > 0 ? selectedProductTypes.join(',') : undefined,
    minPrice: debouncedPriceRange.min ? parseFloat(debouncedPriceRange.min) : undefined,
    maxPrice: debouncedPriceRange.max ? parseFloat(debouncedPriceRange.max) : undefined,
    inStock: (() => {
      const stockParam = searchParams.get('inStock');
      if (stockParam === 'true') return true;
      if (stockParam === 'false') return false;
      return undefined;
    })(),
    // Filter by featured when sort_by=featured OR when featured=true is explicitly set
    featured: isFeaturedSort || searchParams.get('featured') === 'true' ? true : undefined,
    search: debouncedSearchQuery || undefined
  };

  // Debug logging
  console.log('🔍 Unified Listing Context:', { isBikePage, isAccessoryPage, model, selectedCategories, selectedProductTypes });
  console.log('🔍 Filter Params:', filterParams);

  // Fetch all products (without category/productType filter) to get all available categories/product types
  const allProductsParams = {
    ...filterParams,
    category: undefined, // Remove category filter to get all products
    productType: undefined, // Remove productType filter to get all products
    limit: 1000, // Get more products to have complete category/product type list
  };
  const { data: allProductsData } = useProducts(allProductsParams);
  const allProducts = (allProductsData as ProductsResponse)?.data?.products || [];

  const { data, isLoading, error } = useProducts(filterParams);

  let products = (data as ProductsResponse)?.data?.products || [];
  const pagination = (data as ProductsResponse)?.data?.pagination;

  // Filter by sub product type on frontend (if backend doesn't support it yet)
  if (isApparelsPage && selectedSubProductTypes.length > 0) {
    products = products.filter(p => {
      // @ts-ignore - attributes might not be in the type definition
      const subTypes = p.attributes?.subProductTypes || [];
      if (!Array.isArray(subTypes)) return false;
      return selectedSubProductTypes.some(selectedSpt => 
        subTypes.some((st: string) => st?.toLowerCase().replace(/\s+/g, '-') === selectedSpt)
      );
    });
  }

  // Track bike page view
  useEffect(() => {
    if (isBikePage && model && !isLoading) {
      trackEvent('bike_page_view', {
        bikeModelSlug: model,
        metadata: {
          pageUrl: window.location.href,
          productCount: products.length,
          category: selectedCategories.join(',') || null,
          productType: selectedProductTypes.join(',') || null,
        },
      });
    }
  }, [isBikePage, model, isLoading, products.length, selectedCategories, selectedProductTypes]);

  // Extract available options for filters
  // These depend on the products array, so they must be defined after products
  const availableBrands = useMemo(() => {
    // For bike pages, filter by model compatibility
    if (isBikePage && model) {
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
    }

    // For accessory and apparels pages, show all brands from products
    if (isAccessoryPage || isApparelsPage) {
      const apiBrands = products
        .filter(p => p.brand)
        .map(p => ({ 
          name: typeof p.brand === 'string' ? p.brand : p.brand.name, 
          slug: typeof p.brand === 'string' ? p.brand.toLowerCase().replace(/\s+/g, '-') : p.brand.slug || p.brand.name?.toLowerCase().replace(/\s+/g, '-') || ''
        }))
        .filter(b => b.name && b.slug);

      const uniqueBrands = Array.from(
        new Map(apiBrands.map(b => [b.slug, b])).values()
      );

      return uniqueBrands.sort((a, b) => a.name.localeCompare(b.name));
    }

    return [];
  }, [model, isBikePage, isAccessoryPage, isApparelsPage, products]);

  const availableCategories = useMemo(() => {
    // For bike pages, filter by model compatibility
    if (isBikePage && model) {
      // Get categories from ALL products (not just filtered ones) to show all options
      const apiCategories = allProducts
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
    }

    // For apparels pages, only show "Apparels" category
    if (isApparelsPage) {
      return [{ name: 'Apparels', slug: 'apparels' }];
    }

    // For accessory pages, show all categories from products
    if (isAccessoryPage) {
      const apiCategories = allProducts
        .filter(p => p.category)
        .map(p => ({ 
          name: typeof p.category === 'string' ? p.category : p.category.name, 
          slug: typeof p.category === 'string' ? p.category.toLowerCase().replace(/\s+/g, '-') : p.category.slug || p.category.name?.toLowerCase().replace(/\s+/g, '-') || ''
        }))
        .filter(c => c.name && c.slug);

      const uniqueCategories = Array.from(
        new Map(apiCategories.map(c => [c.slug, c])).values()
      );

      return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
    }

    return [];
  }, [model, isBikePage, isAccessoryPage, isApparelsPage, allProducts]);

  // Get available sub product types for selected product type (for apparels)
  // Use the config file mapping for sub product types
  const availableSubProductTypes = useMemo(() => {
    if (!isApparelsPage || selectedProductTypes.length === 0) {
      return [];
    }

    // Import the sub product types config (we'll need to import it)
    // For now, get from products that match the selected product types
    const matchingProducts = allProducts.filter(p => {
      if (!p.productType) return false;
      const ptSlug = typeof p.productType === 'string' 
        ? p.productType.toLowerCase().replace(/\s+/g, '-')
        : p.productType?.toLowerCase().replace(/\s+/g, '-') || '';
      return selectedProductTypes.includes(ptSlug);
    });

    // Extract sub product types from attributes.subProductTypes
    const subProductTypesSet = new Set<string>();
    matchingProducts.forEach(p => {
      // @ts-ignore - attributes might not be in the type definition
      const subTypes = p.attributes?.subProductTypes;
      if (Array.isArray(subTypes)) {
        subTypes.forEach((st: string) => {
          if (st) {
            subProductTypesSet.add(st);
          }
        });
      }
    });

    // Convert to array and format
    return Array.from(subProductTypesSet)
      .map(st => ({
        name: formatTitle(st),
        slug: st.toLowerCase().replace(/\s+/g, '-')
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [isApparelsPage, selectedProductTypes, allProducts]);

  // Clear sub product types when product type changes (for apparels)
  useEffect(() => {
    if (isApparelsPage && selectedSubProductTypes.length > 0 && availableSubProductTypes.length > 0) {
      // Check if any selected sub product types are still valid for current product types
      const validSubTypes = availableSubProductTypes.map(spt => spt.slug);
      const invalidSubTypes = selectedSubProductTypes.filter(spt => !validSubTypes.includes(spt));
      
      if (invalidSubTypes.length > 0) {
        const params = new URLSearchParams(searchParams);
        const remainingSubTypes = selectedSubProductTypes.filter(spt => validSubTypes.includes(spt));
        if (remainingSubTypes.length === 0) {
          params.delete('subProductType');
        } else {
          params.set('subProductType', remainingSubTypes.join(','));
        }
        params.delete('page');
        setSearchParams(params, { replace: true });
      }
    } else if (isApparelsPage && selectedProductTypes.length === 0 && selectedSubProductTypes.length > 0) {
      // Clear sub product types if no product type is selected
      const params = new URLSearchParams(searchParams);
      params.delete('subProductType');
      params.delete('page');
      setSearchParams(params, { replace: true });
    }
  }, [selectedProductTypes, availableSubProductTypes, isApparelsPage, selectedSubProductTypes, searchParams, setSearchParams]);

  const availableProductTypes = useMemo(() => {
    // For bike pages, filter by model compatibility
    if (isBikePage && model) {
      // Get product types from ALL products (not just filtered ones) to show all options
      const apiProductTypes = allProducts
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
    }

    // For accessory pages, show all product types from products
    if (isAccessoryPage) {
      const apiProductTypes = allProducts
        .filter(p => p.productType)
        .map(p => {
          const pt = p.productType;
          return {
            name: typeof pt === 'string' ? pt : pt.name || '',
            slug: typeof pt === 'string' ? pt.toLowerCase().replace(/\s+/g, '-') : pt.slug || pt.name?.toLowerCase().replace(/\s+/g, '-') || ''
          };
        })
        .filter(pt => pt.name && pt.slug);

      const uniqueProductTypes = Array.from(
        new Map(apiProductTypes.map(pt => [pt.slug, pt])).values()
      );

      return uniqueProductTypes.sort((a, b) => a.name.localeCompare(b.name));
    }

    return [];
  }, [model, isBikePage, isAccessoryPage, allProducts]);

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
      selectedCategories.length > 0 ||
      selectedProductTypes.length > 0 ||
      searchParams.get('brand') ||
      debouncedPriceRange.min ||
      debouncedPriceRange.max ||
      searchParams.get('inStock') ||
      (sortBy && sortBy !== 'featured') ||
      searchQuery
    );
  }, [selectedCategories, selectedProductTypes, searchParams, sortBy, searchQuery]);

  // Generate page title
  const getPageTitle = () => {
    if (model) {
      return formatTitle(model);
    } else if (selectedProductTypes.length > 0) {
      return formatTitle(selectedProductTypes[0]);
    } else if (selectedCategories.length > 0) {
      return formatTitle(selectedCategories[0]);
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
          ) : isApparelsPage ? (
            <>
              <a href="/apparels" className="hover:text-primary transition-colors">Shop by Apparels</a>
              <span>/</span>
              <span className="text-foreground font-medium">{getPageTitle()}</span>
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
            // Remove featured filter if switching away from featured sort
            if (value !== 'featured') {
              const params = new URLSearchParams(searchParams);
              params.delete('featured');
              setSearchParams(params, { replace: true });
            }
          }}>
            <SelectTrigger className="w-full sm:w-[200px] border-2 border-border bg-background">
              <SelectValue placeholder={isApparelsPage ? "All Apparels" : "All Accessories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{isApparelsPage ? "All Apparels" : "All Accessories"}</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {/* Brand Filter - For both Bike and Accessory Pages */}
              {availableBrands.length > 0 && (
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

              {/* Category Filter - Hide on Apparels page (category is always "apparels") */}
              {availableCategories.length > 0 && !isApparelsPage && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-background border-border"
                      >
                        {selectedCategories.length === 0
                          ? 'All Categories'
                          : selectedCategories.length === 1
                          ? availableCategories.find(cat => cat.slug === selectedCategories[0])?.name || 'Selected'
                          : `${selectedCategories.length} selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete('category');
                              params.delete('page');
                              setSearchParams(params, { replace: true });
                            }}
                          >
                            <Checkbox
                              checked={selectedCategories.length === 0}
                              className="mr-2"
                            />
                            All Categories
                          </CommandItem>
                          {availableCategories.map((cat) => (
                            <CommandItem
                              key={cat.slug}
                              onSelect={() => {
                                const params = new URLSearchParams(searchParams);
                                const current = selectedCategories;
                                const newSelection = current.includes(cat.slug)
                                  ? current.filter(c => c !== cat.slug)
                                  : [...current, cat.slug];
                                
                                if (newSelection.length === 0) {
                                  params.delete('category');
                                } else {
                                  params.set('category', newSelection.join(','));
                                }
                                params.delete('page');
                                setSearchParams(params, { replace: true });
                              }}
                            >
                              <Checkbox
                                checked={selectedCategories.includes(cat.slug)}
                                className="mr-2"
                              />
                              {cat.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Product Type Filter - For both Bike and Accessory Pages - Multi-select */}
              {availableProductTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Type</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-background border-border"
                      >
                        {selectedProductTypes.length === 0
                          ? 'All Products'
                          : selectedProductTypes.length === 1
                          ? availableProductTypes.find(pt => pt.slug === selectedProductTypes[0])?.name || 'Selected'
                          : `${selectedProductTypes.length} selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search products..." />
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete('productType');
                              params.delete('page');
                              setSearchParams(params, { replace: true });
                            }}
                          >
                            <Checkbox
                              checked={selectedProductTypes.length === 0}
                              className="mr-2"
                            />
                            All Products
                          </CommandItem>
                          {availableProductTypes.map((pt) => (
                            <CommandItem
                              key={pt.slug}
                              onSelect={() => {
                                const params = new URLSearchParams(searchParams);
                                const current = selectedProductTypes;
                                const newSelection = current.includes(pt.slug)
                                  ? current.filter(p => p !== pt.slug)
                                  : [...current, pt.slug];
                                
                                if (newSelection.length === 0) {
                                  params.delete('productType');
                                } else {
                                  params.set('productType', newSelection.join(','));
                                }
                                params.delete('page');
                                setSearchParams(params, { replace: true });
                              }}
                            >
                              <Checkbox
                                checked={selectedProductTypes.includes(pt.slug)}
                                className="mr-2"
                              />
                              {pt.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Sub Product Type Filter - Only for Apparels when Product Type is selected */}
              {isApparelsPage && selectedProductTypes.length > 0 && availableSubProductTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Sub Product Type</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-background border-border"
                      >
                        {selectedSubProductTypes.length === 0
                          ? 'All Sub Types'
                          : selectedSubProductTypes.length === 1
                          ? availableSubProductTypes.find(spt => spt.slug === selectedSubProductTypes[0])?.name || 'Selected'
                          : `${selectedSubProductTypes.length} selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search sub product types..." />
                        <CommandEmpty>No sub product types found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete('subProductType');
                              params.delete('page');
                              setSearchParams(params, { replace: true });
                            }}
                          >
                            <Checkbox
                              checked={selectedSubProductTypes.length === 0}
                              className="mr-2"
                            />
                            All Sub Types
                          </CommandItem>
                          {availableSubProductTypes.map((spt) => (
                            <CommandItem
                              key={spt.slug}
                              onSelect={() => {
                                const params = new URLSearchParams(searchParams);
                                const current = selectedSubProductTypes;
                                const newSelection = current.includes(spt.slug)
                                  ? current.filter(s => s !== spt.slug)
                                  : [...current, spt.slug];
                                
                                if (newSelection.length === 0) {
                                  params.delete('subProductType');
                                } else {
                                  params.set('subProductType', newSelection.join(','));
                                }
                                params.delete('page');
                                setSearchParams(params, { replace: true });
                              }}
                            >
                              <Checkbox
                                checked={selectedSubProductTypes.includes(spt.slug)}
                                className="mr-2"
                              />
                              {spt.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedSubProductTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubProductTypes.map(slug => {
                        const spt = availableSubProductTypes.find(s => s.slug === slug);
                        return (
                          <Badge key={slug} variant="secondary" className="gap-1">
                            {spt?.name || slug}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1 hover:bg-transparent"
                              onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                const current = selectedSubProductTypes.filter(s => s !== slug);
                                if (current.length === 0) {
                                  params.delete('subProductType');
                                } else {
                                  params.set('subProductType', current.join(','));
                                }
                                params.delete('page');
                                setSearchParams(params, { replace: true });
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
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
                    className="bg-background border-border"
                  />
                  <Input
                    type="number"
                    placeholder="Max ₹"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Stock Status</label>
                <Select
                  value={searchParams.get('inStock') || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      updateURL({ inStock: '' });
                    } else if (value === 'in-stock') {
                      updateURL({ inStock: 'true' });
                    } else if (value === 'out-of-stock') {
                      updateURL({ inStock: 'false' });
                    } else {
                      updateURL({ inStock: '' });
                    }
                  }}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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

