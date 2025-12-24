import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2999,
      items: [
        { name: 'Yamaha MT-15 Crash Guard', quantity: 1, price: 2999 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 4599,
      items: [
        { name: 'Royal Enfield Himalayan 450 Engine Guard', quantity: 1, price: 4599 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-primary/10 text-primary';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-8 md:py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 md:h-24 md:w-24 text-muted-foreground/30 mx-auto mb-4 md:mb-6" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">No Orders Yet</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
              <Button onClick={() => navigate('/')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </div>
                      </Badge>
                      <span className="text-base md:text-lg font-bold text-foreground">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground/40" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground/70">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-foreground ml-2">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
