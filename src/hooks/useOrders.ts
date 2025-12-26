import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/api';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod?: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'upi';
  paymentVerificationStatus?: 'pending' | 'approved' | 'rejected';
  paymentRejectionReason?: string;
  subtotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount: string;
  totalAmount: string;
  currency: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

// Fetch all orders
const fetchOrders = async (): Promise<OrdersResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

// Fetch single order
const fetchOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  return response.json();
};

// Hook to fetch all orders
export const useOrders = () => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

// Hook to fetch single order
export const useOrder = (orderId: string | null) => {
  return useQuery<OrderResponse>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

