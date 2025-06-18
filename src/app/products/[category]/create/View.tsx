"use client";

import {
  InputNumber,
  NumericFormatInput,
  RadioGroupStyles,
  Select,
  SelectColors,
  StyledButton,
  StyledInput,
  StyledSubmitButton,
  StyledTextarea,
} from "@/components";
import {Option as SelectOption} from "@/components/Select";
import {MAX_VARCHAR_LENGTH} from "@/constant";
import {
  AddPhotoAlternateRounded,
  AddRounded,
  DeleteRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import {useParams} from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import {ColourOption} from "@/types";
import useMasterData from "@/store/useMasterData";
import Image from "next/image";
import {upload} from "@imagekit/next";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";

interface Props {
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
}

interface AuthParams {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

interface ProductUnitInput {
  code: string;
  quantity: number;
  sizeId: number;
  colorId: number;
}

interface ProductImageInput {
  colorId: number;
  file: File | null;
  previewUrl: string;
}

interface FormProduct {
  styleId: number;
  name: string;
  description: string;
  price: string;
}

const initialUnit = {
  quantity: 0,
  code: "S/C",
  sizeId: 0,
  colorId: 0,
};

const initialFormProduct: FormProduct = {
  styleId: 0,
  name: "",
  description: "",
  price: "",
};

const CreateProductView: FC<Props> = ({sizes, colors}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {category}: {category: string} = useParams();
  const {id: categoryId, name: categoryLabel}: {id: number; name: string} =
    useMasterData().categories.find((e) => e.route === category) || {
      id: 0,
      name: "",
    };

  const [formProduct, setFormProduct] =
    useState<FormProduct>(initialFormProduct);
  const [units, setUnits] = useState<ProductUnitInput[]>([initialUnit]);
  const [imagesFile, setImagesFile] = useState<ProductImageInput[]>([]);
  const [uploadingPhotoColorId, setUploadingPhotoColorId] = useState<number>(0);

  const handleUploadFile = async (file?: File | null) => {
    if (!file) {
      return "";
    }
    try {
      const {data: authParams}: {data: AuthParams} = await api.get(
        "/upload-auth"
      );

      const {signature, expire, token, publicKey} = authParams;
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
      });

      return uploadResponse?.url;
    } catch (err) {
      throw "";
    }
  };

  const isCompletedProduct = useMemo(() => {
    let isCompleted = true;
    Object.keys(formProduct).forEach((key: string) => {
      const value = formProduct[key as keyof FormProduct];
      if (!value) {
        isCompleted = false;
      }
    });
    return isCompleted;
  }, [formProduct]);

  const {isCompletedUnits, unitColors, duplicatedCodesIndex} = useMemo(() => {
    let isCompleted = true;
    const tempUnitColors: {colorId: number; label: string}[] = [];
    const unitCodes: string[] = [];
    const duplicatedCodesIndex: number[][] = [];
    units.forEach((unit: ProductUnitInput, idx: number) => {
      Object.keys(unit).forEach((keyValue: string) => {
        const valueUnit = unit[keyValue as keyof ProductUnitInput];
        if (!valueUnit && keyValue !== "productId") {
          isCompleted = false;
        }
      });
      const isNewUnitColor = !tempUnitColors.find(
        ({colorId}) => colorId === unit.colorId
      );
      if (isNewUnitColor) {
        const unitColor: ColourOption | undefined = colors.find(
          ({value}) => value === unit.colorId
        );
        if (unitColor) {
          tempUnitColors.push({
            colorId: unitColor.value,
            label: unitColor.label,
          });
        }
      }
      const foundDuplicatedIndex = unitCodes.findIndex(
        (code) => code === unit.code
      );
      if (foundDuplicatedIndex >= 0) {
        duplicatedCodesIndex.push([foundDuplicatedIndex, idx]);
        isCompleted = false;
      }
      const foundImageUnit = imagesFile.find((e) => e.colorId === unit.colorId);
      if (!foundImageUnit) {
        isCompleted = false;
      }
      unitCodes.push(unit.code);
    });

    return {
      isCompletedUnits: isCompleted,
      unitColors: tempUnitColors,
      duplicatedCodesIndex,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, imagesFile]);

  const isCompletedImages = useMemo(() => {
    let isCompleted = true;
    unitColors.forEach(({colorId}) => {
      const previews = imagesFile.filter((e) => e.colorId === colorId);
      if (!previews.length || !previews?.[0]?.previewUrl) {
        isCompleted = false;
      }
    });
    return isCompleted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesFile]);

  const disabledSubmit =
    !isCompletedProduct || !isCompletedUnits || !isCompletedImages;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    let numValue: number = 0;
    let maxLength: number = MAX_VARCHAR_LENGTH;
    if (name === "name") {
      maxLength = 50;
    } else if (name === "price" || name === "styleId") {
      numValue = Number(value || 0);
    }
    if (numValue) {
      setFormProduct({...formProduct, [name]: numValue});
    } else if (value?.length <= maxLength) {
      setFormProduct({...formProduct, [name]: value});
    } else if (value) {
      setFormProduct({...formProduct, [name]: value.slice(0, maxLength)});
    }
  };

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const uploadImagesFile = async () => {
        return await Promise.all(
          imagesFile.map(async (image) => {
            const uploadedUrl = await handleUploadFile(image.file);
            return {
              colorId: image.colorId,
              url: uploadedUrl,
            };
          })
        );
      };

      const uploadedImagesFile = await uploadImagesFile();

      await api.post("/product", {
        product: {...formProduct, categoryId},
        productImages: uploadedImagesFile,
        productUnits: units,
      });
    } catch (err) {
      Swal.fire({
        title: "Gagal Buat Produk",
        text: "Terjadi kesalahan saat buat produk",
        icon: "error",
      });
    }
  };

  const handleAddUnit = () => {
    setUnits([...units, initialUnit]);
  };

  const handleDeleteUnit = (idx: number) => {
    const newUnits = [...units];
    newUnits.splice(idx, 1);
    setUnits(newUnits);
  };

  const updateUnit = ({
    idx,
    name,
    value,
  }: {
    idx: number;
    name: string;
    value: number;
  }) => {
    const newUnits = [...units];
    const unit = {...newUnits[idx]};
    const unitSizeId = name === "sizeId" ? value : unit?.sizeId;
    const unitColorId = name === "colorId" ? value : unit?.colorId;
    newUnits[idx] = {
      ...unit,
      [name]: value,
      code: `S${unitSizeId}/C${unitColorId}`,
    };

    setUnits(newUnits);
  };

  const handleChangeUnitInput = (
    idx: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const {name, value} = e.target;
    updateUnit({idx, name, value: Number(value || 0)});
  };

  const handleChangeUnitSelect = (
    idx: number,
    e: SelectOption,
    name: string
  ) => {
    const {value} = e;
    updateUnit({idx, name, value: Number(value || 0)});
  };

  const handleClickUploadPhoto = (colorId: number) => {
    setUploadingPhotoColorId(colorId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangeUploadPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e?.target?.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagesFile([
        ...imagesFile,
        {colorId: uploadingPhotoColorId, file, previewUrl},
      ]);
      if (fileInputRef?.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (imagesFile.length > 0) {
      const filteredImagesFile = imagesFile.filter((imageFile) =>
        unitColors.find((unitColor) => imageFile.colorId === unitColor.colorId)
      );
      const isEqual =
        filteredImagesFile.length === imagesFile.length &&
        filteredImagesFile.every(
          (img, i) => img.colorId === imagesFile[i].colorId
        );

      if (!isEqual) {
        setImagesFile(filteredImagesFile);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitColors]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 4,
          gap: 1,
          flexDirection: {xs: "column", sm: "row"},
          alignItems: {xs: "start", sm: "center"},
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Buat Produk {categoryLabel}
        </Typography>
      </Box>
      <Sheet
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "60%",
          borderRadius: "0.5rem",
          p: 4,
          alignSelf: "center",
          boxShadow: "md",
          backgroundColor: "#f0f0f0",
        }}
      >
        <form onSubmit={handleSubmitForm} className="w-full">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <RadioGroupStyles onChange={handleChange} />
            <StyledInput
              label="Nama"
              value={formProduct.name}
              onChange={handleChange}
              name="name"
              placeholder="Masukkan nama produk..."
              required
            />
            <StyledTextarea
              label="Deskripsi"
              value={formProduct.description}
              onChange={handleChange}
              name="description"
              placeholder="Masukkan deskripsi produk..."
              required
            />
            <NumericFormatInput
              label="Harga"
              value={`${formProduct.price}`}
              onChange={handleChange}
              name="price"
              placeholder="Masukkan harga..."
              required
            />
            <Box sx={{mt: 1}}>
              <StyledButton
                startDecorator={<AddRounded />}
                onClick={handleAddUnit}
              >
                Varian
              </StyledButton>
            </Box>
            {units.map(({quantity, code, sizeId, colorId}, idx) => {
              const isDuplicated =
                duplicatedCodesIndex.findIndex(
                  (codes) => codes.findIndex((codeIdx) => codeIdx === idx) >= 0
                ) >= 0;
              return (
                <Stack
                  sx={{flexDirection: "row", alignItems: "center"}}
                  key={idx + 1}
                >
                  <Box sx={{flex: "auto"}} pr={2}>
                    <Typography sx={{mb: 1}}>
                      Kode produk: {code}{" "}
                      {isDuplicated ? (
                        <Typography color="danger">
                          produk terduplikasi
                        </Typography>
                      ) : null}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                      sx={{
                        borderRadius: "md",
                        border: "2px solid",
                        borderColor: isDuplicated ? "#C41C1C" : "#a1a1aa",
                      }}
                      p={1.5}
                    >
                      <InputNumber
                        required
                        label="Jumlah"
                        onChange={(e) => handleChangeUnitInput(idx, e)}
                        placeholder="Masukan jumlah..."
                        name="quantity"
                        value={`${quantity || ""}`}
                      />
                      <Select
                        options={sizes}
                        placeholder="Pilih ukuran"
                        required
                        label="Ukuran"
                        onChange={(e) =>
                          handleChangeUnitSelect(idx, e, "sizeId")
                        }
                        value={sizes.find((size) => size.value === sizeId)}
                      />

                      <SelectColors
                        colors={colors}
                        onChange={(e) =>
                          handleChangeUnitSelect(idx, e, "colorId")
                        }
                        value={colors.find((color) => color.value === colorId)}
                      />
                    </Stack>
                  </Box>
                  <Box>
                    <Button
                      color="danger"
                      sx={{px: 1}}
                      onClick={() => handleDeleteUnit(idx)}
                      disabled={units.length === 1}
                    >
                      <DeleteRounded />
                    </Button>
                  </Box>
                </Stack>
              );
            })}

            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              name="uploadPhoto"
              accept="image/*"
              onChange={handleChangeUploadPhoto}
            />

            {unitColors.length > 0
              ? unitColors.map(({colorId, label}) => {
                  const previews = imagesFile.filter(
                    (e) => e.colorId === colorId
                  );
                  return (
                    <FormControl key={colorId} size="lg" required>
                      <FormLabel>{label}</FormLabel>
                      <Grid container spacing={2}>
                        <Grid
                          md={4}
                          onClick={() => handleClickUploadPhoto(colorId)}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              paddingTop: "100%", // This creates a square by setting height equal to width
                              borderStyle: "dashed",
                              borderWidth: 4,
                              borderRadius: "0.5rem",
                              borderColor: "rgb(156 163 175)",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <AddPhotoAlternateRounded
                                sx={{fontSize: "6rem"}}
                              />
                              <Typography>Unggah foto</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        {previews.map(({previewUrl}) => (
                          <Grid key={previewUrl} md={4}>
                            <Image
                              src={previewUrl}
                              alt={previewUrl}
                              width={0}
                              height={0}
                              className="w-full h-full border-2 rounded-lg border-gray-400"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormControl>
                  );
                })
              : null}

            <StyledSubmitButton type="submit" disabled={disabledSubmit}>
              Submit
            </StyledSubmitButton>
          </Box>
        </form>
      </Sheet>
    </>
  );
};
export default CreateProductView;
