/**
 * API type definitions
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CheckoutRequest {
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      description?: string;
    };
    quantity: number;
    size?: string;
  }>;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
    postalCode: string;
  };
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface TrackOrderRequest {
  id: string;
  email: string;
}

export interface TrackOrderResponse {
  order: {
    id: string;
    stripeSessionId?: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: any;
    items: any[];
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  badge?: string;
  imageUrl: string;
  stock: number;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsListResponse {
  products: ProductResponse[];
}
