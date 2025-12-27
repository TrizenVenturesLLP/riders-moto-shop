import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface AllProductsDropdownProps {
  onProductClick?: () => void;
}

export const AllProductsDropdown = ({ onProductClick }: AllProductsDropdownProps) => {
  const { data, isLoading, error } = useProducts({});

  const products = data?.data?.products || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Failed to load products
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No products available
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
      <div className="p-2">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug || product.id}`}
            onClick={onProductClick}
            className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 transition-colors rounded"
          >
            <div className="flex items-center gap-3">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.name}</p>
                {product.price && (
                  <p className="text-xs text-muted-foreground mt-0.5">
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

