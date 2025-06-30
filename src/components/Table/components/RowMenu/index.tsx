import {api} from "@/lib/axios";
import {Product} from "@/types";
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
  product: Product;
  entityName: string;
  router: any;
  refetch: () => void;
}

const RowMenu: FC<RowMenuProps> = ({product, entityName, router, refetch}) => {
  const handleDeleteProduct = async () => {
    try {
      await api.delete(entityName, {
        params: {id: product.id},
      });

      Swal.fire({
        title: "Berhasil Hapus Produk",
        text: `Produk ${product.name} berhasil dihapus`,
        icon: "success",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: "Gagal Hapus Produk",
        text: `Produk ${product.name} gagal dihapus`,
        icon: "error",
      });
    }
  };

  const handleEditProduct = () => {
    router.push(`${product.categoryId}/edit/${product.id}`);
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
        <MenuItem onClick={handleEditProduct}>Edit</MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={handleDeleteProduct}>
          Hapus
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default RowMenu;
