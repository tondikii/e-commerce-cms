"use client";

import React, {FC} from "react";

import {PageHeader, StyledButton, Table} from "@/components";
import {AddRounded} from "@mui/icons-material";
import {useParams, useRouter} from "next/navigation";
import {useSearchParams} from "@/hooks";
import {FetchProductsParams} from "@/types";
import {ListItemDecorator, Stack, Tab, TabList, Tabs} from "@mui/joy";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShirt, faUserTie, faGlasses} from "@fortawesome/free-solid-svg-icons";
import useMasterData from "@/store/useMasterData";

interface Props {}

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
  const {category}: {category: string} = useParams();
  const router = useRouter();
  const {setSearchParams, searchParams} = useSearchParams(router);
  const categories = useMasterData().categories;
  const {id: categoryId, name: categoryLabel}: {id: number; name: string} =
    categories.find((e) => e.route === category) || {
      id: 0,
      name: "",
    };
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

  const handleChangeTab = (
    e: React.SyntheticEvent | null,
    value: number | string | null
  ) => {
    setSearchParams({name: "styleId", value: `${Number(value || 0) + 1}`});
  };

  const handleCreateProduct = () => {
    router.push(`${categoryId}/create`);
  };

  return (
    <>
      <PageHeader
        title={`Produk ${categoryLabel}`}
        rightComponent={
          <StyledButton
            startDecorator={<AddRounded />}
            onClick={handleCreateProduct}
          >
            Produk Baru
          </StyledButton>
        }
      />

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

      <Table
        entityName="product"
        prevent={!categoryId}
        extraParams={{categoryId}}
      />
    </>
  );
};

export default ProductsPage;
