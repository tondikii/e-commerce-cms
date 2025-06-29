// hooks/useProductFormValidation.ts

import {useMemo} from "react";
import {ColourOption} from "@/types";
import {
  FormProduct,
  UnitInput,
  ImageInput,
  UnitValidation,
  FormValidation,
} from "../types";

/**
 * Custom hook for product form validation
 */
const useProductFormValidation = (
  formProduct: FormProduct,
  units: UnitInput[],
  imagesFile: ImageInput[],
  colors: ColourOption[]
): FormValidation => {
  const isCompletedProduct = useMemo(
    () => Object.values(formProduct).every(Boolean),
    [formProduct]
  );

  const unitValidation = useMemo((): UnitValidation => {
    const tempColors: {colorId: number; label: string}[] = [];
    const codes: string[] = [];
    const dupIndexes: number[][] = [];
    let complete = true;

    units.forEach((unit, idx) => {
      // Check if unit is complete
      if (!unit.quantity || !unit.sizeId || !unit.colorId) {
        complete = false;
      }

      // Collect unique colors
      const isNewColor = !tempColors.find((c) => c.colorId === unit.colorId);
      if (isNewColor && unit.colorId) {
        const colorOption = colors.find((c) => c.value === unit.colorId);
        if (colorOption) {
          tempColors.push({
            colorId: colorOption.value,
            label: colorOption.label,
          });
        }
      }

      // Check for duplicate codes
      const duplicateIndex = codes.findIndex((code) => code === unit.code);
      if (duplicateIndex >= 0) {
        dupIndexes.push([duplicateIndex, idx]);
        complete = false;
      }

      // Check if image exists for this color
      if (!imagesFile.find((img) => img.colorId === unit.colorId)) {
        complete = false;
      }

      if (unit?.code) {
        codes.push(unit?.code);
      }
    });

    return {
      isCompletedUnits: complete,
      unitColors: tempColors,
      duplicatedCodesIndex: dupIndexes,
    };
  }, [units, imagesFile, colors]);

  const isCompletedImages = useMemo(
    () =>
      unitValidation.unitColors.every(({colorId}) =>
        imagesFile.some(
          (img) => img.colorId === colorId && (img.previewUrl || img.url)
        )
      ),
    [imagesFile, unitValidation.unitColors]
  );

  const disabledSubmit = useMemo(
    () =>
      !isCompletedProduct ||
      !unitValidation.isCompletedUnits ||
      !isCompletedImages,
    [isCompletedProduct, unitValidation.isCompletedUnits, isCompletedImages]
  );

  return {
    isCompletedProduct,
    unitValidation,
    isCompletedImages,
    disabledSubmit,
  };
};

export default useProductFormValidation;
