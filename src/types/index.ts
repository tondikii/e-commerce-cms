import {ReactNode} from "react";
import {Product, Products} from "./product";
import {Categories} from "./category";

export * from "./product";
export * from "./category";

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

export interface UserType {
  id?: number;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt?: string;
}

export type SessionType = {
  user: UserType;
} | null;

export interface MenuType {
  label: string;
  route: string;
  icon?: ReactNode;
  child?: MenuType[];
  isChildren?: boolean;
}
export type MenusType = MenuType[];

export interface Size {
  id?: number;
  code: string;
  name?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface ColourOption {
  value: number;
  label: string;
  color: string;
}
export interface Collection {
  id: number;
  name: string;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export type Collections = Collection[];

export interface BreadCrumbData {
  name: string;
  label: string;
}

export interface FileWithPreview extends File {
  preview: string;
}

export interface AuthParamsImageKit {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export interface FetchedDataParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchedData {
  data: {
    data: Products | Categories | Collections;
    totalRecords: number;
  } | null;
  loading: boolean;
  error: any;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  optionValues: any; // JSON object
  productId: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  user: User;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  quantity: number;
  cartId: number;
  cart: Cart;
  variantId: number;
  variant: ProductVariant;
  // Optional: tambahan field untuk memudahkan frontend
  productName?: string;
  productImage?: string;
  variantName?: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  name?: string;
  phoneNumber?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  addresses?: ShippingAddress[];
  carts?: Cart[];
  orders?: Order[];
}

export interface ShippingAddress {
  id: number;
  recipient: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  userId: number;
  user: User;
  orders: Order[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod =
  | "BANK_TRANSFER"
  | "GOPAY"
  | "SHOPEEPAY"
  | "QRIS"
  | "CREDIT_CARD"
  | "ALFAMART"
  | "INDOMARET";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED";
export interface Payment {
  id: string;
  orderId: number;
  order: Order;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  snapToken?: string;
  vaNumber?: string;
  bank?: string;
  expiryAt?: Date;
  paidAt?: Date;
  midtransResponse?: any; // JSON object
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  order: Order;
  variantId: number;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  user: User;
  items: OrderItem[];
  shippingAddressId: number;
  shippingAddress: ShippingAddress;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  payment?: Payment;
  createdAt: Date;
  updatedAt: Date;
}
