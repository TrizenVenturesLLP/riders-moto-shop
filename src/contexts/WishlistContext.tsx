import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackEvent } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/config/api';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  brand?: string;
  slug?: string;
  inStock?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  totalItems: number;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getWishlistItem: (productId: string) => WishlistItem | undefined;
  isLoading: boolean;
  syncGuestWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Sync guest wishlist to backend when user logs in
  const syncGuestWishlist = async () => {
    if (!isAuthenticated || !user) return;

    const guestWishlist = localStorage.getItem('wishlist_items');
    if (!guestWishlist) return;

    try {
      const parsedItems = JSON.parse(guestWishlist);
      if (parsedItems.length === 0) {
        localStorage.removeItem('wishlist_items');
        return;
      }

      setIsLoading(true);
      
      // Add each guest wishlist item to backend
      for (const item of parsedItems) {
        try {
          await fetch(`${API_BASE_URL}/customer/wishlist/${item.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
        } catch (error) {
          console.error(`Error syncing wishlist item ${item.id}:`, error);
        }
      }

      // Reload wishlist from API
      const response = await fetch(`${API_BASE_URL}/customer/wishlist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.items) {
          setItems(result.data.items);
          // Clear guest wishlist after sync
          localStorage.removeItem('wishlist_items');
        }
      }
    } catch (error) {
      console.error('Error syncing guest wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load wishlist from localStorage (for guest users) or API (for logged-in users)
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && user) {
        // Check if there's a guest wishlist to sync
        const guestWishlist = localStorage.getItem('wishlist_items');
        if (guestWishlist) {
          // Sync guest wishlist first
          await syncGuestWishlist();
        } else {
          // Load from API for logged-in users
          try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/customer/wishlist`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data?.items) {
                setItems(result.data.items);
              }
            }
          } catch (error) {
            console.error('Error loading wishlist from API:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        // Load from localStorage for guest users
        const savedWishlist = localStorage.getItem('wishlist_items');
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            setItems(parsedWishlist);
          } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
            localStorage.removeItem('wishlist_items');
          }
        }
      }
    };

    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Save guest wishlist to localStorage whenever items change (only for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist_items', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToWishlist = async (product: WishlistItem) => {
    // Check if already in wishlist
    if (items.some(item => item.id === product.id)) {
      return;
    }

    const newItems = [...items, product];
    setItems(newItems);

    // Track analytics event
    const userBikeBrand = user?.bikeBrand || null;
    const userBikeModel = user?.bikeModel || null;
    const userBikeModelSlug = userBikeModel 
      ? userBikeModel.toLowerCase().replace(/\s+/g, '-')
      : null;

    trackEvent('wishlist_add', {
      productId: product.id,
      bikeModelSlug: userBikeModelSlug || undefined,
      metadata: {
        price: product.price,
        userBikeBrand,
        userBikeModel,
      },
    });

    // If logged in, sync to backend
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/customer/wishlist/${product.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error adding to wishlist API:', error);
        // Revert on error
        setItems(items);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const itemToRemove = items.find(item => item.id === productId);
    if (!itemToRemove) return;

    const newItems = items.filter(item => item.id !== productId);
    setItems(newItems);

    // Track analytics event
    trackEvent('wishlist_remove', {
      productId: productId,
      metadata: {
        price: itemToRemove.price,
      },
    });

    // If logged in, sync to backend
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/customer/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error removing from wishlist API:', error);
        // Revert on error
        setItems(items);
      }
    }
  };

  const clearWishlist = async () => {
    setItems([]);

    // If logged in, clear backend wishlist
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE_URL}/customer/wishlist`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error clearing wishlist API:', error);
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const getWishlistItem = (productId: string) => {
    return items.find(item => item.id === productId);
  };

  const value: WishlistContextType = {
    items,
    totalItems: items.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItem,
    isLoading,
    syncGuestWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

