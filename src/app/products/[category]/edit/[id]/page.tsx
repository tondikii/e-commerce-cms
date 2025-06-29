import type {FC} from "react";
import View from "./View";
import {api} from "@/lib/axios";
import {Color, Product, Size} from "@/types";

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

const getProduct = async (id: number) => {
  try {
    const {data} = await api.get("/product/detail", {params: {id}});
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
  const sizes: Size[] = await getSizes();
  const colors: Color[] = await getColors();

  const product: Product = await getProduct(Number(params.id));

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
