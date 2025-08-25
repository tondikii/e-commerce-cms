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
  Modal,
  ModalDialog,
  ModalClose,
  Checkbox,
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
import {StyledInput, Text, Title} from "@/components";
import Image from "next/image";
import {Category, Collection, Product, Products} from "@/types";

interface EntityDetailPageProps {
  entityType: "category" | "collection";
  entityName: string;
  entityNamePlural: string;
}

type EntityWithProducts = (Category | Collection) & {
  products: Products;
};

export default function EntityDetailPage({
  entityType,
  entityName,
  entityNamePlural,
}: EntityDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const entityId = params.id as string;

  const [entity, setEntity] = useState<EntityWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
  });
  const [allProducts, setAllProducts] = useState<Products>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [addProductsModalOpen, setAddProductsModalOpen] = useState(false);
  const [productsToAdd, setProductsToAdd] = useState<number[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Products>([]);

  useEffect(() => {
    fetchEntity();
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const fetchEntity = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${pathname}`);
      setEntity(response.data);
      setEditData({
        name: response.data.name,
      });
      setSelectedProducts(
        response.data.products?.map((p: Product) => p.id) || []
      );
    } catch (error) {
      console.error(`Failed to fetch ${entityName}:`, error);
      Swal.fire({
        title: "Error",
        text: `Gagal memuat data ${entityName}`,
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
      const queryParam =
        entityType === "category" ? "noCategory=true" : "noCollection=true";
      const response = await api.get(`/products?limit=1000&${queryParam}`);
      setAvailableProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch available products:", error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      if (entity) {
        setEditData({
          name: entity.name,
        });
        setSelectedProducts(entity.products?.map((p) => p.id) || []);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Update entity name
      await api.put(`${pathname}`, {
        name: editData.name,
      });

      // Update products in entity
      await api.put(`${pathname}/products`, {
        productIds: selectedProducts,
      });

      // Refresh data
      await fetchEntity();
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil",
        text: `${entityName} berhasil diperbarui`,
        icon: "success",
      });
    } catch (error) {
      console.error(`Failed to update ${entityName}:`, error);
      Swal.fire({
        title: "Error",
        text: `Gagal memperbarui ${entityName}`,
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

      // Add selected products to entity
      await api.put(`${pathname}/products`, {
        productIds: [...selectedProducts, ...productsToAdd],
      });

      // Refresh data
      await fetchEntity();
      setAddProductsModalOpen(false);

      Swal.fire({
        title: "Berhasil",
        text: `Produk berhasil ditambahkan ke ${entityName}`,
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to add products:", error);
      Swal.fire({
        title: "Error",
        text: `Gagal menambahkan produk ke ${entityName}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      setLoading(true);

      // Remove product from entity
      await api.put(`${pathname}/products`, {
        productIds: selectedProducts.filter((id) => id !== productId),
      });

      // Refresh data
      await fetchEntity();

      Swal.fire({
        title: "Berhasil",
        text: `Produk berhasil dihapus dari ${entityName}`,
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to remove product:", error);
      Swal.fire({
        title: "Error",
        text: `Gagal menghapus produk dari ${entityName}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>Memuat data {entityName}...</Typography>
      </Box>
    );
  }

  if (!entity) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>{entityName} tidak ditemukan</Typography>
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
        {/* Entity Info Card */}
        <Card variant="outlined">
          <Title>Informasi {entityName}</Title>

          <Stack spacing={2} sx={{mt: 2}}>
            {isEditing ? (
              <StyledInput
                name="name"
                label={`Nama ${entityName}`}
                value={editData.name}
                onChange={(e) => setEditData({name: e.target.value})}
                required
                size="sm"
              />
            ) : (
              <>
                <Box>
                  <Text fontWeight="lg">Nama {entityName}</Text>
                  <Text>{entity.name}</Text>
                </Box>
              </>
            )}

            <Box>
              <Text level="body-sm" fontWeight="lg">
                Jumlah Produk
              </Text>
              <Text>{entity.products?.length || 0} Produk</Text>
            </Box>

            <Box>
              <Text level="body-sm" fontWeight="lg">
                Dibuat Pada
              </Text>
              <Text>{new Date(entity.createdAt).toLocaleString("id-ID")}</Text>
            </Box>

            <Box>
              <Text level="body-sm" fontWeight="lg">
                Diperbarui Pada
              </Text>
              <Text>{new Date(entity.updatedAt).toLocaleString("id-ID")}</Text>
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
            <Title>Produk dalam {entityName}</Title>

            <Button
              variant="outlined"
              startDecorator={<AddRounded />}
              onClick={handleOpenAddProductsModal}
              disabled={!isEditing}
            >
              Tambah Produk
            </Button>
          </Stack>

          <Stack spacing={2}>
            {entity.products && entity.products.length > 0 ? (
              <Table borderAxis="both" sx={{minWidth: 600}}>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama Produk</th>
                    {entityType === "category" && <th>Koleksi</th>}
                    {entityType === "collection" && <th>Kategori</th>}
                    <th>Varian</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {entity.products.map((product) => (
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
                          {entityType === "category"
                            ? product?.collection?.name || "Tidak ada koleksi"
                            : product?.category?.name || "Tidak ada kategori"}
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
                          disabled={!isEditing || loading}
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
                Tidak ada produk dalam {entityName} ini.
              </Typography>
            )}
          </Stack>
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
            Tambah Produk ke {entityName}
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
                      {entityType === "category" && <th>Koleksi</th>}
                      {entityType === "collection" && <th>Kategori</th>}
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
                            {entityType === "category"
                              ? product?.collection?.name || "Tidak ada koleksi"
                              : product?.category?.name || "Tidak ada kategori"}
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
