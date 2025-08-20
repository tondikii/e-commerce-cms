"use client";

import React, {FC} from "react";

import {Table} from "@/components";
import {useRouter} from "next/navigation";
import {useSearchParams} from "@/hooks";

interface Props {}

const ProductsPage: FC<Props> = ({}) => {
  const router = useRouter();
  const {setSearchParams, searchParams} = useSearchParams(router);

  const handleCreateProduct = () => {
    router.push("/create");
  };

  return <Table entityName="product" />;
};

export default ProductsPage;
