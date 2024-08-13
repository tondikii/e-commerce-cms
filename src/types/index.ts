import {ReactNode} from "react";

// custom event.target component Select @mui/joy
export interface CustomTargetType {
  name: string;
  value: string | number;
}

export interface UserType {
  name: string;
  email: string;
}

export type SessionType = {
  user: UserType;
} | null;

export interface MenuType {
  label: string;
  route: string;
  icon?: ReactNode;
  child?: MenuType[];
}
export type MenusType = MenuType[];

export interface Size {
  code: string;
  label?: string;
}

export interface ProductImage {
  url: string;
}

export interface ProductUnit {
  quantity: number;
  size: Size;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  styleId: number;
  productImages: ProductImage[];
  productUnits: ProductUnit[];
}

export type Products = Product[];

export interface FetchProductsParams {
  name?: string;
  page?: number;
  limit?: number;
  offset?: number;
  styleId?: number;
}
export interface FetchedProducts {
  data: {
    data: Products;
    totalRecords: number;
  } | null;
  loading: boolean;
  error: any;
}
