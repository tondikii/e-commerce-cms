/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import {
  Dropdown,
  Box,
  Chip,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Option,
  Table,
  Sheet,
  IconButton,
  Typography,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";

import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  MoreHorizRounded,
} from "@mui/icons-material";
import Image from "next/image";
import {format} from "date-fns";
import {FetchedProducts, FetchProductsParams, Products} from "@/types";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "@/constant";
import {ScaleLoader} from "react-spinners";

function labelDisplayedRows({
  from,
  to,
  totalRecords,
}: {
  from: number;
  to: number;
  totalRecords: number;
}) {
  return `${from}–${to} of ${totalRecords}`;
}

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{root: IconButton}}
        slotProps={{root: {variant: "plain", color: "neutral", size: "sm"}}}
      >
        <MoreHorizRounded />
      </MenuButton>
      <Menu size="sm" sx={{minWidth: 140}}>
        <MenuItem>Edit</MenuItem>
        <Divider />
        <MenuItem color="danger">Hapus</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export interface ProductTableProps
  extends FetchProductsParams,
    FetchedProducts {
  setSearchParams: ({
    name,
    value,
    resetPagination,
  }: {
    name: string;
    value: string;
    resetPagination?: boolean;
  }) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  loading,
  setSearchParams,
  ...props
}) => {
  const usedData: Products = Array.isArray(data?.data) ? data.data : [];
  const totalRecords = data?.totalRecords || 0;

  const page = Number(props.page) || DEFAULT_PAGE;
  const limit = Number(props.limit) || DEFAULT_LIMIT;

  const isFirstPage = page === 1;
  const isLastPage = page >= Math.ceil(totalRecords / limit);

  const handleChangeRowsPerPage = async (
    event: any,
    newValue: number | null
  ) => {
    setSearchParams({
      name: "limit",
      value: parseInt(newValue!.toString(), 10).toString(),
    });
  };

  const getLabelDisplayedRowsTo = () => {
    return usedData.length * page;
  };

  const handleChangePage = (newPage: number) => {
    setSearchParams({name: "page", value: newPage.toString()});
  };

  const renderContent = () => {
    if (usedData.length > 0) {
      return usedData.map((row, idx) => {
        const totalQuantity = row.productUnits.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        return (
          <tr key={idx + 1}>
            <td style={{textAlign: "center", width: 120}}>
              <Typography level="body-xs">{row.id}</Typography>
            </td>
            <td>
              <Image
                src={row.productImages[0].url}
                alt={row.name}
                width={105}
                height={105}
              />
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
                  {row.productUnits.map(({size}) => (
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
              <RowMenu />
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

  return (
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
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
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
                  {labelDisplayedRows({
                    from: usedData.length === 0 ? 0 : (page - 1) * limit + 1,
                    to: getLabelDisplayedRowsTo(),
                    totalRecords,
                  })}
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
  );
};

export default ProductTable;
