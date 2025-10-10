import { API_BASE_URL } from '../config/api';
import QRCode from 'qrcode';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    upiId: string;
    qrCode?: string;
    upiLink: string;
    createdAt: string;
  };
}

export interface PaymentConfirmation {
  paymentId: string;
  orderId: string;
  amount: number;
  paymentMethod: 'UPI';
  transactionId?: string;
  screenshot?: string;
  notes?: string;
}

class PaymentService {
  /**
   * Create a new payment request
   */
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('💳 Creating payment request:', paymentData);
      
      const response = await fetch(`${API_BASE_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Payment created:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Payment creation error:', error);
      
      // Fallback: Generate UPI link locally
      return this.generateFallbackPayment(paymentData);
    }
  }

  /**
   * Confirm payment manually
   */
  async confirmPayment(confirmation: PaymentConfirmation): Promise<{ success: boolean; message: string }> {
    try {
      console.log('✅ Confirming payment:', confirmation);
      
      const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Payment confirmed:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Payment confirmation error:', error);
      
      // Fallback: Save to localStorage
      return this.savePaymentConfirmation(confirmation);
    }
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{ status: string; data?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Payment status check error:', error);
      return { status: 'unknown' };
    }
  }

  /**
   * Generate UPI deeplink
   */
  generateUPILink(upiId: string, amount: number, orderId: string, businessName: string): string {
    const params = new URLSearchParams({
      pa: upiId,
      pn: businessName,
      am: amount.toString(),
      cu: 'INR',
      tn: `Order #${orderId}`
    });
    
    return `upi://pay?${params.toString()}`;
  }

  /**
   * Generate QR code data for UPI payment
   */
  generateQRData(upiId: string, amount: number, orderId: string, businessName: string): string {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order #${orderId}`)}`;
  }

  /**
   * Generate QR code image as data URL
   */
  async generateQRCodeImage(upiId: string, amount: number, orderId: string, businessName: string): Promise<string> {
    try {
      const qrData = this.generateQRData(upiId, amount, orderId, businessName);
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('QR code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code with custom styling
   */
  async generateStyledQRCode(upiId: string, amount: number, orderId: string, businessName: string, options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
    logo?: string;
  }): Promise<string> {
    try {
      const qrData = this.generateQRData(upiId, amount, orderId, businessName);
      
      const qrOptions = {
        width: options?.width || 256,
        margin: options?.margin || 2,
        color: {
          dark: options?.darkColor || '#1f2937',
          light: options?.lightColor || '#ffffff'
        },
        errorCorrectionLevel: 'M' as const
      };
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, qrOptions);
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Styled QR code generation error:', error);
      throw new Error('Failed to generate styled QR code');
    }
  }

  /**
   * Detect if user is on mobile device
   */
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Fallback payment generation when backend is unavailable
   */
  private generateFallbackPayment(paymentData: PaymentRequest): PaymentResponse {
    const upiId = 'ridersmotoshop@okaxis'; // Replace with actual UPI ID
    const businessName = 'Riders Moto Shop';
    const upiLink = this.generateUPILink(upiId, paymentData.amount, paymentData.orderId, businessName);
    
    return {
      success: true,
      data: {
        paymentId: `PAY-${Date.now()}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'pending',
        upiId,
        upiLink,
        createdAt: new Date().toISOString()
      }
    };
  }

  /**
   * Save payment confirmation to localStorage as fallback
   */
  private savePaymentConfirmation(confirmation: PaymentConfirmation): { success: boolean; message: string } {
    try {
      const confirmations = JSON.parse(localStorage.getItem('paymentConfirmations') || '[]');
      confirmations.push({
        ...confirmation,
        confirmedAt: new Date().toISOString()
      });
      localStorage.setItem('paymentConfirmations', JSON.stringify(confirmations));
      
      return {
        success: true,
        message: 'Payment confirmation saved locally. Admin will verify manually.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save payment confirmation'
      };
    }
  }

  /**
   * Get payment configuration
   */
  getPaymentConfig() {
    return {
      upiId: '7013038373@okbizaxis', // Your actual UPI ID
      businessName: 'RidersMotoShop',
      supportedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'],
      currency: 'INR',
      timeout: 300000 // 5 minutes
    };
  }

  /**
   * Validate UPI ID format
   */
  isValidUPIId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

export default new PaymentService();
