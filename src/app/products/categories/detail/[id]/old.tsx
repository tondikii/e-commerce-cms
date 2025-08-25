"use client";
import {useState, useEffect} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Option,
  Modal,
  ModalDialog,
  ModalClose,
  Sheet,
  Checkbox,
  Input,
} from "@mui/joy";
import {
  EditRounded,
  SaveRounded,
  CancelRounded,
  KeyboardArrowLeft,
  DeleteRounded,
  AddRounded,
} from "@mui/icons-material";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";
import {Category, Product} from "@/types";
import {StyledInput, StyledButton, Text} from "@/components";
import Image from "next/image";

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [addProductsModalOpen, setAddProductsModalOpen] = useState(false);
  const [productsToAdd, setProductsToAdd] = useState<number[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategory();
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${pathname}`);
      setCategory(response.data);
      setEditData({
        name: response.data.name,
      });
      setSelectedProducts(
        response.data.products?.map((p: Product) => p.id) || []
      );
    } catch (error) {
      console.error("Failed to fetch category:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memuat data kategori",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await api.get("/products?limit=1000");
      setAllProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await api.get("/products?limit=1000&noCategory=true");
      setAvailableProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch available products:", error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      if (category) {
        setEditData({
          name: category.name,
        });
        setSelectedProducts(category.products?.map((p) => p.id) || []);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Update category name
      await api.put(`${pathname}`, {
        name: editData.name,
      });

      // Update products in category
      await api.put(`${pathname}/products`, {
        productIds: selectedProducts,
      });

      // Refresh data
      await fetchCategory();
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil",
        text: "Kategori berhasil diperbarui",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to update category:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui kategori",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelection = (productId: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleProductToAddSelection = (productId: number) => {
    setProductsToAdd((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllAvailable = () => {
    if (productsToAdd.length === availableProducts.length) {
      setProductsToAdd([]);
    } else {
      setProductsToAdd(availableProducts.map((p) => p.id));
    }
  };

  const handleOpenAddProductsModal = async () => {
    setProductsToAdd([]);
    await fetchAvailableProducts();
    setAddProductsModalOpen(true);
  };

  const handleAddProducts = async () => {
    try {
      setLoading(true);

      // Add selected products to category
      await api.put(`${pathname}/products`, {
        productIds: [...selectedProducts, ...productsToAdd],
      });

      // Refresh data
      await fetchCategory();
      setAddProductsModalOpen(false);

      Swal.fire({
        title: "Berhasil",
        text: "Produk berhasil ditambahkan ke kategori",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to add products:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan produk ke kategori",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      setLoading(true);

      // Remove product from category
      await api.put(`${pathname}/products`, {
        productIds: selectedProducts.filter((id) => id !== productId),
      });

      // Refresh data
      await fetchCategory();

      Swal.fire({
        title: "Berhasil",
        text: "Produk berhasil dihapus dari kategori",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to remove product:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal menghapus produk dari kategori",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>Memuat data kategori...</Typography>
      </Box>
    );
  }

  if (!category) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>Kategori tidak ditemukan</Typography>
        <Button
          startDecorator={<KeyboardArrowLeft />}
          onClick={() => router.back()}
          sx={{mt: 2}}
        >
          Kembali
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{width: "80%", mx: "auto"}}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
        <Box sx={{flexGrow: 1}} />
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<CancelRounded />}
              onClick={handleEditToggle}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<SaveRounded />}
              onClick={handleSave}
              loading={loading}
            >
              Simpan
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            startDecorator={<EditRounded />}
            onClick={handleEditToggle}
          >
            Edit
          </Button>
        )}
      </Stack>

      <Stack spacing={4}>
        {/* Category Info Card */}
        <Card variant="outlined">
          <Typography level="h4" sx={{mb: 2}}>
            Informasi Kategori
          </Typography>

          <Stack spacing={2}>
            {isEditing ? (
              <StyledInput
                name="name"
                label="Nama Kategori"
                value={editData.name}
                onChange={(e) => setEditData({name: e.target.value})}
                required
                size="sm"
              />
            ) : (
              <>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">
                    Nama Kategori
                  </Typography>
                  <Typography>{category.name}</Typography>
                </Box>
              </>
            )}

            <Box>
              <Typography level="body-sm" fontWeight="lg">
                Jumlah Produk
              </Typography>
              <Typography>{category.products?.length || 0} Produk</Typography>
            </Box>

            <Box>
              <Typography level="body-sm" fontWeight="lg">
                Dibuat Pada
              </Typography>
              <Typography>
                {new Date(category.createdAt).toLocaleString("id-ID")}
              </Typography>
            </Box>

            <Box>
              <Typography level="body-sm" fontWeight="lg">
                Diperbarui Pada
              </Typography>
              <Typography>
                {new Date(category.updatedAt).toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Products Card */}
        <Card variant="outlined">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{mb: 2}}
          >
            <Typography level="h4">Produk dalam Kategori</Typography>
            {!isEditing && (
              <Button
                variant="outlined"
                startDecorator={<AddRounded />}
                onClick={handleOpenAddProductsModal}
              >
                Tambah Produk
              </Button>
            )}
          </Stack>

          {isEditing ? (
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Pilih Produk</FormLabel>
                <Box sx={{mb: 2}}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      if (selectedProducts.length === allProducts.length) {
                        setSelectedProducts([]);
                      } else {
                        setSelectedProducts(allProducts.map((p) => p.id));
                      }
                    }}
                  >
                    {selectedProducts.length === allProducts.length
                      ? "Batal Pilih Semua"
                      : "Pilih Semua"}
                  </Button>
                </Box>

                <Stack spacing={1} sx={{maxHeight: 300, overflow: "auto"}}>
                  {allProducts.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 1,
                        borderRadius: "sm",
                        backgroundColor: selectedProducts.includes(product.id)
                          ? "primary.50"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "neutral.50",
                        },
                      }}
                      onClick={() => handleProductSelection(product.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                        style={{marginRight: 8}}
                      />
                      <Typography level="body-sm">{product.name}</Typography>
                    </Box>
                  ))}
                </Stack>
              </FormControl>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {category.products && category.products.length > 0 ? (
                <Table borderAxis="both" sx={{minWidth: 600}}>
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nama Produk</th>
                      <th>Koleksi</th>
                      <th>Varian</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <Image
                            src={product.images?.[0]?.url || ""}
                            alt={product.images?.[0]?.altText || ""}
                            width={50}
                            height={50}
                            style={{objectFit: "cover"}}
                          />
                        </td>
                        <td>
                          <Text>{product.name}</Text>
                        </td>
                        <td>
                          <Text>
                            {product?.collection?.name || "Tidak ada koleksi"}
                          </Text>
                        </td>
                        <td>
                          <Text>{product.variants?.length || 0} varian</Text>
                        </td>
                        <td>
                          <IconButton
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                            disabled={loading}
                          >
                            <DeleteRounded />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5}></td>
                    </tr>
                  </tfoot>
                </Table>
              ) : (
                <Typography level="body-sm" color="neutral">
                  Tidak ada produk dalam kategori ini.
                </Typography>
              )}
            </Stack>
          )}
        </Card>
      </Stack>

      {/* Modal untuk menambahkan produk */}
      <Modal
        open={addProductsModalOpen}
        onClose={() => setAddProductsModalOpen(false)}
      >
        <ModalDialog size="lg" sx={{maxWidth: 800, width: "100%"}}>
          <ModalClose />
          <Typography level="h4" sx={{mb: 2}}>
            Tambah Produk ke Kategori
          </Typography>

          <Box sx={{maxHeight: 400, overflow: "auto"}}>
            {availableProducts.length > 0 ? (
              <>
                <Box sx={{mb: 2}}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={handleSelectAllAvailable}
                  >
                    {productsToAdd.length === availableProducts.length
                      ? "Batal Pilih Semua"
                      : "Pilih Semua"}
                  </Button>
                </Box>

                <Table borderAxis="both">
                  <thead>
                    <tr>
                      <th style={{width: 50}}></th>
                      <th>Foto</th>
                      <th>Nama Produk</th>
                      <th>Koleksi</th>
                      <th>Varian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <Checkbox
                            checked={productsToAdd.includes(product.id)}
                            onChange={() =>
                              handleProductToAddSelection(product.id)
                            }
                          />
                        </td>
                        <td>
                          <Image
                            src={product.images?.[0]?.url || ""}
                            alt={product.images?.[0]?.altText || ""}
                            width={50}
                            height={50}
                            style={{objectFit: "cover"}}
                          />
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {product.name}
                          </Typography>
                        </td>
                        <td>
                          <Chip size="sm" variant="soft">
                            {product?.collection?.name || "Tidak ada koleksi"}
                          </Chip>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {product.variants?.length || 0} varian
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5}></td>
                    </tr>
                  </tfoot>
                </Table>
              </>
            ) : (
              <Typography level="body-sm" color="neutral" sx={{py: 2}}>
                Tidak ada produk yang tersedia untuk ditambahkan.
              </Typography>
            )}
          </Box>

          <Box
            sx={{mt: 3, display: "flex", justifyContent: "flex-end", gap: 1}}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setAddProductsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddProducts}
              disabled={productsToAdd.length === 0}
              loading={loading}
            >
              Tambah Produk ({productsToAdd.length})
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
