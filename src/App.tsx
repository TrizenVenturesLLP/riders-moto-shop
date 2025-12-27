import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { trackEvent } from "@/hooks/useAnalytics";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UnifiedProductListing from "@/pages/UnifiedProductListing";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import AllBikes from "@/pages/AllBikes";
import FeaturedProducts from "@/pages/FeaturedProducts";
import Apparels from "@/pages/Apparels";
import Wishlist from "@/pages/Wishlist";
import LoginPromptModal from "@/components/LoginPromptModal";

const queryClient = new QueryClient();

// Component to track page views on route changes and scroll to top
const PageViewTracker = () => {
  const location = useLocation();

  // Scroll to top on route change
  useScrollToTop();

  useEffect(() => {
    // Track page view on route change
    trackEvent('page_view', {
      metadata: {
        pageUrl: window.location.href,
        pathname: location.pathname,
        referrer: document.referrer || 'direct',
      },
    });
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <PageViewTracker />
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
              <LoginPromptModal />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/all-bikes" element={<AllBikes />} />
                <Route path="/products" element={<FeaturedProducts />} />
                <Route path="/apparels" element={<Apparels />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchResults />} />
                  
                  {/* Unified Product Listing - handles all collection routes */}
                  {/* Bike model routes - for bike-specific product browsing */}
                  <Route
                    path="/collections/bikes/:model"
                    element={<UnifiedProductListing pageType="bike" />}
                  />
                  
                  {/* Accessory/Category routes - for browsing by accessory type */}
                  <Route
                    path="/collections/accessories/:category"
                    element={<UnifiedProductListing pageType="accessory" />}
                  />
                  
                  {/* Apparels route - specific route */}
                  <Route
                    path="/collections/apparels"
                    element={<UnifiedProductListing pageType="apparel" />}
                  />
                  
                  {/* Generic collections route - fallback (must be last) */}
                  <Route
                    path="/collections/:slug"
                    element={<UnifiedProductListing pageType="generic" />}
                  />

                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmation />}
                  />
                
                {/* Auth Routes - Only accessible when not logged in */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Signup />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Routes - Only accessible when logged in */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
