import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackEvent } from '@/hooks/useAnalytics';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  brand?: string;
  quantity: number;
  inStock?: boolean;
  maxQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart_items');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const newQuantity = existingItem.quantity + 1;
        const maxQuantity = existingItem.maxQuantity || 10; // Default max quantity
        
        if (newQuantity <= maxQuantity) {
          const updatedItems = prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
          
          // Track add to cart event
          trackEvent('add_to_cart', {
            productId: product.id,
            metadata: {
              quantity: newQuantity,
              price: product.price,
              cartValue: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            },
          });
          
          return updatedItems;
        } else {
          // If max quantity reached, don't add more
          return prevItems;
        }
      } else {
        // Add new item to cart
        const updatedItems = [...prevItems, { ...product, quantity: 1 }];
        
        // Track add to cart event
        trackEvent('add_to_cart', {
          productId: product.id,
          metadata: {
            quantity: 1,
            price: product.price,
            cartValue: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          },
        });
        
        return updatedItems;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 10) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const getCartItem = (productId: string) => {
    return items.find(item => item.id === productId);
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

  const getCartItem = (productId: string) => {
    return items.find(item => item.id === productId);
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
