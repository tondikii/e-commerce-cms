import {BreadCrumbData} from "@/types";
import {ProductDetailType, ProductOptionType} from "@/types/product";

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT =
  "Format email tidak sesuai";

export const STATUS_AUTHENTICATED = "authenticated";
export const DEFAULT_LIMIT = 5;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE = 1;

export const RESPONSE_STATUS_OK = 200;
export const RESPONSE_STATUS_CREATED = 201;
export const RESPONSE_STATUS_INTERNAL_SERVER_ERROR = 500;
export const RESPONSE_STATUS_BAD_REQUEST = 400;

export const BREAD_CRUMB_PATHNAMES: BreadCrumbData[] = [
  {name: "products", label: "Produk"},
  {name: "categories", label: "Kategori"},
  {name: "collections", label: "Koleksi"},
  {name: "create", label: "Buat"},
  {name: "detail", label: "Detail"},
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const INITIAL_FORM_PRODUCT_DETAIL: ProductDetailType = {
  name: "",
  description: "",
  images: [],
};

export const INITIAL_FORM_PRODUCT_OPTIONS: ProductOptionType[] = [
  {
    name: "",
    variants: [],
  },
];
