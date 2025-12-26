import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/hooks/useCart';
import { 
  Heart, 
  ArrowLeft, 
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const Wishlist = () => {
  const { items, totalItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      sku: item.sku,
      brand: item.brand,
      inStock: item.inStock,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    await removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
      toast.success('Wishlist cleared');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-3 text-muted-foreground hover:text-foreground text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            
            <h1 className="text-xl md:text-2xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-sm text-muted-foreground mt-1">Your wishlist is empty</p>
          </div>

          {/* Empty Wishlist */}
          <Card className="text-center py-8 md:py-12 border border-border shadow-sm">
            <CardContent>
              <Heart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-muted-foreground mb-4">Start adding products you love to your wishlist.</p>
              <Button onClick={() => navigate('/')} className="rounded-none">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">My Wishlist</h1>
              <p className="text-sm text-muted-foreground mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your wishlist</p>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearWishlist}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <Link to={`/products/${item.id}`}>
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {!item.inStock && (
                      <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-3 md:p-4 space-y-2">
                  <div>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {item.brand && (
                      <p className="text-xs text-muted-foreground mt-1">{item.brand}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

