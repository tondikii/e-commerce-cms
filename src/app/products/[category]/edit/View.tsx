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
import {useMemo, useRef, useState, type FC} from "react";
import {ColourOption} from "@/types";
import useMasterData from "@/store/useMasterData";

interface ProductUnitInput {
  code: string;
  quantity: number;
  sizeId: number;
  colorId: number;
}

interface ProductImageInput {
  colorId: number;
  file: File | null;
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

const initialImage = {
  colorId: 0,
  file: null,
};

const initialFormProduct: FormProduct = {
  styleId: 0,
  name: "",
  description: "",
  price: "",
};

interface Props {
  initialProduct: {
    name: string;
    description: string;
    price: string;
    styleId: number;
    units: {code: string; quantity: number; sizeId: number; colorId: number}[];
    images: {colorId: number; file: File | null}[];
  };
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
}

const CreateProductView: FC<Props> = ({initialProduct, sizes, colors}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {category}: {category: string} = useParams();
  const {id: categoryId, name: categoryLabel}: {id: number; name: string} =
    useMasterData().categories.find((e) => e.route === category) || {
      id: 0,
      name: "",
    };

  // Set initial form values based on product data
  const [formProduct, setFormProduct] = useState(initialProduct);
  const [units, setUnits] = useState<ProductUnitInput[]>(initialProduct.units);
  const [imagesFile, setImagesFile] = useState<ProductImageInput[]>(
    initialProduct.images
  );

  const isCompletedProduct = useMemo(() => {
    let isCompleted = true;
    Object.keys(formProduct).forEach((key: string) => {
      const value = formProduct[key as keyof typeof initialProduct];
      if (!value) {
        isCompleted = false;
      }
    });
    return isCompleted;
  }, [formProduct]);

  const {isCompletedUnits, unitColors, duplicatedCodesIndex} = useMemo(() => {
    let isCompleted = true;
    const unitColors: {colorId: number; label: string}[] = [];
    const unitCodes: string[] = [];
    const duplicatedCodesIndex: number[][] = [];
    units.forEach((unit, idx: number) => {
      Object.keys(unit).forEach((keyValue: string) => {
        const valueUnit =
          unit[keyValue as keyof (typeof initialProduct.units)[0]];
        if (!valueUnit && keyValue !== "productId") {
          isCompleted = false;
        }
      });
      const isNewUnitColor = !unitColors.find(
        ({colorId}) => colorId === unit.colorId
      );
      if (isNewUnitColor) {
        const unitColor = colors.find(({value}) => value === unit.colorId);
        if (unitColor) {
          unitColors.push({colorId: unitColor.value, label: unitColor.label});
        }
      }
      const foundDuplicatedIndex = unitCodes.findIndex(
        (code) => code === unit.code
      );
      if (foundDuplicatedIndex >= 0) {
        duplicatedCodesIndex.push([foundDuplicatedIndex, idx]);
        isCompleted = false;
      }
      unitCodes.push(unit.code);
    });

    return {isCompletedUnits: isCompleted, unitColors, duplicatedCodesIndex};
  }, [units, colors, initialProduct]);

  const disabledSubmit = !isCompletedProduct || !isCompletedUnits;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
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

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add logic to send updated product data to API
  };

  const handleAddUnit = () => {
    setUnits([...units, {code: "S/C", quantity: 0, sizeId: 0, colorId: 0}]);
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
    e: React.ChangeEvent<HTMLInputElement>
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

  const handleClickUploadPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 4,
          gap: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontSize="xl2" fontWeight="lg">
          Edit {categoryLabel}
        </Typography>
      </Box>
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
                      onChange={(e) => handleChangeUnitSelect(idx, e, "sizeId")}
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
          />

          {unitColors.length > 0
            ? unitColors.map(({colorId, label}) => (
                <FormControl key={colorId} size="lg" required>
                  <FormLabel>{label}</FormLabel>
                  <Grid container spacing={2} onClick={handleClickUploadPhoto}>
                    {[1].map((num) => (
                      <Grid key={num} md={4}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "100%", // This creates a square by setting height equal to width
                            borderStyle: "dashed",
                            borderWidth: 4,
                            borderRadius: "0.5rem",
                            borderColor: "#a1a1aa",
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
                            <AddPhotoAlternateRounded sx={{fontSize: "6rem"}} />
                            <Typography>Unggah foto</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </FormControl>
              ))
            : null}

          <StyledSubmitButton type="submit" disabled={disabledSubmit}>
            Submit
          </StyledSubmitButton>
        </Box>
      </form>
    </>
  );
};

export default CreateProductView;
