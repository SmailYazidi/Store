// lib/models.ts
import { ObjectId } from "mongodb";

// Shared types
export type LocalizedString = {
  ar: string;
  fr: string;
};

// Timestamp interface
export interface Timestamped {
  createdAt?: Date;
  updatedAt?: Date;
}

// Category
export interface Category extends Timestamped {
  _id?: ObjectId;
  name: LocalizedString;
}

// Product
export interface Product extends Timestamped {
  _id?: ObjectId;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currency?: string;
  images: string[];
  mainImage: string;
  categoryId: string;
  isVisible: boolean;
  quantity: number;
}

// Order Status Enum
export enum OrderStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  PAID = "paid",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  REJECTED = "rejected",
  PAYMENT_PENDING = "payment_pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
}

// Payment method
export type PaymentMethod = "card" | "cash" | "paypal" | null;

// Order Interface
export interface IOrder extends Timestamped {
  _id?: ObjectId;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productId: string;
  productName: string;
  productPrice: number;
  productCurrency?: string;
  productImage: string;
  quantity: number;
  status: OrderStatus;
  emailVerified?: boolean;
  paymentIntentId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: "pending" | "paid" | "failed";
  verificationCode?: string;
  isVerified?: boolean;
}

// Admin password
export interface AdminPassword extends Timestamped {
  _id?: ObjectId;
  passwordHash: string;
}
