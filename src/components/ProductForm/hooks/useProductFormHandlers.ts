// hooks/useProductFormHandlers.ts

import {useCallback, FormEvent, ChangeEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";
import {api} from "@/lib/axios";
import {Option as SelectOption} from "@/components/Select";
import {
  FormProduct,
  UnitInput,
  ImageInput,
  ProductSubmissionData,
} from "../types";
import {
  handleFileUpload,
  generateProductCode,
  createPreviewUrl,
  seperateNewAndExistingData,
} from "../utils";
import {INITIAL_UNIT, MESSAGES, API_ENDPOINTS} from "../constants";
import {Product} from "@/types";

interface UseProductFormHandlersProps {
  formProduct: FormProduct;
  setFormProduct: React.Dispatch<React.SetStateAction<FormProduct>>;
  units: UnitInput[];
  setUnits: React.Dispatch<React.SetStateAction<UnitInput[]>>;
  imagesFile: ImageInput[];
  setImagesFile: React.Dispatch<React.SetStateAction<ImageInput[]>>;
  categoryId: number;
  mode: "create" | "edit";
  uploadingPhotoColorId: number;
  setUploadingPhotoColorId: React.Dispatch<React.SetStateAction<number>>;
  fileInputRef: any;
  product?: Product | null;
}

const useProductFormHandlers = ({
  formProduct,
  setFormProduct,
  units,
  setUnits,
  imagesFile,
  setImagesFile,
  categoryId,
  mode,
  uploadingPhotoColorId,
  setUploadingPhotoColorId,
  fileInputRef,
  product,
}: UseProductFormHandlersProps) => {
  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Form field change handler
  const handleFormChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let {name, value}: {name: string; value: string | number} = e.target;

      if (name === "price" || name === "styleId") {
        value = Number(value);
      }

      setFormProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormProduct]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        setLoadingSubmit(true);
        // Upload all images
        const uploadedImages = await Promise.all(
          imagesFile.map(async (image) => ({
            colorId: image.colorId,
            url: image?.url || (await handleFileUpload(image.file)),
            ...(image?.id ? {id: image.id} : {}),
          }))
        );

        const removedCodeUnits = units.map((e) => {
          const newUnit = {...e}; // avoid mutating original object
          delete newUnit.code; // remove the 'age' field
          return newUnit;
        });

        let successMessage = "";

        if (mode === "create") {
          const submissionData: ProductSubmissionData = {
            product: {
              ...formProduct,
              categoryId,
              price: Number(formProduct.price),
            },
            productImages: uploadedImages,
            productUnits: removedCodeUnits,
          };
          const {data} = await (
            api.post as (url: string, payload: any) => Promise<any>
          )(API_ENDPOINTS.PRODUCT, submissionData);

          successMessage = MESSAGES.SUCCESS.CREATE(data?.name || "");
        } else {
          const arrPromise = [];

          const [newDataImages, existingDataImages] =
            seperateNewAndExistingData(uploadedImages, formProduct.id || 0);

          if (newDataImages?.length > 0) {
            arrPromise.push(await api.post("product-image", newDataImages));
          }

          if (existingDataImages?.length > 0) {
            arrPromise.push(await api.put("product-image", existingDataImages));
          }

          const deletedDataImages = product?.productImages?.filter((e) => {
            const isRemoved = !Boolean(
              existingDataImages.find((el) => e.id === el.id)
            );
            return isRemoved;
          });

          if (deletedDataImages && deletedDataImages?.length > 0) {
            arrPromise.push(
              await api.delete("product-image", {
                data: {ids: deletedDataImages.map((e) => e.id)},
              })
            );
          }

          const [newDataUnits, existingDataUnits] = seperateNewAndExistingData(
            removedCodeUnits,
            formProduct.id || 0
          );

          if (newDataUnits?.length > 0) {
            arrPromise.push(await api.post("product-unit", newDataUnits));
          }

          if (existingDataUnits?.length > 0) {
            arrPromise.push(await api.put("product-unit", existingDataUnits));
          }

          const deletedDataUnits = product?.productUnits?.filter((e) => {
            const isRemoved = !Boolean(
              existingDataUnits.find((el) => e.id === el.id)
            );
            return isRemoved;
          });

          if (deletedDataUnits && deletedDataUnits?.length > 0) {
            arrPromise.push(
              await api.delete("product-unit", {
                data: {ids: deletedDataUnits.map((e) => e.id)},
              })
            );
          }

          await Promise.all(arrPromise);

          const {data} = await (
            api.put as (url: string, payload: any) => Promise<any>
          )(`${API_ENDPOINTS.PRODUCT}?id=${formProduct?.id}`, {
            ...formProduct,
            categoryId,
            price: Number(formProduct.price),
          });

          successMessage = MESSAGES.SUCCESS.UPDATE(data?.name || "");
        }

        setLoadingSubmit(false);

        await Swal.fire({
          title: MESSAGES.SUCCESS.TITLE,
          text: successMessage,
          icon: "success",
        });

        router.back();
      } catch (error) {
        setLoadingSubmit(false);

        const errorMessage =
          mode === "create" ? MESSAGES.ERROR.CREATE : MESSAGES.ERROR.UPDATE;

        Swal.fire({
          title: MESSAGES.ERROR.TITLE,
          text: errorMessage,
          icon: "error",
        });
      }
    },
    [formProduct, categoryId, imagesFile, units, mode, router, product]
  );

  // Unit management handlers
  const updateUnit = useCallback(
    (index: number, field: keyof UnitInput, value: number) => {
      setUnits((prevUnits) => {
        const updatedUnits = [...prevUnits];
        const unit = {...updatedUnits[index]};

        unit[field] = value as never;

        // Update code when size or color changes
        if (field === "sizeId" || field === "colorId") {
          const sizeId = field === "sizeId" ? value : unit.sizeId;
          const colorId = field === "colorId" ? value : unit.colorId;
          unit.code = generateProductCode(sizeId, colorId);
        }

        updatedUnits[index] = unit;
        return updatedUnits;
      });
    },
    [setUnits]
  );

  const handleAddUnit = useCallback(() => {
    setUnits((prev) => [...prev, {...INITIAL_UNIT}]);
  }, [setUnits]);

  const handleDeleteUnit = useCallback(
    (index: number) => {
      setUnits((prev) => prev.filter((_, i) => i !== index));
    },
    [setUnits]
  );

  useEffect(() => {
    if (imagesFile.length > 0) {
      const newImagesFile = imagesFile.filter((e) => {
        const isFoundUnit = Boolean(
          units.find((unit) => unit.colorId === e.colorId)
        );
        return isFoundUnit;
      });

      setImagesFile(newImagesFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const handleUnitInputChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      updateUnit(
        index,
        e.target.name as keyof UnitInput,
        Number(e.target.value)
      );
    },
    [updateUnit]
  );

  const handleUnitSelectChange = useCallback(
    (index: number, option: SelectOption, fieldName: string) => {
      updateUnit(index, fieldName as keyof UnitInput, Number(option.value));
    },
    [updateUnit]
  );

  // Image management handlers
  const handleUploadPhotoClick = useCallback(
    (colorId: number) => {
      setUploadingPhotoColorId(colorId);
      fileInputRef.current?.click();
    },
    [setUploadingPhotoColorId, fileInputRef]
  );

  const handlePhotoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = createPreviewUrl(file);
        setImagesFile((prev) => [
          ...prev,
          {colorId: uploadingPhotoColorId, file, previewUrl},
        ]);

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [uploadingPhotoColorId, setImagesFile, fileInputRef]
  );

  return {
    handleFormChange,
    handleSubmit,
    handleAddUnit,
    handleDeleteUnit,
    handleUnitInputChange,
    handleUnitSelectChange,
    handleUploadPhotoClick,
    handlePhotoChange,
    loadingSubmit,
  };
};

export default useProductFormHandlers;
