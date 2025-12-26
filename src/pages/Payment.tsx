import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/hooks/useAnalytics';
import { API_BASE_URL } from '@/config/api';
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
  ExternalLink,
  Upload,
  X,
  Image as ImageIcon
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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'uploaded'>('pending');
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '7013038373@okbizaxis',
    businessName: 'RidersMotoShop'
  });
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

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
          description: "Complete the payment in your UPI app and upload the screenshot below.",
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

  // Handle screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPEG, PNG, WebP, or GIF)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image under 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setScreenshot(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove screenshot
  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview('');
  };

  // Submit payment with screenshot
  const handlePaymentSubmission = async () => {
    if (!paymentData) return;

    if (!screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload a payment screenshot to proceed",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setPaymentStatus('processing');

    try {
      // Upload screenshot to backend
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      
      const response = await fetch(`${API_BASE_URL}/orders/${paymentData.orderId}/payment-screenshot`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to upload screenshot');
      }

      // Track event: payment_screenshot_uploaded (not purchase_completed yet)
      trackEvent('payment_screenshot_uploaded', {
        metadata: {
          orderId: paymentData.orderId,
          orderTotal: paymentData.total,
          itemCount: paymentData.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      });

      setPaymentStatus('uploaded');
      
      // Clear cart
      clearCart();
      
      toast({
        title: "Screenshot Uploaded!",
        description: "Your payment is under verification. You'll be notified once verified.",
      });

      // Redirect to order status page
      navigate(`/orders/${paymentData.orderId}`);
      
    } catch (error: any) {
      console.error('Screenshot upload error:', error);
      setPaymentStatus('pending');
      toast({
        title: "Upload Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/checkout')}
            className="mr-2 sm:mr-4 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Checkout
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Complete Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Payment Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Method Card */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  UPI Payment
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Pay securely using UPI apps like Google Pay, PhonePe, or Paytm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 pt-0">
                {/* UPI ID Display */}
                <div className="bg-primary/10 p-2.5 sm:p-3 md:p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-primary font-medium">Pay to UPI ID</p>
                      <p className="text-sm sm:text-base md:text-lg font-mono text-foreground break-all">{paymentConfig.upiId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUPIId}
                      className="text-primary border-primary/30 hover:bg-primary/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Copy</span>
                    </Button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border-2 border-dashed border-border">
                    {isGeneratingQR ? (
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Generating QR Code...</p>
                      </div>
                    ) : qrCodeImage ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={qrCodeImage} 
                          alt="UPI Payment QR Code" 
                          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 rounded-lg shadow-sm"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {isMobile ? 'Tap "Pay Now" to open UPI app' : 'Scan this QR code with your UPI app'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1 sm:mt-2">
                          Amount: ₹{paymentData.total}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={regenerateQRCode}
                          disabled={isGeneratingQR}
                          className="mt-2 text-[10px] sm:text-xs px-2 sm:px-3"
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
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32">
                        <QrCode className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-xs sm:text-sm text-muted-foreground">QR Code will appear here</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Instructions */}
                  <div className="text-left space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span>Open your UPI app (Google Pay, PhonePe, Paytm)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span>Scan the QR code or enter UPI ID manually</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span>Enter amount: ₹{paymentData.total}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span>Complete the payment</span>
                    </div>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    onClick={handlePayNow}
                    disabled={paymentStatus === 'processing'}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2.5 sm:py-3 text-sm sm:text-base md:text-lg rounded-none"
                    size="lg"
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        <span className="text-xs sm:text-sm md:text-base">Processing...</span>
                      </>
                    ) : isMobile ? (
                      <>
                        <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="text-xs sm:text-sm md:text-base">Pay Now - ₹{paymentData.total}</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="text-xs sm:text-sm md:text-base">Show Payment Details</span>
                      </>
                    )}
                  </Button>

                  {/* Screenshot Upload Section */}
                  <div className="space-y-2 sm:space-y-3">
                    {!screenshotPreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                          <p className="mb-1 text-xs sm:text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> payment screenshot
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground/70">
                            PNG, JPG, WEBP or GIF (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          disabled={isUploading}
                        />
                      </label>
                    ) : (
                      <div className="relative border border-border rounded-lg p-2 sm:p-3">
                        <img
                          src={screenshotPreview}
                          alt="Payment screenshot preview"
                          className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeScreenshot}
                          className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-background/80 hover:bg-background"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={handlePaymentSubmission}
                      disabled={!screenshot || isUploading || paymentStatus === 'uploaded'}
                      variant="outline"
                      className="w-full text-xs sm:text-sm md:text-base rounded-none"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </>
                      ) : paymentStatus === 'uploaded' ? (
                        <>
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600 dark:text-green-400" />
                          Screenshot Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Upload Screenshot & Submit
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground/70">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span>Secure payment powered by UPI</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            {paymentStatus !== 'pending' && (
              <Card className="border-border">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {paymentStatus === 'processing' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-primary"></div>
                        <span className="text-xs sm:text-sm md:text-base text-primary">Uploading screenshot...</span>
                      </>
                    ) : paymentStatus === 'uploaded' ? (
                      <>
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm md:text-base text-green-600 dark:text-green-400 font-medium">
                            Screenshot uploaded successfully!
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            Your payment is under verification. You'll be notified once verified.
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Details */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Order Summary</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">Order ID: #{paymentData.orderId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                {/* Items */}
                <div className="space-y-2 sm:space-y-3">
                  {paymentData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/70">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-xs sm:text-sm flex-shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal</span>
                    <span>₹{paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Shipping</span>
                    <span>₹{paymentData.shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{paymentData.tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-sm sm:text-base md:text-lg">
                    <span>Total</span>
                    <span>₹{paymentData.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="space-y-1 text-xs sm:text-sm">
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
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-xs sm:text-sm md:text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground p-3 sm:p-4 md:p-6 pt-0">
                <p>• Make sure you have sufficient balance in your UPI app</p>
                <p>• Keep your phone nearby for OTP verification</p>
                <p>• Contact support if payment fails</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPaymentDetails}
                  className="w-full mt-2 sm:mt-3 text-xs sm:text-sm rounded-none"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
