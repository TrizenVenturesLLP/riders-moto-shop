import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import paymentService from '@/services/paymentService';
import { 
  ArrowLeft,
  CreditCard,
  Smartphone,
  QrCode,
  CheckCircle,
  Clock,
  Shield,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  orderId: string;
  amount: number;
  shippingCost: number;
  tax: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
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
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '7013038373@okbizaxis',
    businessName: 'RidersMotoShop'
  });
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Detect if user is on mobile and load payment config
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(paymentService.isMobileDevice());
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load payment configuration
    const loadPaymentConfig = async () => {
      try {
        const config = paymentService.getPaymentConfig();
        setPaymentConfig({
          upiId: config.upiId,
          businessName: config.businessName
        });
      } catch (error) {
        console.error('Failed to load payment config:', error);
      }
    };
    
    loadPaymentConfig();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get payment data from location state and generate QR code
  useEffect(() => {
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
    } else {
      // Redirect to checkout if no payment data
      navigate('/checkout');
    }
  }, [location.state, navigate]);

  // Generate QR code when payment data is available
  useEffect(() => {
    const generateQRCode = async () => {
      if (!paymentData) return;
      
      setIsGeneratingQR(true);
      try {
        const qrImage = await paymentService.generateQRCodeImage(
          paymentConfig.upiId,
          paymentData.total,
          paymentData.orderId,
          paymentConfig.businessName
        );
        setQrCodeImage(qrImage);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        toast({
          title: "QR Code Error",
          description: "Failed to generate QR code. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingQR(false);
      }
    };

    generateQRCode();
  }, [paymentData, paymentConfig, toast]);

  // Generate UPI deeplink
  const generateUPILink = () => {
    if (!paymentData) return '';
    
    return paymentService.generateUPILink(
      paymentConfig.upiId,
      paymentData.total,
      paymentData.orderId,
      paymentConfig.businessName
    );
  };

  // Handle payment initiation
  const handlePayNow = () => {
    if (!paymentData) return;

    setPaymentStatus('processing');
    
    if (isMobile) {
      // Open UPI app on mobile
      const upiLink = generateUPILink();
      window.location.href = upiLink;
      
      // Show confirmation dialog after a delay
      setTimeout(() => {
        setPaymentStatus('pending');
        toast({
          title: "Payment App Opened",
          description: "Complete the payment in your UPI app and click 'I've Paid' below.",
        });
      }, 1000);
    } else {
      // On desktop, just show the QR code
      toast({
        title: "Scan QR Code",
        description: "Use your mobile UPI app to scan the QR code above.",
      });
    }
  };

  // Handle manual payment confirmation
  const handlePaymentConfirmation = async () => {
    if (!paymentData) return;

    try {
      setPaymentStatus('processing');
      
      // Here you would typically send payment confirmation to backend
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('completed');
      
      // Clear cart and redirect to order confirmation
      clearCart();
      
      toast({
        title: "Payment Confirmed!",
        description: "Your order has been placed successfully.",
      });

      // Redirect to order confirmation
      navigate(`/order-confirmation/${paymentData.orderId}`);
      
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setPaymentStatus('pending');
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  // Copy UPI ID to clipboard
  const copyUPIId = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    toast({
      title: "UPI ID Copied",
      description: "Paste this in your UPI app to make payment.",
    });
  };

  // Copy payment details
  const copyPaymentDetails = () => {
    if (!paymentData) return;
    
    const details = `Order ID: ${paymentData.orderId}\nAmount: ₹${paymentData.total}\nUPI ID: ${paymentConfig.upiId}`;
    navigator.clipboard.writeText(details);
    toast({
      title: "Payment Details Copied",
      description: "Share these details for payment confirmation.",
    });
  };

  // Regenerate QR code
  const regenerateQRCode = async () => {
    if (!paymentData) return;
    
    setIsGeneratingQR(true);
    try {
      const qrImage = await paymentService.generateQRCodeImage(
        paymentConfig.upiId,
        paymentData.total,
        paymentData.orderId,
        paymentConfig.businessName
      );
      setQrCodeImage(qrImage);
      toast({
        title: "QR Code Refreshed",
        description: "New QR code generated successfully.",
      });
    } catch (error) {
      console.error('Failed to regenerate QR code:', error);
      toast({
        title: "QR Code Error",
        description: "Failed to regenerate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/checkout')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Complete Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Section */}
          <div className="space-y-6">
            {/* Payment Method Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  UPI Payment
                </CardTitle>
                <CardDescription>
                  Pay securely using UPI apps like Google Pay, PhonePe, or Paytm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* UPI ID Display */}
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary font-medium">Pay to UPI ID</p>
                      <p className="text-lg font-mono text-foreground">{paymentConfig.upiId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUPIId}
                      className="text-primary border-primary/30 hover:bg-primary/20"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="text-center space-y-4">
                  <div className="bg-card p-4 md:p-6 rounded-lg border-2 border-dashed border-border">
                    {isGeneratingQR ? (
                      <div className="flex flex-col items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-sm text-muted-foreground">Generating QR Code...</p>
                      </div>
                    ) : qrCodeImage ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={qrCodeImage} 
                          alt="UPI Payment QR Code" 
                          className="w-32 h-32 mb-4 rounded-lg shadow-sm"
                        />
                        <p className="text-sm text-muted-foreground">
                          {isMobile ? 'Tap "Pay Now" to open UPI app' : 'Scan this QR code with your UPI app'}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          Amount: ₹{paymentData.total}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={regenerateQRCode}
                          disabled={isGeneratingQR}
                          className="mt-2 text-xs"
                        >
                          {isGeneratingQR ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                              Refreshing...
                            </>
                          ) : (
                            <>
                              <QrCode className="h-3 w-3 mr-1" />
                              Refresh QR
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32">
                        <QrCode className="h-16 w-16 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-sm text-muted-foreground">QR Code will appear here</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Instructions */}
                  <div className="text-left space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Open your UPI app (Google Pay, PhonePe, Paytm)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Scan the QR code or enter UPI ID manually</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Enter amount: ₹{paymentData.total}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Complete the payment</span>
                    </div>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handlePayNow}
                    disabled={paymentStatus === 'processing'}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 text-lg"
                    size="lg"
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : isMobile ? (
                      <>
                        <Smartphone className="h-5 w-5 mr-2" />
                        Pay Now - ₹{paymentData.total}
                      </>
                    ) : (
                      <>
                        <QrCode className="h-5 w-5 mr-2" />
                        Show Payment Details
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handlePaymentConfirmation}
                    disabled={paymentStatus === 'processing' || paymentStatus === 'completed'}
                    variant="outline"
                    className="w-full"
                  >
                    {paymentStatus === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Payment Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        I've Paid - Confirm Payment
                      </>
                    )}
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center text-sm text-muted-foreground/70">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure payment powered by UPI</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            {paymentStatus !== 'pending' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    {paymentStatus === 'processing' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-primary">Processing payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">Payment completed successfully!</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order ID: #{paymentData.orderId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {paymentData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground/70">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹{paymentData.shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{paymentData.tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{paymentData.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {paymentData.shippingAddress.firstName} {paymentData.shippingAddress.lastName}
                  </p>
                  <p>{paymentData.shippingAddress.address}</p>
                  <p>
                    {paymentData.shippingAddress.city}, {paymentData.shippingAddress.state} {paymentData.shippingAddress.pincode}
                  </p>
                  <p>{paymentData.shippingAddress.country}</p>
                  <p className="text-muted-foreground/70">{paymentData.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Make sure you have sufficient balance in your UPI app</p>
                <p>• Keep your phone nearby for OTP verification</p>
                <p>• Contact support if payment fails</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPaymentDetails}
                  className="w-full mt-3"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Payment Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
