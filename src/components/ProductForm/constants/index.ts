// constants/product-form.constants.ts

import {UnitInput, FormProduct} from "../types";
import {MAX_VARCHAR_LENGTH} from "@/constants";

export const INITIAL_UNIT: UnitInput = {
  quantity: 0,
  code: "S/C",
  sizeId: 0,
  colorId: 0,
};

export const INITIAL_FORM_PRODUCT: FormProduct = {
  styleId: 0,
  name: "",
  description: "",
  price: "",
};

export const FORM_LIMITS = {
  name: 50,
  default: MAX_VARCHAR_LENGTH,
} as const;

export const MESSAGES = {
  SUCCESS: {
    TITLE: "Berhasil",
    CREATE: (name: string) => `Produk ${name} berhasil dibuat`,
    UPDATE: (name: string) => `Produk ${name} berhasil diperbarui`,
  },
  ERROR: {
    TITLE: "Gagal",
    CREATE: "Terjadi kesalahan saat membuat produk",
    UPDATE: "Terjadi kesalahan saat memperbarui produk",
    UPLOAD: "Gagal mengunggah file",
  },
  VALIDATION: {
    DUPLICATE_CODE: "(terduplikasi)",
    UPLOAD_PHOTO: "Unggah foto",
  },
} as const;

export const API_ENDPOINTS = {
  UPLOAD_AUTH: "/upload-auth",
  PRODUCT: "/product",
} as const;
