"use client";

import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {
  Box,
  Chip,
  FormControl,
  FormLabel,
  Select,
  Option,
  Table,
  Sheet,
  IconButton,
  Typography,
} from "@mui/joy";

import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Search,
} from "@mui/icons-material";
import Image from "next/image";
import {format} from "date-fns";
import {FetchedProducts, FetchProductsParams, Products} from "@/types";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "@/constant";
import {ScaleLoader} from "react-spinners";
import {RowMenu} from "./components";
import {useRouter} from "next/navigation";
import {useFetch, useSearchParams} from "@/hooks";
import StyledInput from "../StyledInput";

interface FilterType {
  name: string;
}

interface TableComponentProps {
  entityName: string;
  prevent: boolean;
  extraParams?: Object;
}

const TableComponent: React.FC<TableComponentProps> = ({
  entityName,
  prevent,
  extraParams = {},
}) => {
  const router = useRouter();
  const {searchParams, setSearchParams, urlSearchParams} =
    useSearchParams(router);

  const searchParamsObject: FetchProductsParams = Object.fromEntries(
    searchParams.entries()
  );

  const fetchProductsParams = {...searchParamsObject, ...extraParams};
  if (fetchProductsParams?.page) {
    fetchProductsParams.offset =
      (fetchProductsParams.page - 1) * (fetchProductsParams?.limit || 5);
    delete fetchProductsParams.page;
  }

  const [filters, setFilters] = useState<FilterType>({
    name: searchParamsObject.name || "",
  });
  const [refetch, setRefetch] = useState<boolean>(false);

  const refetchData = () => {
    setRefetch(true);
  };

  const fetchedProducts: FetchedProducts = useFetch(`/${entityName}`, {
    params: fetchProductsParams,
    refetch,
    setRefetch,
    prevent,
  });

  const data = fetchedProducts.data;
  const loading = fetchedProducts.loading;
  const usedData: Products = Array.isArray(data?.data) ? data?.data : [];
  const totalRecords = data?.totalRecords || 0;

  const page = Number(searchParamsObject.page) || DEFAULT_PAGE;
  const limit = Number(searchParamsObject.limit) || DEFAULT_LIMIT;

  const isFirstPage = page === 1;
  const isLastPage = page >= Math.ceil(totalRecords / limit);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setFilters({...filters, name: value});
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({name: "name", value: filters.name, resetPagination: true});
  };

  const handleChangeRowsPerPage = async (
    event: any,
    newValue: number | null
  ) => {
    setSearchParams({
      name: "limit",
      value: parseInt(newValue!.toString(), 10).toString(),
    });
  };

  const getLabelDisplayedRows = (from: number, totalRecords: number) => {
    const to = usedData.length * page;
    return `${from}–${to} of ${totalRecords}`;
  };

  const handleChangePage = (newPage: number) => {
    setSearchParams({name: "page", value: newPage.toString()});
  };

  const renderContent = () => {
    if (usedData.length > 0) {
      return usedData.map((row, idx) => {
        const productUnits = row?.productUnits || [];
        const thumbnail = row?.productImages?.[0]?.url;
        const totalQuantity = productUnits.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        return (
          <tr key={idx + 1}>
            <td style={{textAlign: "center", width: 120}}>
              <Typography level="body-xs">{row.id}</Typography>
            </td>
            <td>
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={row.name}
                  width={105}
                  height={105}
                />
              ) : null}
            </td>
            <td>
              <Typography level="body-xs">{row.name}</Typography>
            </td>
            <td>
              <Typography level="body-xs">
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                  }}
                >
                  {productUnits.map(({size}) => (
                    <Chip key={size.code}>{size.code}</Chip>
                  ))}
                </Box>
              </Typography>
            </td>
            <td>
              <Typography level="body-xs">{totalQuantity}</Typography>
            </td>
            <td>
              <Typography level="body-xs">
                {format(new Date(row.updatedAt), "yyyy-MM-dd HH:mm")}
              </Typography>
            </td>
            <td>
              <Typography level="body-xs">
                {format(new Date(row.createdAt), "yyyy-MM-dd")}
              </Typography>
            </td>
            <td>
              <RowMenu
                product={row}
                entityName={entityName}
                router={router}
                refetch={refetchData}
              />
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ScaleLoader
                color="#212b36"
                height={52.5}
                width={6}
                radius={3}
                margin={3}
              />
            ) : (
              <Typography>Data tidak ditemukan.</Typography>
            )}
          </Box>
        </td>
      </tr>
    );
  };

  useEffect(() => {
    if (urlSearchParams && data) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

  return (
    <>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          py: 1,
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
            placeholder="Cari nama"
            startDecorator={<Search />}
            size="sm"
            onChange={handleChangeSearch}
            value={filters?.name}
          />
        </form>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {xs: "none", sm: "initial"},
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
          marginBottom: "2rem",
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          stickyFooter
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{width: 50, textAlign: "center", padding: "12px 6px"}}>
                Id
              </th>
              <th style={{width: 100, padding: "12px 6px"}}>Foto</th>
              <th style={{width: 200, padding: "12px 6px"}}>Nama</th>
              <th style={{width: 150, padding: "12px 6px"}}>Ukuran</th>
              <th style={{width: 50, padding: "12px 6px"}}>Stok</th>
              <th style={{width: 100, padding: "12px 6px"}}>Diperbarui</th>
              <th style={{width: 100, padding: "12px 6px"}}>Dibuat</th>
              <th style={{width: 80, padding: "12px 6px"}}> </th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
          <tfoot>
            <tr>
              <td colSpan={8}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "flex-end",
                  }}
                  className="Pagination-laptopUp"
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Baris per halaman:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={limit}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={20}>20</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{minWidth: 80}}>
                    {getLabelDisplayedRows(
                      usedData.length === 0 ? 0 : (page - 1) * limit + 1,
                      totalRecords
                    )}
                  </Typography>
                  <Box sx={{display: "flex", gap: 1}}>
                    {!isFirstPage ? (
                      <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        onClick={() => handleChangePage(page - 1)}
                        sx={{bgcolor: "background.surface"}}
                      >
                        <KeyboardArrowLeft />
                      </IconButton>
                    ) : null}
                    {!isLastPage ? (
                      <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        onClick={() => handleChangePage(page + 1)}
                        sx={{bgcolor: "background.surface"}}
                      >
                        <KeyboardArrowRight />
                      </IconButton>
                    ) : null}
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </>
  );
};

export default TableComponent;
