"use client";

import React, {FC} from "react";
import {Table} from "@/components";

interface Props {}

const CategoriesPage: FC<Props> = ({}) => {
  return <Table title="Kategori" entityName="categories" />;
};

export default CategoriesPage;
