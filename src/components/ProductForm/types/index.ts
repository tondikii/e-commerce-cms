// types/product-form.types.ts

import {ColourOption, Product} from "@/types";

export interface ProductFormProps {
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
  categoryId: number;
  mode?: "create" | "edit";
  product?: Product | null;
}

export interface AuthParams {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export interface UnitInput {
  code?: string;
  quantity: number;
  sizeId: number;
  colorId: number;
  id?: number;
}

export interface ImageInput {
  id?: number;
  colorId: number;
  file?: File | null;
  previewUrl?: string;
  url?: string;
}

export interface FormProduct {
  id?: number;
  styleId: number;
  name: string;
  description: string;
  price: string | number;
}

export interface UnitValidation {
  isCompletedUnits: boolean;
  unitColors: {colorId: number; label: string}[];
  duplicatedCodesIndex: number[][];
}

export interface FormValidation {
  isCompletedProduct: boolean;
  unitValidation: UnitValidation;
  isCompletedImages: boolean;
  disabledSubmit: boolean;
}

export interface ProductSubmissionData {
  product: FormProduct & {categoryId: number};
  productImages: {colorId: number; url: string}[];
  productUnits: UnitInput[];
}
