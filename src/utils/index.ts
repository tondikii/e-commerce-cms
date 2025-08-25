import {REGEX_EMAIL} from "@/constants";
import {api} from "@/lib/axios";
import {AuthParamsImageKit} from "@/types";
import {upload} from "@imagekit/next";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const handleFileUpload = async (file?: File | null): Promise<string> => {
  if (!file) return "";

  try {
    const {data: authParams}: {data: AuthParamsImageKit} = await api.get(
      "upload-auth"
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
