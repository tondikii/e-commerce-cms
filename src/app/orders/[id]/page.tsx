"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Sheet,
  Stack,
  Divider,
  Alert,
  Chip,
  Grid,
  Select,
  Option,
} from "@mui/joy";
import {LocalShippingRounded, ArrowBackRounded} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {api} from "@/lib/axios";
import {formatCurrency} from "@/utils/currency";
import {formatDate} from "@/utils";

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const {data} = await api.get(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      setError("Gagal memuat detail order");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      await api.patch(`/orders/${orderId}`, {status: newStatus});
      setOrder({...order, status: newStatus});
      // Refresh data
      fetchOrder();
    } catch (err) {
      setError("Gagal mengupdate status order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Typography>Memuat detail order...</Typography>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Alert color="danger">{error || "Order tidak ditemukan"}</Alert>
        <Button component={Link} href="/orders" sx={{mt: 2}}>
          Kembali ke Daftar Order
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      {/* Header */}
      <Box sx={{mb: 4}}>
        <Button
          component={Link}
          href="/orders"
          startDecorator={<ArrowBackRounded />}
          variant="outlined"
          sx={{mb: 2}}
        >
          Kembali
        </Button>
        <Typography level="h2" sx={{mb: 1}}>
          Order #{order.orderNumber}
        </Typography>
        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
          <Chip
            color={
              order.status === "DELIVERED"
                ? "success"
                : order.status === "PROCESSING"
                ? "primary"
                : order.status === "SHIPPED"
                ? "warning"
                : order.status === "CANCELLED"
                ? "danger"
                : "neutral"
            }
            size="lg"
          >
            {order.status}
          </Chip>
          <Typography level="body-sm">
            Dibuat: {formatDate(order.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid xs={12} md={8}>
          <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg", mb: 3}}>
            <Typography level="h4" sx={{mb: 3}}>
              Detail Pesanan
            </Typography>

            {/* Status Update */}
            <Box sx={{mb: 3}}>
              <Typography level="body-sm" fontWeight={600} sx={{mb: 1}}>
                Update Status:
              </Typography>
              <Select
                value={order.status}
                onChange={(e, newValue) =>
                  updateOrderStatus(newValue as string)
                }
                disabled={updating}
                sx={{minWidth: 200}}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="PROCESSING">PROCESSING</Option>
                <Option value="SHIPPED">SHIPPED</Option>
                <Option value="DELIVERED">DELIVERED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Box>

            {/* Order Items */}
            <Stack spacing={2}>
              {order.items.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    bgcolor: "neutral.50",
                    borderRadius: "md",
                  }}
                >
                  <Image
                    src={
                      item.variant.product.images[0]?.url || "/placeholder.jpg"
                    }
                    alt={item.variant.product.name}
                    width={80}
                    height={80}
                    style={{objectFit: "cover", borderRadius: "8px"}}
                  />
                  <Box sx={{flex: 1}}>
                    <Typography fontWeight={600}>
                      {item.variant.product.name}
                    </Typography>
                    <Typography level="body-sm">
                      Qty: {item.quantity}
                    </Typography>
                    <Typography level="body-sm">
                      Price: {formatCurrency(item.price)}
                    </Typography>
                  </Box>
                  <Typography fontWeight={600}>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{my: 3}} />

            {/* Order Summary */}
            <Stack spacing={1}>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography>Subtotal</Typography>
                <Typography>
                  {formatCurrency(order.totalAmount - order.shippingCost)}
                </Typography>
              </Box>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography>Shipping</Typography>
                <Typography>{formatCurrency(order.shippingCost)}</Typography>
              </Box>
              <Divider />
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography fontWeight={600}>Total</Typography>
                <Typography fontWeight={600}>
                  {formatCurrency(order.totalAmount)}
                </Typography>
              </Box>
            </Stack>
          </Sheet>

          {/* Shipping Address */}
          <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg"}}>
            <Typography level="h4" sx={{mb: 2}}>
              <LocalShippingRounded sx={{mr: 1}} />
              Alamat Pengiriman
            </Typography>
            <Box>
              <Typography fontWeight={600}>
                {order.shippingAddress.recipient}
              </Typography>
              <Typography level="body-sm">
                {order.shippingAddress.phone}
              </Typography>
              <Typography level="body-sm">
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.province}{" "}
                {order.shippingAddress.postalCode}
              </Typography>
            </Box>
          </Sheet>
        </Grid>

        {/* Sidebar */}
        <Grid xs={12} md={4}>
          <Sheet variant="outlined" sx={{p: 3, borderRadius: "lg"}}>
            <Typography level="h4" sx={{mb: 2}}>
              Informasi Customer
            </Typography>
            <Box>
              <Typography fontWeight={600}>{order.user?.name}</Typography>
              <Typography level="body-sm">{order.user?.email}</Typography>
              <Typography level="body-sm">{order.user?.phoneNumber}</Typography>
            </Box>

            <Divider sx={{my: 3}} />

            <Typography level="h4" sx={{mb: 2}}>
              Informasi Pembayaran
            </Typography>
            <Box>
              <Typography level="body-sm">
                Status: {order.payment?.status}
              </Typography>
              <Typography level="body-sm">
                Method: {order.payment?.method}
              </Typography>
              {order.payment?.paidAt && (
                <Typography level="body-sm">
                  Paid at: {formatDate(order.payment.paidAt)}
                </Typography>
              )}
            </Box>
          </Sheet>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
