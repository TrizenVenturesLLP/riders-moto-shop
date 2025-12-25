import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/hooks/useAnalytics';
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Shield,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import shippingService, { ShippingCalculationResponse, ShippingRatesResponse } from '@/services/shippingService';

interface AddressFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface ShippingRates {
  [key: string]: {
    name: string;
    price: number;
    estimatedDays: string;
  };
}

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Track checkout started on mount
  useEffect(() => {
    trackEvent('checkout_started', {
      metadata: {
        cartValue: totalPrice,
        itemCount: totalItems,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  }, []); // Only track once on mount

  const [formData, setFormData] = useState<AddressFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingCalculationResponse | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRatesResponse | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    isValidating: boolean;
    message: string;
  }>({ isValid: false, isValidating: false, message: '' });

  const [pincodeValidation, setPincodeValidation] = useState<{
    isValid: boolean;
    isValidating: boolean;
    message: string;
  }>({ isValid: false, isValidating: false, message: '' });

  // Calculate shipping based on geocoding and distance
  const calculateShipping = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      return 0;
    }

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}, ${formData.country}`;
    
    try {
      setIsCalculatingShipping(true);
      console.log('🚚 Calculating shipping for address:', fullAddress);
      
      const response = await shippingService.calculateShipping({
        address: fullAddress,
        orderValue: totalPrice
      });

      setShippingData(response);
      
      // Get shipping rates for different methods
      const ratesResponse = await shippingService.getShippingRates(fullAddress, totalPrice);
      setShippingRates(ratesResponse);
      
      console.log('✅ Shipping calculated:', response.data);
      return response.data.shippingCost;
    } catch (error) {
      console.error('❌ Shipping calculation error:', error);
      return 0;
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Validate address when user completes the form
  const validateAddress = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      setAddressValidation({ isValid: false, isValidating: false, message: '' });
      return;
    }

    // Strategy 1: Try pincode validation first (most reliable for India)
    if (formData.pincode && formData.pincode.length === 6) {
      try {
        setPincodeValidation({ isValid: false, isValidating: true, message: 'Validating pincode...' });
        
        const pincodeResponse = await shippingService.validatePincode(formData.pincode, totalPrice);
        
        if (pincodeResponse.data.valid) {
          setPincodeValidation({ 
            isValid: true, 
            isValidating: false, 
            message: 'Pincode validated' 
          });
          
          // Set shipping data from pincode response
          setShippingData({
            success: true,
            data: {
              shippingCost: pincodeResponse.data.shippingCost,
              distance: pincodeResponse.data.distance,
              duration: pincodeResponse.data.duration,
              coordinates: pincodeResponse.data.coordinates,
              shopLocation: {
                lat: 17.385044,
                lon: 78.486671,
                address: "Hyderabad, Telangana, India"
              },
              fallback: false,
              orderValue: totalPrice,
              freeShippingThreshold: 999
            }
          });
          
          // Get shipping rates
          const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}, ${formData.country}`;
          const ratesResponse = await shippingService.getShippingRates(fullAddress, totalPrice);
          setShippingRates(ratesResponse);
          
          return; // Success, no need to try address validation
        } else {
          setPincodeValidation({ 
            isValid: false, 
            isValidating: false, 
            message: pincodeResponse.data.error || 'Invalid pincode' 
          });
          console.log('⚠️ Pincode validation failed:', pincodeResponse.data.error);
          // Continue to address validation
        }
      } catch (error) {
        setPincodeValidation({ 
          isValid: false, 
          isValidating: false, 
          message: 'Pincode validation failed' 
        });
        console.log('⚠️ Pincode validation error:', error);
        // Continue to address validation
      }
    }

    // Strategy 2: Fallback to full address validation
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}, ${formData.country}`;
    
    try {
      setAddressValidation({ isValid: false, isValidating: true, message: 'Validating address...' });
      
      const response = await shippingService.validateAddress(fullAddress);
      
      if (response.data.valid) {
        setAddressValidation({ 
          isValid: true, 
          isValidating: false, 
          message: 'Address validated successfully' 
        });
        // Auto-calculate shipping when address is valid
        await calculateShipping();
      } else {
        setAddressValidation({ 
          isValid: false, 
          isValidating: false, 
          message: response.data.error || 'Address could not be validated' 
        });
      }
    } catch (error) {
      console.error('❌ Address validation error:', error);
      setAddressValidation({ 
        isValid: false, 
        isValidating: false, 
        message: 'Address validation failed' 
      });
    }
  };

  // Auto-validate address when form is complete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.address && formData.city && formData.state && formData.pincode) {
        validateAddress();
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timer);
  }, [formData.address, formData.city, formData.state, formData.pincode]);

  // Get current shipping cost
  const getCurrentShippingCost = () => {
    if (!shippingRates?.data?.shippingRates) {
      return 0;
    }

    const selectedRate = shippingRates.data.shippingRates[selectedShipping as keyof typeof shippingRates.data.shippingRates];
    return selectedRate?.cost || 0;
  };

  // Legacy shipping calculation (fallback)
  const getLegacyShippingCost = () => {
    const subtotal = totalPrice;
    
    // Free shipping for orders over ₹999
    if (subtotal >= 999) {
      return 0;
    }

    // Different rates based on state/region
    const state = formData.state.toLowerCase();
    
    // Metro cities - lower shipping
    if (['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'].includes(state)) {
      return Math.round(shippingRates[selectedShipping].price * 0.8);
    }
    
    // Remote areas - higher shipping
    if (['jammu and kashmir', 'himachal pradesh', 'uttarakhand', 'northeast'].includes(state)) {
      return Math.round(shippingRates[selectedShipping].price * 1.5);
    }

    // Standard rate
    return 150; // Fallback rate
  };

  // Use geocoding-based shipping if available, otherwise fallback
  const shippingCost = shippingRates?.data?.shippingRates ? getCurrentShippingCost() : getLegacyShippingCost();
  const tax = Math.round(totalPrice * 0.18); // 18% GST
  const finalTotal = totalPrice + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear pincode validation when pincode changes
    if (name === 'pincode') {
      setPincodeValidation({ isValid: false, isValidating: false, message: '' });
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof AddressFormData].trim()) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    // Validate phone
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Prepare payment data
      const paymentData = {
        orderId,
        amount: totalPrice,
        shippingCost,
        tax,
        total: finalTotal,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: formData
      };
      
      // Navigate to payment page with order data
      navigate('/payment', { 
        state: { paymentData } 
      });

    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 md:h-24 md:w-24 text-muted-foreground/30 mx-auto mb-4 md:mb-6" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">Add some items to your cart to proceed with checkout.</p>
            <Button onClick={() => navigate('/')} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="mb-2 sm:mb-4 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Shipping Address */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Shipping Address
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Enter your delivery address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="address" className="text-xs sm:text-sm">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                  {addressValidation.isValidating && (
                    <div className="flex items-center text-xs sm:text-sm text-primary">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                      {addressValidation.message}
                    </div>
                  )}
                  {addressValidation.isValid && !addressValidation.isValidating && (
                    <div className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      {addressValidation.message}
                    </div>
                  )}
                  {!addressValidation.isValid && !addressValidation.isValidating && addressValidation.message && (
                    <div className="flex items-center text-xs sm:text-sm text-destructive">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      {addressValidation.message}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="city" className="text-xs sm:text-sm">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="state" className="text-xs sm:text-sm">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter your state"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="pincode" className="text-xs sm:text-sm">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter pincode"
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                    {pincodeValidation.isValidating && (
                      <div className="flex items-center text-xs sm:text-sm text-primary">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                        {pincodeValidation.message}
                      </div>
                    )}
                    {pincodeValidation.isValid && !pincodeValidation.isValidating && (
                      <div className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        {pincodeValidation.message}
                      </div>
                    )}
                    {!pincodeValidation.isValid && !pincodeValidation.isValidating && pincodeValidation.message && (
                      <div className="flex items-center text-xs sm:text-sm text-destructive">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        {pincodeValidation.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="country" className="text-xs sm:text-sm">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Shipping Method
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Choose your preferred delivery option
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                {isCalculatingShipping ? (
                  <div className="flex items-center justify-center py-4 sm:py-6 md:py-8">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin mr-2" />
                    <span className="text-xs sm:text-sm md:text-base">Calculating shipping rates...</span>
                  </div>
                ) : shippingRates?.data?.shippingRates ? (
                  Object.entries(shippingRates.data.shippingRates).map(([key, rate]) => (
                    <div
                      key={key}
                      className={`border rounded-lg p-2.5 sm:p-3 md:p-4 cursor-pointer transition-colors ${
                        selectedShipping === key
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-border/70'
                      }`}
                      onClick={() => setSelectedShipping(key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={key}
                            checked={selectedShipping === key}
                            onChange={() => setSelectedShipping(key)}
                            className="text-primary"
                          />
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">{rate.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{rate.estimatedDays}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground/70">{rate.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm sm:text-base">
                            {rate.cost === 0 ? 'Free' : `₹${rate.cost}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 sm:py-6 md:py-8 text-muted-foreground/70">
                    <p className="text-xs sm:text-sm md:text-base">Please complete your address to see shipping options</p>
                  </div>
                )}
                
                {/* Show distance information if available */}
                {shippingData?.data?.distance && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center text-xs sm:text-sm text-primary">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      <span>
                        Distance: {shippingData.data.distance.toFixed(1)} km
                        {shippingData.data.fallback && ' (estimated)'}
                      </span>
                    </div>
                    {shippingData.data.warning && (
                      <p className="text-[10px] sm:text-xs text-primary/80 mt-1">{shippingData.data.warning}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary Card */}
            <Card className="border-border">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {isCalculatingShipping ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1" />
                        <span className="text-xs sm:text-sm">Calculating...</span>
                      </div>
                    ) : shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      `₹${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm sm:text-base md:text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 sm:py-3 text-sm sm:text-base md:text-lg rounded-none"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="text-xs sm:text-sm md:text-base">Processing Order...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-xs sm:text-sm md:text-base">Place Order - ₹{finalTotal.toLocaleString()}</span>
                </>
              )}
            </Button>

            {/* Trust Badges */}
            <Card className="border-border">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Multiple payment options available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Fast and reliable delivery</span>
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

export default Checkout;

                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Fast and reliable delivery</span>
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

export default Checkout;
