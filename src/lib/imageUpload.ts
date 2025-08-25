import {upload} from "@imagekit/next";
import {api} from "@/lib/axios";

interface AuthParams {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    const {data: authParams}: {data: AuthParams} = await api.get("upload-auth");

    const uploadResponse = await upload({
      ...authParams,
      file,
      fileName: `product_${Date.now()}_${file.name}`,
    });

    return uploadResponse.url || "";
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

export const uploadMultipleImages = async (
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToImageKit(file));
  return Promise.all(uploadPromises);
};
