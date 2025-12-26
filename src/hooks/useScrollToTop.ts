import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseScrollToTopOptions {
  /**
   * Whether to use smooth scrolling. Default: true
   */
  smooth?: boolean;
  /**
   * Additional dependencies to trigger scroll to top
   * When any of these change, scroll to top will be triggered
   */
  dependencies?: React.DependencyList;
  /**
   * Offset from top in pixels. Default: 0
   */
  offset?: number;
  /**
   * Whether to scroll on initial mount. Default: true
   */
  scrollOnMount?: boolean;
}

/**
 * Hook to scroll to top of the page on route changes or when dependencies change
 * 
 * @example
 * // Basic usage - scrolls to top on every route change
 * useScrollToTop();
 * 
 * @example
 * // With custom options
 * useScrollToTop({ smooth: false, offset: 100 });
 * 
 * @example
 * // With additional dependencies
 * useScrollToTop({ dependencies: [searchParams] });
 */
export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const {
    smooth = true,
    dependencies = [],
    offset = 0,
    scrollOnMount = true,
  } = options;

  const location = useLocation();

  useEffect(() => {
    if (scrollOnMount || location.pathname) {
      window.scrollTo({
        top: offset,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, [location.pathname, smooth, offset, scrollOnMount, ...dependencies]);
};

/**
 * Utility function to scroll to top programmatically
 * Can be used in event handlers or other functions
 * 
 * @param options - Scroll options
 */
export const scrollToTop = (options: { smooth?: boolean; offset?: number } = {}) => {
  const { smooth = true, offset = 0 } = options;
  window.scrollTo({
    top: offset,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

