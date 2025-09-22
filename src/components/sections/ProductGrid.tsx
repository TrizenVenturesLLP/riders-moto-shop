import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Eye } from 'lucide-react';

// Mock product data - in real app this would come from API/database
const products = [
  {
    id: 1,
    name: 'Performance Brake Disc Set',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 124,
    image: '/placeholder.svg',
    category: 'Brakes',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Sport Motorcycle Tire',
    price: 189.99,
    rating: 4.7,
    reviews: 89,
    image: '/placeholder.svg',
    category: 'Tires',
    badge: 'New'
  },
  {
    id: 3,
    name: 'High-Flow Air Filter',
    price: 79.99,
    rating: 4.9,
    reviews: 156,
    image: '/placeholder.svg',
    category: 'Engine Parts',
    badge: 'Top Rated'
  },
  {
    id: 4,
    name: 'LED Headlight Assembly',
    price: 249.99,
    rating: 4.6,
    reviews: 78,
    image: '/placeholder.svg',
    category: 'Accessories'
  },
  {
    id: 5,
    name: 'Racing Exhaust System',
    price: 499.99,
    originalPrice: 599.99,
    rating: 4.9,
    reviews: 203,
    image: '/placeholder.svg',
    category: 'Engine Parts',
    badge: 'Sale'
  },
  {
    id: 6,
    name: 'Carbon Fiber Mirrors',
    price: 129.99,
    rating: 4.5,
    reviews: 67,
    image: '/placeholder.svg',
    category: 'Accessories'
  }
];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="text-muted-foreground">Hand-picked premium parts for your ride</p>
          </div>
          <Button variant="outline">View All Products</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              {/* Product Image */}
              <div className="relative aspect-square bg-surface overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                    product.badge === 'Sale' ? 'bg-primary text-primary-foreground' :
                    product.badge === 'New' ? 'bg-accent text-accent-foreground' :
                    'bg-surface text-surface-foreground'
                  }`}>
                    {product.badge}
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-primary fill-current' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;