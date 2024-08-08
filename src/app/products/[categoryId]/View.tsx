"use client";

import {FC} from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import {OrderTable, OrderList} from "@/components";
import {AddRounded} from "@mui/icons-material";
import {useParams} from "next/navigation";
import {OBJECT_CATEGORIES} from "@/constant";

interface Props {}

// eslint-disable-next-line @next/next/no-async-client-component
const ProductsPageComponent: FC<Props> = async ({}) => {
  const {categoryId} = useParams();

  const categoryLabel: string = OBJECT_CATEGORIES[`${categoryId}`] || "";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: {xs: "column", sm: "row"},
          alignItems: {xs: "start", sm: "center"},
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Produk {categoryLabel}
        </Typography>
        <Button
          sx={{
            "&:hover": {
              backgroundColor: "#212b36",
            },
            bgcolor: "#212b36",
            fontWeight: 700,
          }}
          startDecorator={<AddRounded />}
          size="md"
        >
          Produk Baru
        </Button>
      </Box>
      <OrderTable />
      <OrderList />
    </>
  );
};

export default ProductsPageComponent;
