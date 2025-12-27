import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProductWithFallback } from '@/hooks/useProductWithFallback';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Plus,
  Minus,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  color?: string;
  colorCode?: string;
  images?: ProductImage[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  description?: string;
  shortDescription?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  images: ProductImage[];
  variants?: ProductVariant[];
  isActive: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const trackedProductIdRef = useRef<string | null>(null);

  // Fetch product data from API with fallback
  const { data: productData, isLoading, error, source } = useProductWithFallback(id || '');
  
  // Cart functionality
  const { addToCart, isInCart, getCartItem } = useCart();
  
  // Wishlist functionality
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Get user data for analytics
  const { user } = useAuth();

  // Reset tracking ref when product ID changes
  useEffect(() => {
    if (id && trackedProductIdRef.current !== id) {
      trackedProductIdRef.current = null;
    }
  }, [id]);

  // Track product view - only once per product load
  useEffect(() => {
    if (productData?.data?.product && !isLoading) {
      const product = productData.data.product;
      
      // Only track if we haven't tracked this product ID yet
      if (trackedProductIdRef.current === product.id) {
        return;
      }
      
      trackedProductIdRef.current = product.id;
      
      // Get user bike preferences
      const userBikeBrand = user?.bikeBrand || null;
      const userBikeModel = user?.bikeModel || null;
      
      // Check product compatibility with user's bike
      // compatibleModels is an array of bike model slugs
      const compatibleModels = (product as any).compatibleModels || [];
      const userBikeModelSlug = userBikeModel 
        ? userBikeModel.toLowerCase().replace(/\s+/g, '-')
        : null;
      const isCompatibleWithUserBike = userBikeModelSlug 
        ? compatibleModels.includes(userBikeModelSlug)
        : null;
      
      trackEvent('product_view', {
        productId: product.id,
        categoryId: product.category?.id,
        bikeModelSlug: userBikeModelSlug || undefined,
        metadata: {
          pageUrl: window.location.href,
          referrer: document.referrer || 'direct',
          source: source, // API or mock
          userBikeBrand,
          userBikeModel,
          isCompatibleWithUserBike,
          productCompatibleModels: compatibleModels,
        },
      });
    }
  }, [productData?.data?.product?.id, isLoading, source, user?.bikeBrand, user?.bikeModel]);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariantId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !productData?.data?.product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-2">The product you're looking for doesn't exist.</p>
          <p className="text-sm text-muted-foreground/70 mb-6">Product ID: {id}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const product = productData.data.product;
  
  // Debug info
  console.log('🎯 Product loaded from:', source);
  console.log('📦 Product data:', product);
  
  // Get available variants (if any)
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  
  // Get selected variant or use base product
  const selectedVariant = selectedVariantId 
    ? variants.find(v => v.id === selectedVariantId)
    : null;
  
  // Determine which images to show (variant-specific or product images)
  const displayImages = selectedVariant?.images && selectedVariant.images.length > 0
    ? selectedVariant.images
    : product.images;
  
  // Determine price and stock from variant or base product
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayComparePrice = selectedVariant?.comparePrice ?? product.comparePrice;
  const displayStock = selectedVariant?.stockQuantity ?? product.stockQuantity;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    // If variants exist, require variant selection
    if (hasVariants && !selectedVariantId) {
      toast.error("Please select a color", {
        description: "Choose a color variant before adding to cart.",
      });
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const itemToAdd = {
        id: selectedVariant?.id || product.id,
        name: selectedVariant 
          ? `${product.name} - ${selectedVariant.color || selectedVariant.name}`
          : product.name,
        price: displayPrice,
        image: typeof displayImages?.[0] === 'string' ? displayImages[0] : displayImages?.[0]?.url,
        sku: selectedVariant?.sku || product.sku,
        brand: product.brand?.name,
        inStock: displayStock > 0,
        maxQuantity: displayStock,
        variantId: selectedVariantId || undefined,
      };
      
      // Add multiple items if quantity > 1
      for (let i = 0; i < quantity; i++) {
        addToCart(itemToAdd);
      }
      
      toast.success("Added to Cart!", {
        description: `${quantity} × ${itemToAdd.name} added to your cart.`,
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add item to cart", {
        description: "Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if product is in cart (check by variant if selected)
  const cartItem = getCartItem(selectedVariant?.id || product.id);
  const isProductInCart = isInCart(selectedVariant?.id || product.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            {product.brand && (
              <>
                <a 
                  href={`/collections/${product.brand.slug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {product.brand.name}
                </a>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              </>
            )}
            {product.category && (
              <>
                <a 
                  href={`/collections/${product.category.slug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </a>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              </>
            )}
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 md:pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Product Images */}
          <div className="space-y-3 w-full max-w-md mx-auto lg:mx-0 lg:ml-8 mt-4 lg:mt-6">
            {/* Main Image with Navigation */}
            <div className="relative aspect-[4/3] bg-card rounded-lg border border-border overflow-hidden group">
              {displayImages && displayImages.length > 0 ? (
                <>
                  <img
                    src={displayImages[selectedImage]?.url || displayImages[selectedImage]}
                    alt={displayImages[selectedImage]?.altText || product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  
                  {/* Navigation Arrows - Show when more than 1 image */}
                  {displayImages.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={() => setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {selectedImage + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-sm text-muted-foreground/40">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {displayImages && displayImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {displayImages.length} {displayImages.length === 1 ? 'Image' : 'Images'} Available
                </p>
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
                  {displayImages.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        selectedImage === index 
                          ? 'border-2 border-primary' 
                          : 'border-2 border-border hover:border-primary'
                      }`}
                      aria-label={`View image ${index + 1} of ${displayImages.length}`}
                    >
                      <img 
                        src={image.url || image} 
                        alt={image.altText || `${product.name} ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Product Title & SKU */}
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground mb-1.5">{product.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>


            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold text-primary">Rs. {displayPrice.toLocaleString()}</span>
              {displayComparePrice && displayComparePrice > displayPrice && (
                <span className="text-base sm:text-lg text-muted-foreground line-through">Rs. {displayComparePrice.toLocaleString()}</span>
              )}
              {displayComparePrice && displayComparePrice > displayPrice && (
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-foreground">Description</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-foreground">Key Features</h3>
              <ul className="space-y-1">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary mt-0.5 text-xs">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{tag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs sm:text-sm text-muted-foreground/70">No features listed</li>
                )}
              </ul>
            </div>

            {/* Color Variant Selection */}
            {hasVariants && (
              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-foreground">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        selectedVariantId === variant.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {variant.colorCode && (
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: variant.colorCode }}
                        />
                      )}
                      <span className="text-sm font-medium">{variant.color || variant.name}</span>
                      {variant.stockQuantity === 0 && (
                        <Badge variant="secondary" className="text-xs">Out of Stock</Badge>
                      )}
                    </button>
                  ))}
                </div>
                {!selectedVariantId && (
                  <p className="text-xs text-muted-foreground mt-2">Please select a color</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-foreground">Quantity</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-base font-medium w-8 text-center text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                  disabled={quantity >= displayStock}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || displayStock === 0 || (hasVariants && !selectedVariantId)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : isProductInCart ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    In Cart ({cartItem?.quantity || 0})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 py-2 text-sm rounded"
                  onClick={async () => {
                    if (!product) return;
                    const productIsInWishlist = isInWishlist(product.id);
                    if (productIsInWishlist) {
                      await removeFromWishlist(product.id);
                    } else {
                      await addToWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0]?.url || product.images?.[selectedImage]?.url,
                        sku: product.sku,
                        brand: product.brand?.name,
                        slug: product.slug,
                        inStock: product.stockQuantity > 0 && product.isActive,
                      });
                    }
                  }}
                >
                  <Heart className={`h-3.5 w-3.5 mr-2 ${isInWishlist(product?.id || '') ? 'text-red-600 fill-current' : ''}`} />
                  {isInWishlist(product?.id || '') ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
                <Button variant="outline" className="flex-1 py-2 text-sm rounded">
                  <Share2 className="h-3.5 w-3.5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-6 md:mt-8">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-base sm:text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-muted p-2 rounded border border-border">
                  <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">SKU</h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{product.sku}</p>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Brand</h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{product.brand?.name || 'N/A'}</p>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Category</h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{product.category?.name || 'N/A'}</p>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Weight</h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                </div>
                <div className="bg-muted p-2 rounded border border-border sm:col-span-2">
                  <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Dimensions</h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    {product.dimensions ? 
                      `${product.dimensions.length || 'N/A'} x ${product.dimensions.width || 'N/A'} x ${product.dimensions.height || 'N/A'} cm` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default ProductPage;
