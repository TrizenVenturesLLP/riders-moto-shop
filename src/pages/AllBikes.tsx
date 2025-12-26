import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBikeModels } from '@/hooks/useBikeModels';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AllBikes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: bikeModels, isLoading, error } = useBikeModels({ isActive: true });

  // Get pagination params from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '10');

  // Calculate pagination
  const totalBikes = bikeModels.length;
  const totalPages = Math.ceil(totalBikes / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get paginated bikes
  const paginatedBikes = useMemo(() => {
    return bikeModels.slice(startIndex, endIndex);
  }, [bikeModels, startIndex, endIndex]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params, { replace: true });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    params.set('page', '1'); // Reset to page 1 when changing items per page
    setSearchParams(params, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading bikes...</p>
        </div>
      </div>
    );
  }

  if (error || bikeModels.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">No Bikes Found</h1>
          <p className="text-muted-foreground mb-6">Unable to load bike models. Please try again later.</p>
          <Link to="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Go to Homepage
            </button>
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
            All <span className="text-primary">Bikes</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Browse all available motorcycle models and find compatible accessories for your bike.
          </p>
        </div>

        {/* Items Per Page Selector */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalBikes)} of {totalBikes} bikes
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Show:</label>
            <Select
              value={String(itemsPerPage)}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-20 h-9 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid Layout - 4 columns (4 images per row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 max-w-7xl mx-auto">
          {paginatedBikes.map((bike) => (
            <Link
              key={bike.id}
              to={`/collections/bikes/${bike.slug}`}
              className="group cursor-pointer"
            >
              {/* Bike Image Container - Fixed aspect ratio for consistent sizing */}
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted/30 rounded-sm">
                {bike.image ? (
                  <img 
                    src={bike.image} 
                    alt={bike.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              {/* Bike Name - Below image */}
              <div className="text-center mt-1 sm:mt-1.5">
                <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                  {bike.name}
                </h3>
                {bike.brand && (
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">
                    {bike.brand.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllBikes;

