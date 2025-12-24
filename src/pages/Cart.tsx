import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-3 text-muted-foreground hover:text-foreground text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-sm text-muted-foreground mt-1">Your cart is empty</p>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-8 md:py-12 border border-border shadow-sm">
            <CardContent>
              <ShoppingCart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground mb-4">Looks like you haven't added any items to your cart yet.</p>
              <Button onClick={() => navigate('/')} className="rounded-none">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border border-border shadow-sm">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="text-sm md:text-base font-semibold text-foreground truncate">
                        {item.name}
                      </h3>
                      {item.brand && (
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      )}
                      {item.sku && (
                        <p className="text-xs text-muted-foreground/70">SKU: {item.sku}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm md:text-base font-bold text-foreground">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center border border-border rounded-none">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0 hover:bg-accent rounded-none"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="px-2 py-1 text-sm font-medium min-w-[1.5rem] text-center text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.maxQuantity || 10)}
                          className="h-7 w-7 p-0 hover:bg-accent disabled:opacity-50 rounded-none"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right sm:text-left w-full sm:w-auto">
                      <span className="text-sm md:text-base font-bold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:border-destructive text-sm rounded-none"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Order Summary Card */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-foreground">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">
                    {totalPrice >= 999 ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">₹0</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button 
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm rounded-none"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>

            {/* Trust Badges */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Multiple payment options available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
