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
      case 'delivered': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />;
      case 'shipped': return <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      default: return <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />;
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
    <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-2 sm:mb-4 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Profile
          </Button>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-6 sm:py-8 md:py-12 border-border">
            <CardContent className="p-4 sm:p-6">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 text-muted-foreground/30 mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">No Orders Yet</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
              <Button onClick={() => navigate('/')} className="text-xs sm:text-sm rounded-none">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border">
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">Order #{order.id}</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      <Badge className={`${getStatusColor(order.status)} text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                        <div className="flex items-center">
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                      <span className="text-sm sm:text-base md:text-lg font-bold text-foreground whitespace-nowrap">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0 gap-2 sm:gap-3">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground/40" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm md:text-base text-foreground truncate">{item.name}</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground/70">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-xs sm:text-sm md:text-base text-foreground whitespace-nowrap flex-shrink-0">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex justify-end">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm rounded-none">
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
