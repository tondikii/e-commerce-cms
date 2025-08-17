import View from "./View";
import {api} from "@/lib/axios";
import {Color, Product, Size} from "@/types";

interface Props {
  params: Promise<{id: string}>;
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
    if (!id) {
      return null;
    }
    const {data} = await api.get<Product>("product/detail", {params: {id}});
    return data;
  } catch (err) {
    return null;
  }
};

const Page = async ({params}: Props) => {
  const {id} = (await params) || {};
  const sizes = await getSizes();
  const colors = await getColors();
  const product = await getProduct(Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

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

export default Page;
