// components/UnitItem.tsx

"use client";

import {FC, ChangeEvent} from "react";
import {DeleteRounded} from "@mui/icons-material";
import {Box, Button, Stack, Typography} from "@mui/joy";
import {InputNumber, Select, SelectColors} from "@/components";
import {Option as SelectOption} from "@/components/Select";
import {ColourOption} from "@/types";
import {UnitInput} from "../types";
import {MESSAGES} from "../constants";

interface UnitItemProps {
  unit: UnitInput;
  index: number;
  sizes: {label: string; value: number}[];
  colors: ColourOption[];
  isDuplicate: boolean;
  canDelete: boolean;
  onInputChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (
    index: number,
    option: SelectOption,
    fieldName: string
  ) => void;
  onDelete: (index: number) => void;
}

const UnitItem: FC<UnitItemProps> = ({
  unit,
  index,
  sizes,
  colors,
  isDuplicate,
  canDelete,
  onInputChange,
  onSelectChange,
  onDelete,
}) => {
  const {quantity, code, sizeId, colorId} = unit;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box flex="auto">
        <Typography level="body-sm" mb={1}>
          Kode produk: {code}
          {isDuplicate && (
            <Typography color="danger" component="span" ml={1}>
              {MESSAGES.VALIDATION.DUPLICATE_CODE}
            </Typography>
          )}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          p={1.5}
          sx={{
            borderRadius: "md",
            border: "2px solid",
            borderColor: isDuplicate ? "danger.main" : "neutral.outlinedBorder",
            transition: "border-color 0.2s",
          }}
        >
          <InputNumber
            required
            label="Jumlah"
            onChange={(e) => onInputChange(index, e)}
            name="quantity"
            value={`${quantity}`}
          />
          <Select
            required
            label="Ukuran"
            options={sizes}
            onChange={(option) => onSelectChange(index, option, "sizeId")}
            value={sizes.find((s) => s.value === sizeId)}
          />
          <SelectColors
            colors={colors}
            onChange={(option) => onSelectChange(index, option, "colorId")}
            value={colors.find((c) => c.value === colorId)}
          />
        </Stack>
      </Box>
      <Button
        color="danger"
        variant="soft"
        size="sm"
        onClick={() => onDelete(index)}
        disabled={!canDelete}
        sx={{
          minWidth: "auto",
          px: 1,
          transition: "all 0.2s",
          "&:hover:not(:disabled)": {
            transform: "scale(1.05)",
          },
        }}
      >
        <DeleteRounded />
      </Button>
    </Stack>
  );
};

export default UnitItem;
