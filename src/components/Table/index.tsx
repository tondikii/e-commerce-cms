// src/components/Table/index.tsx
"use client";

import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Option,
  Table as JoyTable,
  Sheet,
  IconButton,
  Typography,
} from "@mui/joy";

import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Search,
  AddRounded,
} from "@mui/icons-material";
import Image from "next/image";
import {format} from "date-fns";
import {Product, Category, FetchedData, FetchedDataParams} from "@/types";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "@/constants";
import {ScaleLoader} from "react-spinners";
import RowMenu from "./components/RowMenu";
import {usePathname, useRouter} from "next/navigation";
import {useDebounce, useFetch, useSearchParams} from "@/hooks";
import StyledInput from "../StyledInput";
import {ModalCreate, StyledButton} from "..";

interface FilterType {
  search: string;
}

interface TableComponentProps {
  entityName: string;
  prevent?: boolean;
  extraParams?: Object;
  title: string;
}

const TableComponent: React.FC<TableComponentProps> = ({
  entityName,
  extraParams = {},
  title,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {searchParams, setSearchParams, urlSearchParams} =
    useSearchParams(router);

  const [modalOpen, setModalOpen] = useState(false); // State untuk modal

  const searchParamsObject: FetchedDataParams = Object.fromEntries(
    searchParams.entries()
  );

  const fetchParams = {...searchParamsObject, ...extraParams};

  const [filters, setFilters] = useState<FilterType>({
    search: searchParamsObject.search || "",
  });
  const [refetch, setRefetch] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce<string>(filters.search, 1000);

  const refetchData = () => {
    setRefetch(true);
  };

  const fetchedData: FetchedData = useFetch(pathname, {
    params: fetchParams,
    refetch,
    setRefetch,
    prevent: true,
  });

  const data = fetchedData.data;
  const loading = fetchedData.loading;
  const usedData: any[] = Array.isArray(data?.data) ? data?.data : [];
  const totalRecords = data?.totalRecords || 0;

  const page = Number(searchParamsObject.page) || DEFAULT_PAGE;
  const limit = Number(searchParamsObject.limit) || DEFAULT_LIMIT;

  const isFirstPage = page === 1;
  const isLastPage = page >= Math.ceil(totalRecords / limit);

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setFilters({...filters, search: value});
  };

  const handleSearchName = () => {
    if (filters.search.trim() === "") {
      setSearchParams({
        name: "search",
        value: "",
        resetPagination: true,
      });
    } else {
      setSearchParams({
        name: "search",
        value: filters.search,
        resetPagination: true,
      });
    }
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchName();
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
    const to = Math.min(page * limit, totalRecords);
    return `${from}–${to} of ${totalRecords}`;
  };

  const handleChangePage = (newPage: number) => {
    setSearchParams({name: "page", value: newPage.toString()});
  };

  const handleCreate = () => {
    if (entityName === "products") {
      router.push(`${pathname}/create`); // Redirect untuk produk
    } else {
      setModalOpen(true); // Buka modal create
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    refetchData(); // Refresh data setelah berhasil create
  };

  const renderProductContent = () => {
    return usedData.map((row: Product, idx) => {
      const variants = row.variants || [];
      const thumbnail = row.images?.[0]?.url;
      const totalQuantity = variants.reduce(
        (acc, variant) => acc + (variant.stock || 0),
        0
      );
      return (
        <tr key={idx + 1}>
          <td>
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={row.name}
                width={105}
                height={105}
                style={{objectFit: "cover"}}
              />
            ) : null}
          </td>
          <td>
            <Typography level="body-xs">{row.name}</Typography>
          </td>
          <td>
            <Typography level="body-xs">{variants.length} Varian</Typography>
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
              pathname={pathname}
              data={row}
              entityName={entityName}
              router={router}
              refetch={refetchData}
            />
          </td>
        </tr>
      );
    });
  };

  const renderContent = () => {
    if (usedData.length > 0) {
      if (entityName === "products") {
        return renderProductContent();
      } else {
        return usedData.map((row: Category, idx) => {
          const productCount = row.products?.length || 0;
          return (
            <tr key={idx + 1}>
              <td>
                <Typography level="body-xs">{row.name}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{productCount} Produk</Typography>
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
                  pathname={pathname}
                  data={row}
                  entityName={entityName}
                  router={router}
                  refetch={refetchData}
                />
              </td>
            </tr>
          );
        });
      }
    }
    return (
      <tr>
        <td colSpan={entityName === "products" ? 7 : 5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            {loading ? (
              <ScaleLoader
                color="#212b36"
                height={35}
                width={4}
                radius={2}
                margin={2}
              />
            ) : (
              <Typography>Data tidak ditemukan.</Typography>
            )}
          </Box>
        </td>
      </tr>
    );
  };

  const getTableHeaders = () => {
    if (entityName === "products") {
      return (
        <thead>
          <tr>
            <th style={{width: 100, padding: "0.5rem"}}>Foto</th>
            <th style={{width: 200, padding: "0.5rem"}}>Nama</th>
            <th style={{width: 150, padding: "0.5rem"}}>Jumlah Varian</th>
            <th style={{width: 50, padding: "0.5rem"}}>Stok</th>
            <th style={{width: 100, padding: "0.5rem"}}>Diperbarui</th>
            <th style={{width: 100, padding: "0.5rem"}}>Dibuat</th>
            <th style={{width: 80, padding: "0.5rem"}}> </th>
          </tr>
        </thead>
      );
    } else {
      return (
        <thead>
          <tr>
            <th style={{width: 200, padding: "0.5rem"}}>Nama Kategori</th>
            <th style={{width: 150, padding: "0.5rem"}}>Jumlah Produk</th>
            <th style={{width: 100, padding: "0.5rem"}}>Diperbarui</th>
            <th style={{width: 100, padding: "0.5rem"}}>Dibuat</th>
            <th style={{width: 80, padding: "0.5rem"}}> </th>
          </tr>
        </thead>
      );
    }
  };

  const getColSpan = () => {
    return entityName === "products" ? 7 : 5;
  };

  useEffect(() => {
    refetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

  useEffect(() => {
    handleSearchName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          borderRadius: "md",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid var(--joy-palette-neutral-200)",
            paddingY: "1rem",
            paddingX: "1.5rem",
          }}
        >
          <Typography
            level="h4"
            sx={{
              fontWeight: "bold",
              color: "var(--joy-palette-text-primary)",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          className="SearchAndFilters-tabletUp"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: "1.5rem",
            gap: 2,
          }}
        >
          <form onSubmit={handleSubmitForm}>
            <StyledInput
              name="search"
              placeholder={`Cari ${title}...`}
              startDecorator={<Search />}
              size="md"
              onChange={handleChangeFilter}
              value={filters?.search}
            />
          </form>

          <StyledButton startDecorator={<AddRounded />} onClick={handleCreate}>
            {`${title} Baru`}
          </StyledButton>
        </Box>

        <Box sx={{overflow: "auto"}}>
          <JoyTable
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
              "--TableCell-paddingY": "12px",
              "--TableCell-paddingX": "16px",
            }}
          >
            {getTableHeaders()}
            <tbody>{renderContent()}</tbody>
            <tfoot>
              <tr>
                <td colSpan={getColSpan()}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "flex-end",
                      padding: "1rem",
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
          </JoyTable>
        </Box>
      </Sheet>
      {entityName !== "products" && (
        <ModalCreate
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          pathname={pathname}
          title={title}
        />
      )}
    </>
  );
};

export default TableComponent;
