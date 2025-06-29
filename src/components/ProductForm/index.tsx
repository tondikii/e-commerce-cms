import {ColourOption} from "@/types";
import {FC} from "react";
import {Form} from "./components";
import {ProductFormProps} from "./types";

const ProductForm: FC<ProductFormProps> = ({
  sizes,
  colors,
  categoryId,
  product,
}) => {
  return (
    <Form
      sizes={sizes}
      colors={colors}
      categoryId={categoryId}
      product={product}
    />
  );
};

export default ProductForm;
