// src/app/products/[category]/[id]/edit/page.tsx

import type {FC} from "react";
import View from "./View";
import {api} from "@/lib/axios";
import {Color, Size} from "@/types";

// Fetch product data by ID
const getProductById = async (id: string) => {
  try {
    const {data} = await api.get(`/product/${id}`);
    return data;
  } catch (err) {
    return null;
  }
};

const getSizes = async () => {
  try {
    const {data} = await api.get("/size");
    return data;
  } catch (err) {
    return [];
  }
};

const getColors = async () => {
  try {
    const {data} = await api.get("/color");
    return data;
  } catch (err) {
    return [];
  }
};

interface Props {
  params: {
    id: string;
  };
}

const page: FC<Props> = async ({params}) => {
  const {id} = params;
  const product = await getProductById(id);
  const sizes: Size[] = await getSizes();
  const colors: Color[] = await getColors();

  // Render the edit form if product exists
  return product ? (
    <View
      initialProduct={{
        name: product.name,
        description: product.description,
        price: product.price,
        styleId: product.styleId,
        units: product.units.map((unit: any) => ({
          code: unit.code,
          quantity: unit.quantity,
          sizeId: unit.sizeId,
          colorId: unit.colorId,
        })),
        images: product.images.map((image: any) => ({
          colorId: image.colorId,
          file: null, // Assume we're not preloading images as files
        })),
      }}
      sizes={sizes.map(({name, id}) => ({label: name || "", value: id || 0}))}
      colors={colors.map(({name, id, hexCode}) => ({
        label: name,
        value: id,
        color: hexCode || "",
      }))}
    />
  ) : (
    <div>Product not found</div>
  );
};

export default page;
