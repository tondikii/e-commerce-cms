// src/app/products/detail/[id]/page.tsx
"use client";
import {useState, useEffect, useCallback, ChangeEvent} from "react";
import {useParams, useRouter} from "next/navigation";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import {
  EditRounded,
  SaveRounded,
  CancelRounded,
  DeleteRounded,
  KeyboardArrowLeft,
  AddRounded,
  CloseRounded,
} from "@mui/icons-material";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  ProductDetailType,
  ProductVariantType,
  ProductWithRelations,
  ProductOptionType,
} from "@/types/product";
import ImageUpload from "@/components/ImageUpload";
import {handleFileUpload} from "@/utils";
import {
  InputNumber,
  NumericFormatInput,
  StyledInput,
  StyledTextarea,
  Text,
} from "@/components";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProductDetailType>({
    name: "",
    description: "",
    images: [],
  });
  const [variantEditData, setVariantEditData] = useState<
    Record<number, {price: number; stock: number}>
  >({});
  const [options, setOptions] = useState<ProductOptionType[]>([]);
  const [newVariantInputs, setNewVariantInputs] = useState<{
    [key: number]: string;
  }>({});
  const [generatedVariants, setGeneratedVariants] = useState<
    ProductVariantType[]
  >([]);

  // Fungsi helper untuk handle ID variant
  const getVariantIdForEdit = (
    variantId: string | number | undefined
  ): number => {
    if (!variantId) return 0;

    if (typeof variantId === "string" && variantId.startsWith("new-")) {
      const index = parseInt(variantId.replace("new-", ""));
      return index + 10000;
    }

    return Number(variantId);
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const extractOptionsFromVariants = useCallback(
    (variants: ProductVariantType[]) => {
      if (variants.length === 0) return [];

      const optionMap: Record<string, Set<string>> = {};

      variants.forEach((variant) => {
        if (variant.optionValues && typeof variant.optionValues === "object") {
          Object.entries(variant.optionValues).forEach(
            ([optionName, optionValue]) => {
              if (!optionMap[optionName]) {
                optionMap[optionName] = new Set();
              }
              optionMap[optionName].add(optionValue);
            }
          );
        }
      });

      return Object.entries(optionMap).map(([name, valuesSet]) => ({
        name,
        variants: Array.from(valuesSet),
      }));
    },
    []
  );

  const generateVariantsFromOptions = useCallback(
    (options: ProductOptionType[]) => {
      if (
        options.length === 0 ||
        options.some((opt) => opt.variants.length === 0)
      ) {
        return [];
      }

      const combinations = options.reduce<Record<string, string>[]>(
        (acc, opt) => {
          const next: Record<string, string>[] = [];
          acc.forEach((comb) => {
            opt.variants.forEach((v) => {
              next.push({...comb, [opt.name]: v});
            });
          });
          return next;
        },
        [{}]
      );

      return combinations.map((combination, index) => {
        const existingVariant = product?.variants.find((variant) => {
          if (!variant.optionValues || typeof variant.optionValues !== "object")
            return false;

          const existingCombination = variant.optionValues;
          const combinationKeys = Object.keys(combination);
          const existingKeys = Object.keys(existingCombination);

          if (combinationKeys.length !== existingKeys.length) return false;

          return combinationKeys.every(
            (key) => existingCombination[key] === combination[key]
          );
        });

        const variantId = existingVariant?.id || `new-${index}`;

        return {
          id: variantId,
          price: existingVariant?.price || 0,
          stock: existingVariant?.stock || 0,
          optionValues: combination,
          sku: existingVariant?.sku || "",
          productId: existingVariant?.productId || Number(productId),
        };
      });
    },
    [product?.variants, productId]
  );

  useEffect(() => {
    if (isEditing && options.length > 0) {
      const newVariants = generateVariantsFromOptions(options);
      setGeneratedVariants(newVariants);

      const newVariantData: Record<number, {price: number; stock: number}> = {
        ...variantEditData,
      };

      newVariants.forEach((variant) => {
        if (variant.id) {
          const variantId = getVariantIdForEdit(variant.id);

          if (!newVariantData[variantId]) {
            newVariantData[variantId] = {
              price: variant.price,
              stock: variant.stock,
            };
          }
        }
      });

      setVariantEditData(newVariantData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, isEditing, generateVariantsFromOptions]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);

      setEditData({
        name: response.data.name,
        description: response.data.description,
        images: [],
      });

      const variantData: Record<number, {price: number; stock: number}> = {};
      response.data.variants.forEach((variant: ProductVariantType) => {
        if (variant.id) {
          variantData[Number(variant.id)] = {
            price: variant.price,
            stock: variant.stock,
          };
        }
      });
      setVariantEditData(variantData);

      const extractedOptions = extractOptionsFromVariants(
        response.data.variants
      );
      setOptions(extractedOptions);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal memuat data produk",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Gambar?",
        text: "Apakah Anda yakin ingin menghapus gambar ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await api.delete(`/products/${productId}/images/${imageId}`);
        await fetchProduct();

        Swal.fire({
          title: "Terhapus!",
          text: "Gambar berhasil dihapus.",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal menghapus gambar",
        icon: "error",
      });
    }
  };

  const handleVariantChange = (
    variantId: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const {target} = e;
    const value = Number(target.value);
    const name = target.name;

    setVariantEditData((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      },
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (product) {
        setEditData({
          name: product.name,
          description: product.description,
          images: [],
        });

        const variantData: Record<number, {price: number; stock: number}> = {};
        product.variants.forEach((variant: ProductVariantType) => {
          if (variant.id) {
            variantData[Number(variant.id)] = {
              price: variant.price,
              stock: variant.stock,
            };
          }
        });
        setVariantEditData(variantData);

        const extractedOptions = extractOptionsFromVariants(product.variants);
        setOptions(extractedOptions);
        setGeneratedVariants([]);
      }
    }
    setIsEditing(!isEditing);
  };

  const addOption = () => {
    setOptions([...options, {name: "", variants: []}]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setNewVariantInputs((prev) => {
      const newInputs = {...prev};
      delete newInputs[index];
      return newInputs;
    });
  };

  const updateOptionName = (index: number, name: string) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index].name = name;
      return newOptions;
    });
  };

  const addOptionVariant = (optionIndex: number, value: string) => {
    if (!value.trim()) return;

    setOptions((prev) => {
      const newOptions = [...prev];
      if (!newOptions[optionIndex].variants.includes(value.trim())) {
        newOptions[optionIndex].variants.push(value.trim());
      }
      return newOptions;
    });

    setNewVariantInputs((prev) => ({...prev, [optionIndex]: ""}));
  };

  const removeOptionVariant = (optionIndex: number, variantIndex: number) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[optionIndex].variants = newOptions[
        optionIndex
      ].variants.filter((_, i) => i !== variantIndex);
      return newOptions;
    });
  };

  const handleVariantInputChange = (optionIndex: number, value: string) => {
    setNewVariantInputs((prev) => ({...prev, [optionIndex]: value}));
  };

  const handleVariantInputKeyPress = (
    optionIndex: number,
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addOptionVariant(optionIndex, newVariantInputs[optionIndex] || "");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const uploadedImages = await Promise.all(
        editData.images.map(async (file) => await handleFileUpload(file))
      );

      await api.put(`/products/${productId}`, {
        name: editData.name,
        description: editData.description,
        newImages: uploadedImages,
      });

      const variantsToUpdate = generatedVariants.map((variant) => {
        const variantId = getVariantIdForEdit(variant.id);

        return {
          price: variantEditData[variantId]?.price || variant.price || 0,
          stock: variantEditData[variantId]?.stock || variant.stock || 0,
          optionValues: variant.optionValues,
        };
      });

      await api.put(`/products/${productId}/options`, {
        options,
        variants: variantsToUpdate,
      });

      await fetchProduct();
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil",
        text: "Produk berhasil diperbarui",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui produk",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>Memuat data produk...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{p: 3, textAlign: "center"}}>
        <Typography>Produk tidak ditemukan</Typography>
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
              startDecorator={<SaveRounded />}
              onClick={handleSave}
              loading={loading}
              color="neutral"
            >
              Simpan
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            startDecorator={<EditRounded />}
            onClick={handleEditToggle}
            color="warning"
          >
            Edit
          </Button>
        )}
      </Stack>

      <Stack spacing={4}>
        <Card variant="outlined">
          <Typography level="h4" sx={{mb: 2}}>
            Informasi Produk
          </Typography>

          <Stack spacing={2}>
            {isEditing ? (
              <>
                <StyledInput
                  name="name"
                  label="Nama Produk"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({...editData, name: e.target.value})
                  }
                  required
                  size="sm"
                />
                <StyledTextarea
                  name="description"
                  label="Deskripsi"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({...editData, description: e.target.value})
                  }
                  minRows={3}
                  size="sm"
                />
              </>
            ) : (
              <>
                <Box>
                  <Text fontWeight="lg">Nama Produk</Text>
                  <Typography>{product.name}</Typography>
                </Box>
                <Box>
                  <Text fontWeight="lg">Deskripsi</Text>
                  <Typography>{product.description}</Typography>
                </Box>
              </>
            )}

            <Box>
              <Text fontWeight="lg">Kategori</Text>
              <Typography>
                {product.category?.name || "Tidak ada kategori"}
              </Typography>
            </Box>
            <Box>
              <Text fontWeight="lg">Koleksi</Text>
              <Typography>
                {product.collection?.name || "Tidak ada koleksi"}
              </Typography>
            </Box>

            <Box>
              <Text fontWeight="lg">Dibuat Pada</Text>
              <Text>{new Date(product.createdAt).toLocaleString("id-ID")}</Text>
            </Box>

            <Box>
              <Text fontWeight="lg">Diperbarui Pada</Text>
              <Text>{new Date(product.updatedAt).toLocaleString("id-ID")}</Text>
            </Box>
          </Stack>
        </Card>

        <Card variant="outlined">
          <Typography level="h4" sx={{mb: 2}}>
            Gambar Produk
          </Typography>

          {isEditing && (
            <Box sx={{mb: 3}}>
              <ImageUpload
                onChange={(files) => setEditData({...editData, images: files})}
                maxFiles={5 - product.images.length}
              />
            </Box>
          )}

          {product.images.length > 0 ? (
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {product.images.map((image) => (
                <Box
                  key={image.id}
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: "md",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.name}
                    fill
                    style={{objectFit: "cover"}}
                  />
                  {isEditing && (
                    <IconButton
                      color="danger"
                      size="sm"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                      onClick={() => handleDeleteImage(Number(image.id))}
                    >
                      <DeleteRounded />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography level="body-sm" color="neutral">
              Belum ada gambar untuk produk ini.
            </Typography>
          )}
        </Card>

        {isEditing && (
          <Card variant="outlined">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{mb: 2}}
            >
              <Typography level="h4">Pilihan Varian</Typography>
            </Stack>

            <Stack spacing={3}>
              {options.map((option, optionIndex) => (
                <Card
                  key={optionIndex}
                  variant="outlined"
                  sx={{position: "relative"}}
                >
                  <IconButton
                    color="danger"
                    size="sm"
                    sx={{position: "absolute", top: 8, right: 8}}
                    onClick={() => removeOption(optionIndex)}
                  >
                    <CloseRounded />
                  </IconButton>

                  <Stack spacing={2}>
                    <StyledInput
                      label="Nama Pilihan"
                      value={option.name}
                      onChange={(e) =>
                        updateOptionName(optionIndex, e.target.value)
                      }
                      placeholder="Warna, Ukuran, dll."
                      size="sm"
                    />

                    <StyledInput
                      label="Tambah Varian"
                      value={newVariantInputs[optionIndex] || ""}
                      onChange={(e) =>
                        handleVariantInputChange(optionIndex, e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleVariantInputKeyPress(optionIndex, e)
                      }
                      placeholder="Masukkan varian dan tekan Enter"
                      endDecorator={
                        <IconButton
                          onClick={() =>
                            addOptionVariant(
                              optionIndex,
                              newVariantInputs[optionIndex] || ""
                            )
                          }
                          disabled={!newVariantInputs[optionIndex]?.trim()}
                        >
                          <AddRounded />
                        </IconButton>
                      }
                      size="sm"
                    />

                    {option.variants.length > 0 && (
                      <Box>
                        <Typography level="body-sm" sx={{mb: 1}}>
                          Varian yang ditambahkan:
                        </Typography>
                        <Stack direction="row" gap={1} flexWrap="wrap">
                          {option.variants.map((value, variantIndex) => (
                            <Box
                              key={`${value}-${variantIndex}`}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1,
                                borderRadius: "lg",
                                bgcolor: "neutral.softBg",
                              }}
                            >
                              <Typography level="body-sm">{value}</Typography>
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() =>
                                  removeOptionVariant(optionIndex, variantIndex)
                                }
                              >
                                <CloseRounded fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Card>
              ))}

              <Button
                startDecorator={<AddRounded />}
                onClick={addOption}
                variant="outlined"
                color="neutral"
              >
                Tambah Pilihan
              </Button>
            </Stack>
          </Card>
        )}

        <Card variant="outlined">
          <Typography level="h4" sx={{mb: 2}}>
            Varian Produk {isEditing && "(Preview)"}
          </Typography>

          {(isEditing ? generatedVariants : product.variants).length > 0 ? (
            <Table borderAxis="both" sx={{minWidth: 600}}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Kombinasi Varian</th>
                  <th>Harga</th>
                  <th>Stok</th>
                </tr>
              </thead>
              <tbody>
                {(isEditing ? generatedVariants : product.variants).map(
                  (variant) => {
                    const variantId = getVariantIdForEdit(variant.id);

                    return (
                      <tr key={variant.id}>
                        <td>
                          <Typography level="body-sm">
                            {variant.sku ||
                              (isEditing ? "Akan digenerate" : "-")}
                          </Typography>
                        </td>
                        <td>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {variant.optionValues &&
                              typeof variant.optionValues === "object" &&
                              Object.entries(variant.optionValues).map(
                                ([key, value]) => (
                                  <Chip key={key} size="sm" variant="outlined">
                                    {key}: {value}
                                  </Chip>
                                )
                              )}
                          </Stack>
                        </td>
                        <td>
                          {isEditing ? (
                            <NumericFormatInput
                              name="price"
                              value={`${
                                variantEditData[variantId]?.price ||
                                variant.price ||
                                0
                              }`}
                              onChange={(e) =>
                                handleVariantChange(variantId, e)
                              }
                              size="sm"
                            />
                          ) : (
                            <Typography level="body-sm">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(variant.price)}
                            </Typography>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <InputNumber
                              name="stock"
                              value={`${
                                variantEditData[variantId]?.stock ||
                                variant.stock ||
                                0
                              }`}
                              onChange={(e) =>
                                handleVariantChange(variantId, e)
                              }
                              size="sm"
                            />
                          ) : (
                            <Typography level="body-sm">
                              {variant.stock}
                            </Typography>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          ) : (
            <Typography level="body-sm" color="neutral">
              {isEditing
                ? "Tambah pilihan dan varian untuk melihat preview"
                : "Produk ini tidak memiliki varian."}
            </Typography>
          )}
        </Card>
      </Stack>
    </Box>
  );
}
