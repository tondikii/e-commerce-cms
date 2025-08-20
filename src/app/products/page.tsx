"use client";

import React, {FC} from "react";

import {Table} from "@/components";

interface Props {}

const ProductsPage: FC<Props> = ({}) => {
  return <Table title="Produk" entityName="product" />;
};

export default ProductsPage;
