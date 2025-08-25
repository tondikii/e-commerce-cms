"use client";
import {ChangeEvent, useEffect, useState, useRef, type FC} from "react";
import {StyledInput, StyledTextarea, Title} from "@/components";
import ImageUpload from "@/components/ImageUpload";
import {Stack} from "@mui/joy";
import {INITIAL_FORM_PRODUCT_DETAIL} from "@/constants";
import {ProductDetailType} from "@/types/product";

interface Props {
  initialData?: ProductDetailType;
  onChange?: (data: ProductDetailType, isCompleted: boolean) => void;
}

const ProductDetailForm: FC<Props> = ({initialData, onChange}) => {
  const [formProductDetail, setFormProductDetail] = useState<ProductDetailType>(
    initialData || INITIAL_FORM_PRODUCT_DETAIL
  );

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let {name, value}: {name: string; value: string | number} = e.target;

    if (name === "price" || name === "styleId") {
      value = Number(value);
    }

    setFormProductDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImages = (files: File[]) => {
    setFormProductDetail((prev) => ({
      ...prev,
      images: files,
    }));
  };

  useEffect(() => {
    if (onChange) {
      const isCompleted = Boolean(
        formProductDetail.name &&
          formProductDetail.description &&
          formProductDetail.images.length > 0
      );
      onChange(formProductDetail, isCompleted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formProductDetail]);

  return (
    <Stack spacing={2}>
      <Title>Detail Produk</Title>
      <Stack spacing={2}>
        <StyledInput
          label="Nama"
          value={formProductDetail.name}
          onChange={handleFormChange}
          name="name"
          required
          placeholder="Kaos Polo"
          maxLength={50}
          size="sm"
        />
        <StyledTextarea
          label="Deskripsi"
          value={formProductDetail.description}
          onChange={handleFormChange}
          name="description"
          required
          placeholder="Kaos polo dengan tampilan kasual formal"
          minRows={3}
          size="sm"
        />
        <ImageUpload
          initialFiles={formProductDetail.images}
          onChange={handleChangeImages}
        />
      </Stack>
    </Stack>
  );
};
export default ProductDetailForm;
