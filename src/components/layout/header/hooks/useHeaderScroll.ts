import { useState, useEffect, useRef } from 'react';

export const useHeaderScroll = () => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const handleScroll = () => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce scroll events to prevent rapid state changes
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;
        
        // Only show bottom bar when at absolute top (0px or very close to 0)
        setIsScrolledDown((prev) => {
          // Only show when at absolute top (within 5px)
          if (currentScrollY <= 5) {
            if (prev === false) return prev; // Already showing, no change needed
            lastScrollYRef.current = currentScrollY;
            return false;
          }
          
          // Any scroll down - hide immediately
          if (scrollDelta > 0) {
            if (prev === true) return prev; // Already hidden, no change needed
            lastScrollYRef.current = currentScrollY;
            return true;
          }
          
          // Scrolling up but not at top - keep hidden
          if (scrollDelta < 0 && currentScrollY > 5) {
            if (prev === true) return prev; // Already hidden, no change needed
            lastScrollYRef.current = currentScrollY;
            return true;
          }
          
          // No change needed
          return prev;
        });
        
        lastScrollYRef.current = currentScrollY;
      }, 50); // 50ms debounce to prevent rapid updates
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return { isScrolledDown };
};

