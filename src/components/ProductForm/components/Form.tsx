// components/FormComponent.tsx

"use client";

import {useEffect, useRef, useState, type FC} from "react";
import {AddRounded} from "@mui/icons-material";
import {Box, Sheet, Stack, Typography} from "@mui/joy";
import {
  NumericFormatInput,
  RadioGroupStyles,
  StyledButton,
  StyledInput,
  StyledSubmitButton,
  StyledTextarea,
} from "@/components";
import {ProductFormProps, FormProduct, UnitInput, ImageInput} from "../types";
import {INITIAL_FORM_PRODUCT, INITIAL_UNIT} from "../constants";
import {useProductFormValidation, useProductFormHandlers} from "../hooks";
import {UnitItem, ImageUploadSection} from ".";

const FormComponent: FC<ProductFormProps> = ({
  sizes,
  colors,
  categoryId,
  product,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mode = product ? "edit" : "create";

  // State management
  const [formProduct, setFormProduct] = useState<FormProduct>(
    product
      ? {
          id: product.id,
          styleId: product.styleId,
          name: product.name,
          description: product.description,
          price: product.price?.toString(),
        }
      : INITIAL_FORM_PRODUCT
  );

  const fetchedProductUnits: UnitInput[] =
    product && product.productUnits?.length
      ? product.productUnits.map((e) => ({
          quantity: e.quantity || 0,
          code: `S${e.sizeId}/C${e.colorId}`,
          sizeId: e.sizeId || 0,
          colorId: e.colorId || 0,
          id: e?.id,
        }))
      : [{...INITIAL_UNIT}];

  const fetchedProductImages: ImageInput[] =
    product && product.productImages?.length ? product.productImages : [];

  const [units, setUnits] = useState<UnitInput[]>(fetchedProductUnits);
  const [imagesFile, setImagesFile] =
    useState<ImageInput[]>(fetchedProductImages);
  const [uploadingPhotoColorId, setUploadingPhotoColorId] = useState<number>(0);

  // Custom hooks
  const {unitValidation, disabledSubmit} = useProductFormValidation(
    formProduct,
    units,
    imagesFile,
    colors
  );

  const {
    handleFormChange,
    handleSubmit,
    handleAddUnit,
    handleDeleteUnit,
    handleUnitInputChange,
    handleUnitSelectChange,
    handleUploadPhotoClick,
    handlePhotoChange,
    loadingSubmit,
  } = useProductFormHandlers({
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
  });

  // Cleanup unused images when unit colors change
  useEffect(() => {
    const activeColorIds = unitValidation.unitColors.map((uc) => uc.colorId);
    const filteredImages = imagesFile.filter((img) =>
      activeColorIds.includes(img.colorId)
    );

    if (filteredImages.length !== imagesFile.length) {
      setImagesFile(filteredImages);
    }
  }, [unitValidation.unitColors, imagesFile, setImagesFile]);

  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: {xs: "95%", md: "60%"},
        maxWidth: "800px",
        borderRadius: "lg",
        p: {xs: 2, md: 4},
        boxShadow: "lg",
        backgroundColor: "background.surface",
        alignSelf: "center",
        mx: "auto",
      }}
    >
      <form onSubmit={handleSubmit} style={{width: "100%"}}>
        <Stack spacing={4}>
          {/* Product Style Selection */}
          <Box>
            <Typography level="title-md" mb={2}>
              Style Produk <span className="text-danger">*</span>
            </Typography>
            <RadioGroupStyles
              onChange={handleFormChange}
              value={formProduct.styleId}
            />
          </Box>

          {/* Basic Product Information */}
          <Box>
            <Stack spacing={2}>
              <StyledInput
                label="Nama Produk"
                value={formProduct.name}
                onChange={handleFormChange}
                name="name"
                required
                placeholder="Masukkan nama produk"
              />
              <StyledTextarea
                label="Deskripsi"
                value={formProduct.description}
                onChange={handleFormChange}
                name="description"
                required
                placeholder="Masukkan deskripsi produk"
                minRows={3}
              />
              <NumericFormatInput
                label="Harga"
                value={`${formProduct.price}`}
                onChange={handleFormChange}
                name="price"
                required
                placeholder="0"
              />
            </Stack>
          </Box>

          {/* Product Units Section */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography level="title-md">Varian Produk</Typography>
              <StyledButton
                startDecorator={<AddRounded />}
                onClick={handleAddUnit}
                size="sm"
                variant="soft"
              >
                Tambah Varian
              </StyledButton>
            </Stack>

            <Stack spacing={2}>
              {units.map((unit, index) => (
                <UnitItem
                  key={index}
                  unit={unit}
                  index={index}
                  sizes={sizes}
                  colors={colors}
                  isDuplicate={unitValidation.duplicatedCodesIndex.some(
                    (pair) => pair.includes(index)
                  )}
                  canDelete={units.length > 1}
                  onInputChange={handleUnitInputChange}
                  onSelectChange={handleUnitSelectChange}
                  onDelete={handleDeleteUnit}
                />
              ))}
            </Stack>
          </Box>

          {unitValidation.unitColors.length > 0 && (
            <Box>
              <Typography level="title-md" mb={2}>
                Foto Produk
              </Typography>
              <Stack spacing={3}>
                {unitValidation.unitColors.map(({colorId, label}, idx) => (
                  <ImageUploadSection
                    colorId={colorId}
                    label={label}
                    images={imagesFile}
                    onUploadClick={handleUploadPhotoClick}
                    key={idx + 1}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{display: "none"}}
          />

          <StyledSubmitButton
            type="submit"
            disabled={disabledSubmit}
            loading={loadingSubmit}
            size="lg"
          >
            {mode === "create" ? "Buat Produk" : "Update Produk"}
          </StyledSubmitButton>
        </Stack>
      </form>
    </Sheet>
  );
};

export default FormComponent;
