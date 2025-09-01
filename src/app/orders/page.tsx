"use client";

import React, {FC} from "react";
import {Table} from "@/components";

interface Props {}

const OrdersPage: FC<Props> = ({}) => {
  return <Table title="Pesanan" entityName="orders" />;
};

export default OrdersPage;
