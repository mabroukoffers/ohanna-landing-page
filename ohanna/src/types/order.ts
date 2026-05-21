/**
 * Order types
 */

import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
}

export interface Order {
  id: string;
  stripeSessionId?: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: string;
  updatedAt?: string;
}

export interface OrderResponse {
  order: Order;
}

export interface CheckoutRequest {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

export interface TrackOrderRequest {
  id: string;
  email: string;
}

export interface TrackOrderResponse {
  order: Order;
}
