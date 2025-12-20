import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  ShoppingBag, 
  MapPin, 
  Truck, 
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  shippingMethod: string;
  shippingCost: number;
  tax: number;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium text-foreground">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium text-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-lg text-foreground">₹{order.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{order.shippingAddress.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items & Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                      {item.brand && (
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {order.shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      <span className="text-foreground">₹{order.shippingCost.toLocaleString()}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span className="font-medium text-foreground">₹{order.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">You'll receive an email confirmation shortly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-muted-foreground">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground">We'll prepare your order for shipment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-muted-foreground">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Shipping</p>
                    <p className="text-sm text-muted-foreground">Your order will be dispatched and you'll receive tracking details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-muted-foreground">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Delivery</p>
                    <p className="text-sm text-muted-foreground">Your order will be delivered to your address</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate('/orders')}
            size="lg"
          >
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
