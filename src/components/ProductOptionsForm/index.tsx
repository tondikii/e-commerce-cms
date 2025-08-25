"use client";

import {Dispatch, SetStateAction, useState} from "react";
import {Box, Typography, Divider, IconButton, Stack, Card} from "@mui/joy";
import {AddRounded, CloseRounded} from "@mui/icons-material";
import {StyledButton, StyledInput, TextSecondary, Title} from "..";
import {ProductOptionType} from "@/types/product";

interface Props {
  options: ProductOptionType[];
  setOptions: Dispatch<SetStateAction<ProductOptionType[]>>;
}

const ProductOptionsForm: React.FC<Props> = ({options, setOptions}) => {
  const [newVariantInputs, setNewVariantInputs] = useState<{
    [key: number]: string;
  }>({});
  const [optionNameErrors, setOptionNameErrors] = useState<{
    [key: number]: string;
  }>({});
  const [variantErrors, setVariantErrors] = useState<{
    [key: number]: string;
  }>({});

  const addOption = () => {
    const newOptions = [...options, {name: "", variants: []}];
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setNewVariantInputs((prev) => {
      const newInputs = {...prev};
      delete newInputs[index];
      return newInputs;
    });
    setOptionNameErrors((prev) => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });
    setVariantErrors((prev) => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });
  };

  const checkDuplicateOptionName = (
    name: string,
    currentIndex: number
  ): boolean => {
    const trimmedName = name.trim().toLowerCase();
    return options.some(
      (option, index) =>
        index !== currentIndex &&
        option.name.trim().toLowerCase() === trimmedName
    );
  };

  const updateOptionName = (index: number, name: string) => {
    // Clear error when user starts typing
    setOptionNameErrors((prev) => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });

    // Check for duplicate only if name is not empty
    if (name.trim() && checkDuplicateOptionName(name, index)) {
      setOptionNameErrors((prev) => ({
        ...prev,
        [index]: "Nama pilihan sudah digunakan",
      }));
    }

    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index].name = name;
      return newOptions;
    });
  };

  const checkDuplicateVariant = (
    optionIndex: number,
    value: string
  ): boolean => {
    const trimmedValue = value.trim().toLowerCase();
    return options[optionIndex].variants.some(
      (variant) => variant.trim().toLowerCase() === trimmedValue
    );
  };

  const addOptionVariant = (optionIndex: number, value: string) => {
    if (!value || !value.trim()) return;

    const trimmedValue = value.trim();

    // Check for duplicate variant
    if (checkDuplicateVariant(optionIndex, trimmedValue)) {
      setVariantErrors((prev) => ({
        ...prev,
        [optionIndex]: "Varian sudah ada dalam pilihan ini",
      }));
      return;
    }

    // Clear variant error
    setVariantErrors((prev) => {
      const newErrors = {...prev};
      delete newErrors[optionIndex];
      return newErrors;
    });

    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[optionIndex].variants.push(trimmedValue);
      return newOptions;
    });

    setNewVariantInputs((prev) => ({...prev, [optionIndex]: ""}));
  };

  const removeOptionVariant = (optionIndex: number, variantIndex: number) => {
    setOptions((prev) => {
      return prev.map((option, i) => {
        if (i !== optionIndex) return option;

        return {
          ...option,
          variants: option.variants.filter((_, j) => j !== variantIndex),
        };
      });
    });
  };

  const handleVariantInputChange = (optionIndex: number, value: string) => {
    // Clear variant error when user starts typing
    setVariantErrors((prev) => {
      const newErrors = {...prev};
      delete newErrors[optionIndex];
      return newErrors;
    });

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

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>Pilihan</Title>
          <StyledButton
            startDecorator={<AddRounded />}
            onClick={addOption}
            size="sm"
          >
            Tambah Pilihan
          </StyledButton>
        </Box>
        <TextSecondary>
          Tentukan pilihan untuk produk, misalnya warna, ukuran, dll.
        </TextSecondary>
      </Stack>

      <Divider />

      {options.map((option, optionIndex) => (
        <Card key={optionIndex} variant="outlined" sx={{position: "relative"}}>
          <IconButton
            color="danger"
            size="sm"
            sx={{position: "absolute", top: 8, right: 8}}
            onClick={() => removeOption(optionIndex)}
          >
            <CloseRounded />
          </IconButton>

          <Stack spacing={2}>
            <Box>
              <StyledInput
                label="Nama Pilihan"
                value={option.name}
                onChange={(e) => updateOptionName(optionIndex, e.target.value)}
                placeholder="Warna, Ukuran, dll."
                maxLength={50}
                size="sm"
                required
                error={!!optionNameErrors[optionIndex]}
              />
              {optionNameErrors[optionIndex] && (
                <Typography level="body-xs" color="danger" sx={{mt: 0.5}}>
                  {optionNameErrors[optionIndex]}
                </Typography>
              )}
            </Box>

            <Box>
              <StyledInput
                label="Tambah Varian"
                value={newVariantInputs[optionIndex] || ""}
                onChange={(e) =>
                  handleVariantInputChange(optionIndex, e.target.value)
                }
                onKeyPress={(e) => handleVariantInputKeyPress(optionIndex, e)}
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
                required
                error={!!variantErrors[optionIndex]}
              />
              {variantErrors[optionIndex] && (
                <Typography level="body-xs" color="danger" sx={{mt: 0.5}}>
                  {variantErrors[optionIndex]}
                </Typography>
              )}
            </Box>

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

            {option.variants.length === 0 && (
              <Typography level="body-xs" color="danger">
                Minimal harus ada 1 varian
              </Typography>
            )}
          </Stack>
        </Card>
      ))}

      {options.length === 0 && (
        <Card variant="outlined" sx={{textAlign: "center", py: 3}}>
          <Typography level="body-sm" color="neutral" sx={{mb: 2}}>
            Belum ada pilihan yang ditambahkan
          </Typography>
          <StyledButton onClick={addOption} startDecorator={<AddRounded />}>
            Tambah Pilihan Pertama
          </StyledButton>
        </Card>
      )}
    </Stack>
  );
};

export default ProductOptionsForm;
