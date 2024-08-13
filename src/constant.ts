export const BASE_URL_API_LOCAL = "/api";
export const ENDPOINT_PRODUCT = "/product";

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT =
  "Format email tidak sesuai";

export const MAX_VARCHAR_LENGTH = 255;

export const STATUS_AUTHENTICATED = "authenticated";
export const DEFAULT_LIMIT = 5;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE = 1;
export const DEFAULT_STYLE_ID = 1;
export const DEFAULT_CATEGORY_ID = 1;

export const RESPONSE_STATUS_OK = 200;
export const RESPONSE_STATUS_CREATED = 201;
export const RESPONSE_STATUS_INTERNAL_SERVER_ERROR = 500;
export const RESPONSE_STATUS_BAD_REQUEST = 400;

export const CATEGORIES: {id: number; name: string, route: string}[] = [
  {id: 1, name: "Top", route: "top", },
  {id: 2, name: "Bottom", route: "bottom"},
];

export const OBJECT_CATEGORIES_BY_ROUTE: {[key: string]: {id: number, name: string}} = {
  top: {id: 1, name: "Top"},
  bottom: {id: 2, name: "Bottom"},
};

export const STYLES = [
  {
    name: "Casual",
  },
  {
    name: "Formal",
  },
  {
    name: "Party",
  },
];
