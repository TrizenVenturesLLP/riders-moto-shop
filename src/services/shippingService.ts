import { API_BASE_URL } from '../config/api';

export interface ShippingCalculationRequest {
  address: string;
  orderValue?: number;
}

export interface ShippingCalculationResponse {
  success: boolean;
  data: {
    shippingCost: number;
    distance: number | null;
    duration: number | null;
    coordinates: {
      lat: number;
      lon: number;
      display_name: string;
    } | null;
    shopLocation: {
      lat: number;
      lon: number;
      address: string;
    };
    fallback: boolean;
    orderValue: number;
    freeShippingThreshold: number;
    warning?: string;
  };
}

export interface ShippingRatesResponse {
  success: boolean;
  data: {
    shippingRates: {
      standard: {
        name: string;
        cost: number;
        estimatedDays: string;
        description: string;
      };
      express: {
        name: string;
        cost: number;
        estimatedDays: string;
        description: string;
      };
      overnight: {
        name: string;
        cost: number;
        estimatedDays: string;
        description: string;
      };
    };
    distance: number | null;
    coordinates: {
      lat: number;
      lon: number;
      display_name: string;
    } | null;
    shopLocation: {
      lat: number;
      lon: number;
      address: string;
    };
    fallback: boolean;
    orderValue: number;
    freeShippingThreshold: number;
    warning?: string;
  };
}

export interface AddressValidationResponse {
  success: boolean;
  data: {
    valid: boolean;
    coordinates: {
      lat: number;
      lon: number;
      display_name: string;
    } | null;
    formattedAddress: string | null;
    error?: string;
  };
}

class ShippingService {
  /**
   * Calculate shipping cost for a given address
   */
  async calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResponse> {
    try {
      console.log('🚚 Calculating shipping for address:', request.address);
      
      const response = await fetch(`${API_BASE_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Shipping calculation response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Shipping calculation error:', error);
      
      // Return fallback response
      return {
        success: true,
        data: {
          shippingCost: this.getFallbackShippingCost(request.address, request.orderValue || 0),
          distance: null,
          duration: null,
          coordinates: null,
          shopLocation: {
            lat: 17.385044,
            lon: 78.486671,
            address: "Hyderabad, Telangana, India"
          },
          fallback: true,
          orderValue: request.orderValue || 0,
          freeShippingThreshold: 999,
          warning: 'Using fallback shipping calculation due to service unavailability'
        }
      };
    }
  }

  /**
   * Get shipping rates for different methods
   */
  async getShippingRates(address: string, orderValue: number = 0): Promise<ShippingRatesResponse> {
    try {
      console.log('📦 Getting shipping rates for address:', address);
      
      const response = await fetch(`${API_BASE_URL}/shipping/rates?address=${encodeURIComponent(address)}&orderValue=${orderValue}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Shipping rates response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Shipping rates error:', error);
      
      // Return fallback rates
      const baseShipping = this.getFallbackShippingCost(address, orderValue);
      
      return {
        success: true,
        data: {
          shippingRates: {
            standard: {
              name: 'Standard Shipping',
              cost: baseShipping,
              estimatedDays: '5-7 business days',
              description: 'Regular delivery service'
            },
            express: {
              name: 'Express Shipping',
              cost: Math.round(baseShipping * 1.5),
              estimatedDays: '2-3 business days',
              description: 'Faster delivery service'
            },
            overnight: {
              name: 'Overnight Delivery',
              cost: Math.round(baseShipping * 2),
              estimatedDays: '1 business day',
              description: 'Next day delivery (if available)'
            }
          },
          distance: null,
          coordinates: null,
          shopLocation: {
            lat: 17.385044,
            lon: 78.486671,
            address: "Hyderabad, Telangana, India"
          },
          fallback: true,
          orderValue,
          freeShippingThreshold: 999,
          warning: 'Using fallback shipping rates due to service unavailability'
        }
      };
    }
  }

  /**
   * Validate a pincode (preferred method for Indian addresses)
   */
  async validatePincode(pincode: string, orderValue: number = 0): Promise<any> {
    try {
      console.log('📮 Validating pincode:', pincode);
      
      const response = await fetch(`${API_BASE_URL}/shipping/validate-pincode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode, orderValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Pincode validation response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Pincode validation error:', error);
      
      return {
        success: true,
        data: {
          valid: false,
          pincode,
          coordinates: null,
          zone: null,
          shippingCost: null,
          error: 'Pincode validation service unavailable'
        }
      };
    }
  }

  /**
   * Validate an address
   */
  async validateAddress(address: string): Promise<AddressValidationResponse> {
    try {
      console.log('📍 Validating address:', address);
      
      const response = await fetch(`${API_BASE_URL}/shipping/validate-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Address validation response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Address validation error:', error);
      
      return {
        success: true,
        data: {
          valid: false,
          coordinates: null,
          formattedAddress: null,
          error: 'Address validation service unavailable'
        }
      };
    }
  }

  /**
   * Fallback shipping calculation when API is unavailable
   */
  private getFallbackShippingCost(address: string, orderValue: number): number {
    // Free shipping for orders over ₹999
    if (orderValue >= 999) {
      return 0;
    }

    // Basic shipping based on address keywords
    const addressLower = address.toLowerCase();
    let shippingCost = 150; // Default shipping

    // Metro cities - lower shipping
    if (addressLower.includes('mumbai') || addressLower.includes('delhi') || 
        addressLower.includes('bangalore') || addressLower.includes('chennai') ||
        addressLower.includes('hyderabad') || addressLower.includes('kolkata') ||
        addressLower.includes('pune') || addressLower.includes('ahmedabad')) {
      shippingCost = 100;
    }
    
    // Remote areas - higher shipping
    if (addressLower.includes('jammu') || addressLower.includes('kashmir') ||
        addressLower.includes('himachal') || addressLower.includes('uttarakhand') ||
        addressLower.includes('northeast') || addressLower.includes('arunachal')) {
      shippingCost = 300;
    }

    return shippingCost;
  }

  /**
   * Format address for better geocoding results
   */
  formatAddressForGeocoding(address: string): string {
    // Add India to the address if not present
    if (!address.toLowerCase().includes('india')) {
      address += ', India';
    }
    
    // Clean up the address
    return address
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Calculate tax (18% GST)
   */
  calculateTax(subtotal: number): number {
    return Math.round(subtotal * 0.18);
  }

  /**
   * Calculate total order amount
   */
  calculateTotal(subtotal: number, shippingCost: number): number {
    const tax = this.calculateTax(subtotal);
    return subtotal + shippingCost + tax;
  }
}

export default new ShippingService();
