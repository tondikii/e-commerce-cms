export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT =
  "Format email tidak sesuai";

export const MAX_VARCHAR_LENGTH = 255;

export const STATUS_AUTHENTICATED = "authenticated";

export const RESPONSE_STATUS_OK = 200;
export const RESPONSE_STATUS_CREATED = 201;
export const RESPONSE_STATUS_INTERNAL_SERVER_ERROR = 500;
export const RESPONSE_STATUS_BAD_REQUEST = 400;

export const CATEGORIES: {id: number; name: string}[] = [
  {id: 1, name: "T-shirts"},
  {id: 2, name: "Shorts"},
  {id: 3, name: "Shirts"},
  {id: 4, name: "Hoodie"},
  {id: 5, name: "Jeans"},
];

export const OBJECT_CATEGORIES: {[key: string]: string} = {
  1: "T-shirts",
  2: "Shorts",
  3: "Shirts",
  4: "Hoodie",
  5: "Jeans",
};

export const STYLES = [
  {id: 1, name: "Casual"},
  {id: 2, name: "Formal"},
  {id: 3, name: "Party"},
  {id: 4, name: "Gym"},
];
