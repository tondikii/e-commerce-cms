// src/components/Table/components/RowMenu/index.tsx
import {api} from "@/lib/axios";
import {Product, Category} from "@/types";
import {MoreHorizRounded} from "@mui/icons-material";
import {
  Divider,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import type {FC} from "react";
import Swal from "sweetalert2";

interface RowMenuProps {
  data: Product | Category;
  entityName: string;
  router: any;
  refetch: () => void;
  pathname: string;
}

const RowMenu: FC<RowMenuProps> = ({
  data,
  entityName,
  router,
  refetch,
  pathname,
}) => {
  const handleDelete = async () => {
    try {
      await api.delete(pathname, {
        params: {id: data.id},
      });

      Swal.fire({
        title: `Berhasil Hapus ${
          entityName === "categories" ? "Kategori" : "Produk"
        }`,
        text: `${entityName === "categories" ? "Kategori" : "Produk"} ${
          data.name
        } berhasil dihapus`,
        icon: "success",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: `Gagal Hapus ${
          entityName === "categories" ? "Kategori" : "Produk"
        }`,
        text: `${entityName === "categories" ? "Kategori" : "Produk"} ${
          data.name
        } gagal dihapus`,
        icon: "error",
      });
    }
  };

  const handleEdit = () => {
    router.push(`${pathname}/detail/${data.id}`);
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{root: IconButton}}
        slotProps={{root: {variant: "plain", color: "neutral", size: "sm"}}}
      >
        <MoreHorizRounded />
      </MenuButton>
      <Menu size="sm" sx={{minWidth: 140}}>
        <MenuItem onClick={handleEdit}>
          {entityName === "categories" ? "Edit" : "Detail"}
        </MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={handleDelete}>
          Hapus
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default RowMenu;
