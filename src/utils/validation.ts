import {ProductBasicType, ProductOptionType} from "@/types";

// src/utils/validation.ts
export const validateProductBasic = (data: ProductBasicType): boolean => {
  return Boolean(
    data.name?.trim() && data.description?.trim() && data.images.length > 0
  );
};

export const validateProductOptions = (
  options: ProductOptionType[]
): boolean => {
  if (options.length === 0) return false;

  return options.every(
    (option) => option.name.trim() && option.variants.length > 0
  );
};
