import type {FC} from "react";
import View from "./View";
import {api} from "@/lib/axios";
import {Color, Product, Size} from "@/types";

interface Props {
  params: {
    id: string;
    category: string;
  };
}

const getSizes = async (): Promise<Size[]> => {
  try {
    const {data} = await api.get<Size[]>("size");
    return data;
  } catch (err) {
    return [];
  }
};

const getColors = async (): Promise<Color[]> => {
  try {
    const {data} = await api.get<Color[]>("color");
    return data;
  } catch (err) {
    return [];
  }
};

const getProduct = async (id: number): Promise<Product | null> => {
  try {
    const {data} = await api.get<Product>("product/detail", {params: {id}});
    return data;
  } catch (err) {
    return null;
  }
};

const page: FC<Props> = async ({params}) => {
  const paramsId: number = Number(params?.id) || 0;
  const sizes: Size[] = await getSizes();
  const colors: Color[] = await getColors();

  const product: Product | null = await getProduct(paramsId);

  return (
    <View
      sizes={sizes.map(({name, id}) => ({label: name || "", value: id || 0}))}
      colors={colors.map(({name, id, hexCode}) => ({
        label: name,
        value: id,
        color: hexCode || "",
      }))}
      product={product}
    />
  );
};
export default page;
