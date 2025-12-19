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
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-3 text-gray-600 hover:text-gray-900 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600 mt-1">Your cart is empty</p>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-12 border border-gray-200 shadow-sm">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-sm text-gray-600 mb-4">Looks like you haven't added any items to your cart yet.</p>
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
    <div className="min-h-screen bg-white py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-600 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.brand && (
                        <p className="text-xs text-gray-600">{item.brand}</p>
                      )}
                      {item.sku && (
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-base font-bold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border border-gray-300 rounded-none">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0 hover:bg-gray-100 rounded-none"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="px-2 py-1 text-sm font-medium min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.maxQuantity || 10)}
                          className="h-7 w-7 p-0 hover:bg-gray-100 disabled:opacity-50 rounded-none"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <span className="text-base font-bold text-gray-900">
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
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-sm rounded-none"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Order Summary Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {totalPrice >= 999 ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹0</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button 
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm rounded-none"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>

            {/* Trust Badges */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
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
