"use client";
import {useParams} from "next/navigation";
import {type FC} from "react";
import {ColourOption, Product} from "@/types";
import useMasterData from "@/store/useMasterData";
import {PageHeader, ProductForm} from "@/components";

interface Props {
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
  product: Product | null;
}
const EditProductView: FC<Props> = ({sizes, colors, product}) => {
  const {category}: {category: string} = useParams();
  const {id: categoryId, name: categoryLabel}: {id: number; name: string} =
    useMasterData().categories.find((e) => e.route === category) || {
      id: 0,
      name: "",
    };
  return (
    <>
      <PageHeader title={`Edit Produk ${categoryLabel}`} />
      <ProductForm
        sizes={sizes}
        colors={colors}
        categoryId={categoryId}
        product={product}
      />
    </>
  );
};
export default EditProductView;
