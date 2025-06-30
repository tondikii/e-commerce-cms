import type {FC} from "react";
import View from "./View";
import {api} from "@/lib/axios";
import {Color, Size} from "@/types";

const getSizes = async () => {
  try {
    const {data} = await api.get("size");
    return data;
  } catch (err) {
    console.log("ERR sizes", err);
    return [];
  }
};

const getColors = async () => {
  try {
    const {data} = await api.get("color");
    return data;
  } catch (err) {
    console.log("ERR colors", err);
    return [];
  }
};

interface Props {}

const page: FC<Props> = async () => {
  const sizes: Size[] = await getSizes();
  const colors: Color[] = await getColors();

  return (
    <View
      sizes={sizes.map(({name, id}) => ({label: name || "", value: id || 0}))}
      colors={colors.map(({name, id, hexCode}) => ({
        label: name,
        value: id,
        color: hexCode || "",
      }))}
    />
  );
};
export default page;
