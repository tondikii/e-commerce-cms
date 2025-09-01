import {api} from "@/lib/axios";
import {Product, Category, Order} from "@/types";
import {
  MoreHorizRounded,
  VisibilityRounded,
  EditRounded,
  DeleteRounded,
} from "@mui/icons-material";
import {
  Divider,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Box,
} from "@mui/joy";
import type {FC} from "react";
import Swal from "sweetalert2";

interface RowMenuProps {
  data: Product | Category | Order | any;
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
          entityName === "categories"
            ? "Kategori"
            : entityName === "orders"
            ? "Order"
            : "Produk"
        }`,
        text: `${
          entityName === "categories"
            ? "Kategori"
            : entityName === "orders"
            ? "Order"
            : "Produk"
        } ${
          entityName === "orders" ? (data as Order).orderNumber : data?.name
        } berhasil dihapus`,
        icon: "success",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: `Gagal Hapus ${
          entityName === "categories"
            ? "Kategori"
            : entityName === "orders"
            ? "Order"
            : "Produk"
        }`,
        text: `${
          entityName === "categories"
            ? "Kategori"
            : entityName === "orders"
            ? "Order"
            : "Produk"
        } ${
          entityName === "orders" ? (data as Order).orderNumber : data?.name
        } gagal dihapus`,
        icon: "error",
      });
    }
  };

  const handleView = () => {
    if (entityName === "orders") {
      router.push(`${pathname}/${data.id}`);
    } else {
      router.push(`${pathname}/detail/${data.id}`);
    }
  };

  const handleEdit = () => {
    if (entityName === "orders") {
      router.push(`${pathname}/${data.id}/edit`);
    } else {
      router.push(`${pathname}/detail/${data.id}`);
    }
  };

  const handleUpdateOrderStatus = async (newStatus: string) => {
    try {
      await api.patch(`${pathname}/${data.id}`, {status: newStatus});

      Swal.fire({
        title: "Status Updated",
        text: `Order status updated to ${newStatus}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
    } catch (err) {
      Swal.fire({
        title: "Update Failed",
        text: "Failed to update order status",
        icon: "error",
      });
    }
  };

  // Untuk orders, kita perlu menampilkan menu yang berbeda
  if (entityName === "orders") {
    const order = data as Order;

    return (
      <Box sx={{display: "flex", gap: 1}}>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleView}
        >
          <VisibilityRounded />
        </IconButton>

        <Dropdown>
          <MenuButton
            slots={{root: IconButton}}
            slotProps={{root: {variant: "plain", color: "neutral", size: "sm"}}}
          >
            <MoreHorizRounded />
          </MenuButton>
          <Menu size="sm" sx={{minWidth: 140}}>
            <MenuItem onClick={handleView}>View Details</MenuItem>

            {/* Status Update Submenu */}
            <MenuItem>
              Update Status
              <Menu>
                <MenuItem
                  onClick={() => handleUpdateOrderStatus("PROCESSING")}
                  disabled={order.status === "PROCESSING"}
                >
                  Set to Processing
                </MenuItem>
                <MenuItem
                  onClick={() => handleUpdateOrderStatus("SHIPPED")}
                  disabled={order.status === "SHIPPED"}
                >
                  Set to Shipped
                </MenuItem>
                <MenuItem
                  onClick={() => handleUpdateOrderStatus("DELIVERED")}
                  disabled={order.status === "DELIVERED"}
                >
                  Set to Delivered
                </MenuItem>
                <MenuItem
                  onClick={() => handleUpdateOrderStatus("CANCELLED")}
                  disabled={order.status === "CANCELLED"}
                >
                  Set to Cancelled
                </MenuItem>
              </Menu>
            </MenuItem>

            <Divider />
            <MenuItem color="danger" onClick={handleDelete}>
              Delete Order
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    );
  }

  // Untuk products dan categories, tampilkan menu biasa
  return (
    <Box sx={{display: "flex", gap: 1}}>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleView}
      >
        <VisibilityRounded />
      </IconButton>

      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleEdit}
      >
        <EditRounded />
      </IconButton>

      <IconButton
        size="sm"
        variant="plain"
        color="danger"
        onClick={handleDelete}
      >
        <DeleteRounded />
      </IconButton>
    </Box>
  );
};

export default RowMenu;
