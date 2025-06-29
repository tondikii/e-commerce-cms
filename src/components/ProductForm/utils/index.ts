// utils/product-form.utils.ts

import {upload} from "@imagekit/next";
import {api} from "@/lib/axios";
import {AuthParams} from "../types";
import {FORM_LIMITS, API_ENDPOINTS} from "../constants";

/**
 * Generate product code based on size and color IDs
 */
export const generateProductCode = (
  sizeId: number,
  colorId: number
): string => {
  return `S${sizeId}/C${colorId}`;
};

/**
 * Get field character limit
 */
export const getFieldLimit = (fieldName: string): number => {
  return (
    FORM_LIMITS[fieldName as keyof typeof FORM_LIMITS] || FORM_LIMITS.default
  );
};

/**
 * Handle file upload to ImageKit
 */
export const handleFileUpload = async (file?: File | null): Promise<string> => {
  if (!file) return "";

  try {
    const {data: authParams}: {data: AuthParams} = await api.get(
      API_ENDPOINTS.UPLOAD_AUTH
    );

    const uploadResponse = await upload({
      ...authParams,
      file,
      fileName: file.name,
    });

    return uploadResponse?.url || "";
  } catch (error) {
    throw new Error("Failed to upload file");
  }
};

/**
 * Validate form field value and apply limits
 */
export const validateAndLimitField = (
  fieldName: string,
  value: string
): string | number => {
  const limit = getFieldLimit(fieldName);
  const truncatedValue = value.length <= limit ? value : value.slice(0, limit);

  return ["styleId", "price"].includes(fieldName)
    ? Number(truncatedValue)
    : truncatedValue;
};

/**
 * Create object URL and handle cleanup
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Clean up object URLs to prevent memory leaks
 */
export const cleanupPreviewUrls = (urls: string[]): void => {
  urls.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};

export const seperateNewAndExistingData = (
  data: {id?: number; productId?: number}[],
  productId: number
) => {
  const [newData, existingData] = data.reduce<
    [
      Array<{id?: number; productId: number}>,
      Array<{id: number; productId: number}>
    ]
  >(
    ([withoutIdArr, withIdArr], item) => {
      if (Boolean(item.id)) {
        withIdArr.push({...item, productId: productId} as {
          id: number;
          productId: number;
        }); // explicitly cast item
      } else {
        withoutIdArr.push({...item, productId: productId});
      }
      return [withoutIdArr, withIdArr];
    },
    [[], []]
  );

  return [newData, existingData];
};
