import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import ProductListing from "./pages/ProductListing";
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
import BikePage from "@/pages/BikePage";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import LoginPromptModal from "@/components/LoginPromptModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <LoginPromptModal />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/search" element={<SearchResults />} />
                  {/* Bike model route must come before category route to avoid conflicts */}
                  <Route
                    path="/collections/:model"
                    element={<BikePage />}
                  />
                  {/* Category route - comes after model route */}
                  <Route
                    path="/collections/:category"
                    element={<ProductListing />}
                  />
                  {/* Keep old routes for backward compatibility */}
                  {/* <Route
                    path="/bike/:model"
                    element={<BikePage />}
                  />
                  <Route
                    path="/bikes/:brand/:model"
                    element={<BikePage />}
                  />
                  <Route
                    path="/bikes/:brand/:model/:category"
                    element={<BikePage />}
                  />
                  <Route
                    path="/bikes/:brand/:model/:category/:productType"
                    element={<BikePage />}
                  /> */}

                  <Route path="/cart" element={<Cart />} />
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
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
