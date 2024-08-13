"use client";

import React, {ChangeEvent, FC, useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import {ProductTable, StyledButton, StyledInput} from "@/components";
import {
  AddRounded,
  Search,
} from "@mui/icons-material";
import {useParams, useRouter} from "next/navigation";
import {ENDPOINT_PRODUCT, OBJECT_CATEGORIES_BY_ROUTE} from "@/constant";
import {useFetch} from "@/hooks";
import {FetchedProducts, FetchProductsParams} from "@/types";
import {useSearchParams, usePathname} from "next/navigation";
import {ListItemDecorator, Stack, Tab, TabList, Tabs} from "@mui/joy";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShirt, faUserTie, faGlasses} from "@fortawesome/free-solid-svg-icons";

interface Props {}
interface FilterType {
  name: string;
}

const tabs: {id: number; name: string; icon: React.ReactNode}[] = [
  {
    id: 1,
    name: "Casual",
    icon: <FontAwesomeIcon icon={faShirt} />,
  },
  {id: 2, name: "Formal", icon: <FontAwesomeIcon icon={faUserTie} />},
  {id: 3, name: "Party", icon: <FontAwesomeIcon icon={faGlasses} />},
];

const ProductsPage: FC<Props> = ({}) => {
  const {category}: {category:string}= useParams();
  const searchParams = useSearchParams();
  const urlSearchParams = searchParams.toString();
  const router = useRouter();
  const pathname: string = usePathname();
  const {id: categoryId, name: categoryLabel}: {id: number, name: string} = OBJECT_CATEGORIES_BY_ROUTE[category] || "";
  const searchParamsObject: FetchProductsParams = Object.fromEntries(
    searchParams.entries()
  );
  const styleId = Number(searchParamsObject.styleId || tabs[0].id);

  const fetchProductsParams = {...searchParamsObject, categoryId};
  if (fetchProductsParams?.page) {
    fetchProductsParams.offset =
      (fetchProductsParams.page - 1) * (fetchProductsParams?.limit || 5);
    delete fetchProductsParams.page;
  }

  const [filters, setFilters] = useState<FilterType>({
    name: searchParamsObject.name || "",
  });
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetchedProducts: FetchedProducts = useFetch(ENDPOINT_PRODUCT, {
    params: fetchProductsParams,
    refetch,
    setRefetch,
  });

  const setSearchParams = ({
    name,
    value,
    resetPagination,
  }: {
    name: string;
    value: string;
    resetPagination?: boolean;
  }) => {
    const params = new URLSearchParams(urlSearchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    if (name === "limit" || resetPagination) {
      params.delete("page");
      if (resetPagination) {
        params.delete("limit");
      }
    }

    router.push(pathname + "?" + params.toString());
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setFilters({...filters, name: value});
  };

  const handleChangeTab = (
    e: React.SyntheticEvent | null,
    value: number | string | null
  ) => {
    setSearchParams({name: "styleId", value: `${Number(value || 0) + 1}`});
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({name: "name", value: filters.name, resetPagination: true});
  };

  const handleCreateProduct = () => {
    router.push(`${category}/create`)
  }

  useEffect(() => {
    if (urlSearchParams && fetchedProducts.data) {
      setRefetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

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
        <StyledButton startDecorator={<AddRounded />} onClick={handleCreateProduct}>Produk Baru</StyledButton>
      </Box>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          py: 2,
          display: {xs: "none", sm: "flex"},
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {xs: "120px", md: "160px"},
          },
        }}
      >
        <form onSubmit={handleSubmitForm} className="w-full">
          <StyledInput
            name="name"
            label="Cari nama"
            placeholder="Cari"
            startDecorator={<Search />}
            size="sm"
            onChange={handleChangeSearch}
            value={filters?.name}
          />
        </form>
      </Box>
      <Stack spacing={2}>
        <Tabs
          aria-label="Icon tabs"
          value={tabs.findIndex((tab) => tab.id === styleId)}
          onChange={handleChangeTab}
        >
          <TabList
            sx={{
              justifyContent: "space-around",
            }}
          >
            {tabs.map(({id, name, icon}) => (
              <Tab
                sx={{
                  p: 1,
                  flexGrow: 1,
                  backgroundColor: "#f0f4f8",
                }}
                key={id}
              >
                <ListItemDecorator>{icon}</ListItemDecorator>
                {name}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Stack>
      <ProductTable
        {...{
          ...searchParamsObject,
          ...fetchedProducts,
          setSearchParams,
        }}
      />
    </>
  );
};

export default ProductsPage;
