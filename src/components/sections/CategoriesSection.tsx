import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import categoryBrakes from '@/assets/category-brakes.jpg';
import categoryTires from '@/assets/category-tires.jpg';
import categoryEngine from '@/assets/category-engine.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

const categories = [
  {
    id: 1,
    name: 'Brakes',
    description: 'High-performance brake systems',
    image: categoryBrakes,
    count: '500+ products'
  },
  {
    id: 2,
    name: 'Tires',
    description: 'Premium motorcycle tires',
    image: categoryTires,
    count: '300+ products'
  },
  {
    id: 3,
    name: 'Engine Parts',
    description: 'Performance engine components',
    image: categoryEngine,
    count: '800+ products'
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Gear, tools & essentials',
    image: categoryAccessories,
    count: '600+ products'
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find exactly what you need to upgrade your ride. From performance parts to essential accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-200 text-sm mb-2">{category.description}</p>
                <p className="text-primary text-sm font-medium mb-4">{category.count}</p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white text-white hover:bg-white hover:text-black group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;