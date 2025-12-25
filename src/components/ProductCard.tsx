import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Heart, Check, Loader2 } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cart functionality
  const { addToCart, isInCart, getCartItem } = useCart();
  
  const allImages = product.images || [];
  const primaryImage = allImages.find(img => img.isPrimary) || allImages[0];
  const hasMultipleImages = allImages.length > 1;
  
  const hasDiscount = parseFloat(product.comparePrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
    : 0;

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stockQuantity === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url,
        sku: product.sku,
        brand: product.brand?.name,
        inStock: product.stockQuantity > 0,
        maxQuantity: product.stockQuantity
      });
      
      toast.success("Added to Cart!", {
        description: `${product.name} added to your cart.`,
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

  // Check if product is in cart
  const cartItem = getCartItem(product.id);
  const isProductInCart = isInCart(product.id);

  // Auto-swipe effect for multiple images
  useEffect(() => {
    if (isHovered && hasMultipleImages && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % allImages.length
        );
      }, 2000); // Change image every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, hasMultipleImages, allImages.length]);

  // Reset to first image when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  // Get image URL with proper fallback handling
  const getImageUrl = (url: string | undefined) => {
    if (!url) return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop';
    
    console.log('Original image URL:', url);
    
    // Handle different MinIO URL patterns
    if (url.includes('srv-captain--rms-minio:9000')) {
      // Extract the file path from the MinIO URL
      const filePath = url.split('/riders-moto-media-prod/')[1];
      if (filePath) {
        const publicUrl = `${import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1'}/public/media/${filePath}`;
        console.log('Converted to public URL:', publicUrl);
        return publicUrl;
      }
    }
    
    // Handle rms-minio-api URLs (convert to public API URL)
    if (url.includes('rms-minio-api.llp.trizenventures.com')) {
      // Extract the file path from the MinIO URL
      const filePath = url.split('/riders-moto-media-prod/')[1];
      if (filePath) {
        const publicUrl = `${import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1'}/public/media/${filePath}`;
        console.log('Converted MinIO API URL to public URL:', publicUrl);
        return publicUrl;
      }
    }
    
    // If it's already a public API URL, return as is
    if (url.includes('/api/v1/public/media/')) {
      console.log('Using existing public API URL:', url);
      return url;
    }
    
    // If it's any other valid HTTP URL, return as is
    if (url.startsWith('http')) {
      console.log('Using existing HTTP URL:', url);
      return url;
    }
    
    // Return placeholder if no valid URL
    return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop';
  };

  // Get current image to display
  const getCurrentImage = () => {
    if (hasMultipleImages && allImages.length > 0) {
      return allImages[currentImageIndex];
    }
    return primaryImage;
  };


  // Extract title and subtitle from product name
  const getProductTitle = (name: string) => {
    // Try to extract main product type (e.g., "SADDLE STAY", "RADIATOR GUARD")
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      // Take first 2-3 words as title
      return parts.slice(0, Math.min(3, parts.length)).join(' ').toUpperCase();
    }
    return name.toUpperCase();
  };

  const getProductSubtitle = (name: string, category?: any) => {
    // Try to extract bike model (e.g., "NINJA 1000 SX")
    const bikeModels = ['NINJA', 'DUKE', 'HIMALAYAN', 'CLASSIC', 'METEOR', 'HUNTER', 'SCRAM', 'SUPER METEOR'];
    for (const model of bikeModels) {
      if (name.toUpperCase().includes(model)) {
        const modelIndex = name.toUpperCase().indexOf(model);
        const afterModel = name.substring(modelIndex).split(' ').slice(0, 3).join(' ');
        return afterModel.toUpperCase();
      }
    }
    // Fallback to category name or first part of name
    return category?.name?.toUpperCase() || name.split(' ').slice(0, 2).join(' ').toUpperCase();
  };

  const productTitle = getProductTitle(product.name);
  const productSubtitle = getProductSubtitle(product.name, product.category);

  // List view layout
  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-all duration-200"
        style={{ 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${product.id}`} className="block">
          <div className="flex flex-row gap-4">
            {/* Product Image Container - Smaller in list view */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-muted overflow-hidden rounded">
              <img
                src={getImageUrl(getCurrentImage()?.url)}
                alt={product.name}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', getImageUrl(getCurrentImage()?.url));
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', getImageUrl(getCurrentImage()?.url));
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop';
                }}
              />
            </div>

            {/* Product Information - Compact in list view */}
            <div className="bg-card p-3 flex-1 flex flex-col justify-between min-w-0">
              <div className="flex-1">
                {/* Title - Smaller in list view */}
                <h3 className="text-sm sm:text-base font-bold text-card-foreground mb-1 uppercase leading-tight line-clamp-1">
                  {productTitle}
                </h3>
                
                {/* Subtitle - Smaller */}
                <div className="text-xs text-primary font-medium mb-1 uppercase line-clamp-1">
                  {productSubtitle}
                </div>

                {/* Brand - Smaller */}
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                  {product.brand?.name || 'HITECH'}
                </div>
                
                {/* Full Product Name - Smaller, single line */}
                <div className="text-xs text-muted-foreground mb-2 line-clamp-1 leading-snug">
                  {product.name}
                </div>
              </div>

              {/* Price - Bottom aligned */}
              <div className="text-sm font-semibold text-card-foreground">
                RS. {parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div 
      className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-all duration-200"
      style={{ 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image Container - Smaller in grid view */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={getImageUrl(getCurrentImage()?.url)}
            alt={product.name}
            className="w-full h-full object-cover"
            onLoad={() => {
              console.log('✅ Image loaded successfully:', getImageUrl(getCurrentImage()?.url));
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', getImageUrl(getCurrentImage()?.url));
              e.currentTarget.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop';
            }}
          />

          {/* Image Indicators */}
          {hasMultipleImages && allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-background' 
                      : 'bg-background/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information - Compact in grid view */}
        <div className="bg-card p-3">
          {/* Title - Smaller */}
          <h3 className="text-sm sm:text-base font-bold text-card-foreground mb-1 uppercase leading-tight line-clamp-2">
            {productTitle}
          </h3>
          
          {/* Subtitle - Smaller */}
          <div className="text-xs text-primary font-medium mb-1 uppercase line-clamp-1">
            {productSubtitle}
        </div>

          {/* Brand - Smaller */}
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
            {product.brand?.name || 'HITECH'}
          </div>
          
          {/* Full Product Name - Smaller, single line */}
          <div className="text-xs text-muted-foreground mb-2 line-clamp-1 leading-snug">
            {product.name}
          </div>

          {/* Price */}
          <div className="text-sm font-semibold text-card-foreground">
            RS. {parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
