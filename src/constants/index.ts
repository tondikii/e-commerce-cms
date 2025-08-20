import {BreadCrumbData} from "@/types";

export const ENDPOINT_PRODUCT = "product";
export const ENDPOINT_CATEGORY = "category";

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
  {name: "category", label: "collection"},
  {name: "category", label: "Koleksi"},
  {name: "create", label: "Buat"},
  {name: "detail", label: "Detail"},
];
