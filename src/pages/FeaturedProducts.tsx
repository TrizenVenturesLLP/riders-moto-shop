import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { scrollToTop } from '@/hooks/useScrollToTop';

const FeaturedProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const { data, isLoading, error } = useProducts({
    featured: true, // Only fetch featured products
    page,
    limit,
    sort: 'createdAt',
    order: 'DESC',
  });

  const products = (data as any)?.data?.products || [];
  const pagination = (data as any)?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params, { replace: true });
    scrollToTop();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load products</h2>
          <p className="text-sm text-muted-foreground mb-4">Please try again later.</p>
          <Link to="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            Featured <span className="text-primary">Products</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Discover our handpicked selection of premium motorcycle accessories and parts.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-foreground mb-2">No featured products found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Check back later for featured products.
            </p>
            <Link to="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-none"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="rounded-none"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * limit + 1, pagination.totalItems)}-
                {Math.min(page * limit, pagination.totalItems)} of {pagination.totalItems} featured products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;

