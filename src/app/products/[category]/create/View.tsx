"use client";
import {useParams} from "next/navigation";
import {type FC} from "react";
import {ColourOption} from "@/types";
import useMasterData from "@/store/useMasterData";
import {ProductForm} from "@/components";

interface Props {
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
}
const CreateProductView: FC<Props> = ({sizes, colors}) => {
  const {category}: {category: string} = useParams();
  const {id: categoryId, name: categoryLabel}: {id: number; name: string} =
    useMasterData().categories.find((e) => e.route === category) || {
      id: 0,
      name: "",
    };
  return <ProductForm sizes={sizes} colors={colors} categoryId={categoryId} />;
};
export default CreateProductView;
