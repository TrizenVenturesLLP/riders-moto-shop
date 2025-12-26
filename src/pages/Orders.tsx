import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShoppingBag, ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Loader2, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders, useOrder, Order } from '@/hooks/useOrders';

const Orders = () => {
  const navigate = useNavigate();
  const { data: ordersData, isLoading, error } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orderData } = useOrder(selectedOrderId);

  const orders = ordersData?.data?.orders || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />;
      case 'shipped': return <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      case 'rejected': return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      case 'refunded': return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />;
      default: return <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-primary/10 text-primary';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'rejected': return 'bg-red-600/10 text-red-600';
      case 'refunded': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'failed': return 'bg-red-500/10 text-red-500';
      case 'refunded': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const selectedOrder = orderData?.data?.order;

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

        {isLoading ? (
          <Card className="text-center py-6 sm:py-8 md:py-12 border-border">
            <CardContent className="p-4 sm:p-6">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 text-primary animate-spin mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">Loading Orders...</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Please wait while we fetch your orders.</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="text-center py-6 sm:py-8 md:py-12 border-border">
            <CardContent className="p-4 sm:p-6">
              <XCircle className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 text-red-500 mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">Error Loading Orders</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">Failed to load your orders. Please try again later.</p>
              <Button onClick={() => window.location.reload()} className="text-xs sm:text-sm rounded-none">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
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
                        <span className="truncate">Order #{order.orderNumber}</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      <Badge className={`${getStatusColor(order.status)} text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                        <div className="flex items-center">
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          <span className="capitalize">{order.status === 'rejected' ? 'Rejected' : order.status}</span>
                        </div>
                      </Badge>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-foreground whitespace-nowrap">
                          ₹{parseFloat(order.totalAmount).toLocaleString()}
                        </span>
                        <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-xs px-2 py-0.5`}>
                          {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Payment Pending' : order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {/* Show rejection reason if order is rejected */}
                  {(order.status === 'rejected' || order.paymentVerificationStatus === 'rejected') && order.paymentRejectionReason && (
                    <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4">
                      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
                                Order Rejected
                              </p>
                              <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">
                                {order.paymentRejectionReason}
                              </p>
                              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                Please contact our support team or make the necessary changes and try again.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0 gap-2 sm:gap-3">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName || item.product?.name || 'Product'} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-xs sm:text-sm md:text-base text-foreground truncate">
                                {item.productName || item.product?.name || 'Product'}
                              </p>
                              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground/70">
                                Quantity: {item.quantity} × ₹{parseFloat(item.unitPrice || '0').toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium text-xs sm:text-sm md:text-base text-foreground whitespace-nowrap flex-shrink-0">
                            ₹{parseFloat(item.totalPrice || item.unitPrice || '0').toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground py-2">No items found</p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs sm:text-sm rounded-none"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{selectedOrder.orderNumber}
                  </DialogTitle>
                  <DialogDescription>
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Order Status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${getStatusColor(selectedOrder.status)} text-sm px-3 py-1`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedOrder.status)}
                        <span className="capitalize">{selectedOrder.status === 'rejected' ? 'Rejected' : selectedOrder.status}</span>
                      </div>
                    </Badge>
                    <Badge className={`${getPaymentStatusColor(selectedOrder.paymentStatus)} text-sm px-3 py-1`}>
                      Payment: {selectedOrder.paymentStatus === 'paid' ? 'Paid' : selectedOrder.paymentStatus === 'pending' ? 'Pending' : selectedOrder.paymentStatus}
                    </Badge>
                    {selectedOrder.paymentVerificationStatus && (
                      <Badge className={`${
                        selectedOrder.paymentVerificationStatus === 'approved' 
                          ? 'bg-green-500/10 text-green-500' 
                          : selectedOrder.paymentVerificationStatus === 'rejected'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      } text-sm px-3 py-1`}>
                        Verification: {selectedOrder.paymentVerificationStatus}
                      </Badge>
                    )}
                  </div>

                  {/* Rejection Reason - Show if order status is rejected OR payment verification is rejected */}
                  {(selectedOrder.status === 'rejected' || selectedOrder.paymentVerificationStatus === 'rejected') && selectedOrder.paymentRejectionReason && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Order Rejected
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {selectedOrder.paymentRejectionReason}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-red-200 dark:border-red-800">
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">What to do next:</p>
                          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                            <li>Review the rejection reason above</li>
                            <li>Make necessary corrections to your payment or order details</li>
                            <li>Contact our support team if you need assistance</li>
                            <li>You can place a new order after addressing the issues</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName || item.product?.name || 'Product'} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="h-6 w-6 text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">{item.productName || item.product?.name || 'Product'}</p>
                              <p className="text-sm text-muted-foreground">SKU: {item.product?.sku || 'N/A'}</p>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">₹{parseFloat(item.totalPrice || item.unitPrice || '0').toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">₹{parseFloat(item.unitPrice || '0').toLocaleString()} each</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No items found</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    <Card className="border-border">
                      <CardContent className="p-4">
                        <p className="font-medium text-foreground">
                          {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                        </p>
                        {selectedOrder.shippingAddress.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {selectedOrder.shippingAddress.email}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {selectedOrder.shippingAddress.phone}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedOrder.shippingAddress.address1}
                          {selectedOrder.shippingAddress.address2 && `, ${selectedOrder.shippingAddress.address2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                    <Card className="border-border">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">₹{parseFloat(selectedOrder.subtotal).toLocaleString()}</span>
                        </div>
                        {parseFloat(selectedOrder.shippingAmount) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-foreground">₹{parseFloat(selectedOrder.shippingAmount).toLocaleString()}</span>
                          </div>
                        )}
                        {parseFloat(selectedOrder.taxAmount) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="text-foreground">₹{parseFloat(selectedOrder.taxAmount).toLocaleString()}</span>
                          </div>
                        )}
                        {parseFloat(selectedOrder.discountAmount) > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-₹{parseFloat(selectedOrder.discountAmount).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                          <span className="text-foreground">Total</span>
                          <span className="text-foreground">₹{parseFloat(selectedOrder.totalAmount).toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tracking Number */}
                  {selectedOrder.trackingNumber && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Tracking Information</h3>
                      <Card className="border-border">
                        <CardContent className="p-4">
                          <p className="text-sm text-foreground">
                            <span className="text-muted-foreground">Tracking Number:</span>{' '}
                            <span className="font-mono font-medium">{selectedOrder.trackingNumber}</span>
                          </p>
                          {selectedOrder.shippedAt && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Shipped on {new Date(selectedOrder.shippedAt).toLocaleDateString()}
                            </p>
                          )}
                          {selectedOrder.deliveredAt && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Delivered on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Order Notes</h3>
                      <Card className="border-border">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;
