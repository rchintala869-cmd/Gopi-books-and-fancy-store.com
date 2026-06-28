/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  photo: string; // URL or base64 data url
  category: string;
  isCustom?: boolean; // True if added by owner
}

export enum FulfillmentType {
  StorePickup = "Store Pickup",
  HomeDelivery = "Home Delivery",
}

export enum PaymentMethod {
  COD = "Cash on Delivery",
  PhonePe = "PhonePe Scanner",
}

export enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Returned = "Refund Requested", // Returned status is requested by customer
  Refunded = "Refunded / Returned", // Refund approved/completed
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  fulfillment: FulfillmentType;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
