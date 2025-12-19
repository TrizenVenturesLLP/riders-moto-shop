import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProductWithFallback } from '@/hooks/useProductWithFallback';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Plus,
  Minus,
  Loader2,
  Check
} from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
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
  const [selectedColor, setSelectedColor] = useState('black');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product data from API with fallback
  const { data: productData, isLoading, error, source } = useProductWithFallback(id || '');
  
  // Cart functionality
  const { addToCart, isInCart, getCartItem } = useCart();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !productData?.data?.product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-2">The product you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-6">Product ID: {id}</p>
          <div className="flex gap-4 justify-center">
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

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      // Add multiple items if quantity > 1
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url,
          sku: product.sku,
          brand: product.brand?.name,
          inStock: product.stockQuantity > 0,
          maxQuantity: product.stockQuantity
        });
      }
      
      toast({
        title: "Added to Cart!",
        description: `${quantity} × ${product.name} added to your cart.`,
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if product is in cart
  const cartItem = getCartItem(product.id);
  const isProductInCart = isInCart(product.id);

  const colors = ['black', 'red', 'white', 'blue'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex items-center space-x-1.5 text-xs text-gray-600">
            <a href="/" className="hover:text-red-600">Home</a>
            <ChevronRight className="h-3 w-3" />
            <a href="/collections/bmw" className="hover:text-red-600">BMW</a>
            <ChevronRight className="h-3 w-3" />
            <a href="/collections/bmw-g-310-r" className="hover:text-red-600">G 310 R</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-3 max-w-md mx-auto lg:mx-0 lg:ml-8">
            {/* Main Image */}
            <div className="aspect-[4/3] bg-white rounded-lg border overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.url || product.images[selectedImage]}
                  alt={product.images[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-sm text-gray-400">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.url || image} 
                      alt={image.altText || `${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Product Title & SKU */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1.5">{product.name}</h1>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            </div>


            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-red-600">Rs. {product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-gray-500 line-through">Rs. {product.comparePrice.toLocaleString()}</span>
              )}
              {product.comparePrice && product.comparePrice > product.price && (
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-semibold mb-1.5">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-base font-semibold mb-1.5">Key Features</h3>
              <ul className="space-y-1">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600 mt-0.5 text-xs">•</span>
                      <span className="text-sm text-gray-700">{tag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No features listed</li>
                )}
              </ul>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-base font-semibold mb-1.5">Color</h3>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 ${
                      selectedColor === color ? 'border-red-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-base font-semibold mb-1.5">Quantity</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-base font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stockQuantity === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex-1 py-2 text-sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-3.5 w-3.5 mr-2 ${isWishlisted ? 'text-red-600 fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
                <Button variant="outline" className="flex-1 py-2 text-sm">
                  <Share2 className="h-3.5 w-3.5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stockQuantity > 0 ? (
                <>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">In Stock ({product.stockQuantity} available)</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">SKU</h4>
                  <p className="text-sm font-medium text-gray-900">{product.sku}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Brand</h4>
                  <p className="text-sm font-medium text-gray-900">{product.brand?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Category</h4>
                  <p className="text-sm font-medium text-gray-900">{product.category?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Stock Quantity</h4>
                  <p className="text-sm font-medium text-gray-900">{product.stockQuantity}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Weight</h4>
                  <p className="text-sm font-medium text-gray-900">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Dimensions</h4>
                  <p className="text-sm font-medium text-gray-900">
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
