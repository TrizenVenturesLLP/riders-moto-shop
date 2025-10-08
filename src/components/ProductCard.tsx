import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const allImages = product.images || [];
  const primaryImage = allImages.find(img => img.isPrimary) || allImages[0];
  const hasMultipleImages = allImages.length > 1;
  
  const hasDiscount = parseFloat(product.comparePrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
    : 0;

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

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-red-500/30 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={getImageUrl(getCurrentImage()?.url)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          onLoad={() => {
            console.log('✅ Image loaded successfully:', getImageUrl(getCurrentImage()?.url));
          }}
          onError={(e) => {
            console.error('❌ Image failed to load:', getImageUrl(getCurrentImage()?.url));
            // Set fallback image
            e.currentTarget.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop';
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
            -{discountPercentage}%
          </span>
        )}

        {/* Stock Badge */}
        {product.stockQuantity <= product.lowStockThreshold && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
            Low Stock
          </span>
        )}

        {/* Image Indicators (dots) - only show if multiple images */}
        {hasMultipleImages && allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions - HT Exhaust Style */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => e.preventDefault()}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Info - HT Exhaust Style */}
      <div className="p-4">
        {/* Category/Brand */}
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          {product.brand?.name || 'HITECH'}
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
          {product.name}
        </h3>
        
        {/* Model/Compatibility */}
        <div className="text-xs text-gray-600 mb-3">
          {product.sku}
        </div>

        {/* Price - HT Exhaust Style */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">₹{product.comparePrice}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs mb-3">
          {product.stockQuantity > 0 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button - HT Exhaust Style */}
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors" 
          size="sm" 
          disabled={product.stockQuantity === 0}
          onClick={(e) => e.preventDefault()}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
