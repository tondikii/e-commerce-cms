"use client";
import {useEffect, useState, useCallback, type FC, ChangeEvent} from "react";
import {Box, Card, Stack, Table, FormControl, Chip, Divider} from "@mui/joy";
import {
  Title,
  TextSecondary,
  ProductOptionsForm,
  NumericFormatInput,
  InputNumber,
} from "@/components";
import {
  ProductOptionType,
  ProductVariantFormType,
  ProductVariantType,
} from "@/types/product";
import {INITIAL_FORM_PRODUCT_OPTIONS} from "@/constants";

interface Props {
  initialData: ProductVariantFormType;
  onChange?: (data: ProductVariantFormType, isCompleted: boolean) => void;
}

const ProductVariantForm: FC<Props> = ({initialData, onChange}) => {
  const [variants, setVariants] = useState<ProductVariantType[]>(
    initialData.variants || []
  );
  const [options, setOptions] = useState<ProductOptionType[]>(
    initialData.options || INITIAL_FORM_PRODUCT_OPTIONS
  );

  const generateVariants = useCallback(
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

      return combinations.map((opts) => {
        const existingVariant = initialData.variants.find(
          (v) => JSON.stringify(v.combinations) === JSON.stringify(opts)
        );
        return {
          price: existingVariant?.price || 0,
          stock: existingVariant?.stock || 0,
          combinations: opts,
        };
      });
    },
    [initialData]
  );

  useEffect(() => {
    const newVariants = generateVariants(options);
    setVariants(newVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (onChange) {
      const isCompletedVariants =
        variants.length > 0 &&
        variants.every((v) => v.price > 0 && v.stock > 0);

      const isCompletedOptions =
        options.length > 0 &&
        options.every(
          (option) => option.name.trim() && option.variants.length > 0
        );
      onChange({variants, options}, isCompletedVariants && isCompletedOptions);
    }
  }, [variants, options, onChange]);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const {target} = e;
    const value = Number(target.value);
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? {...v, [target.name]: value} : v))
    );
  };

  return (
    <Stack spacing={4}>
      <ProductOptionsForm options={options} setOptions={setOptions} />

      <Divider />

      {variants.length > 0 && (
        <>
          <Box>
            <Title>Harga dan Stok Varian</Title>
            <TextSecondary>
              Atur harga dan stok untuk setiap kombinasi varian
            </TextSecondary>
          </Box>

          <Card variant="outlined" sx={{overflow: "auto"}}>
            <Table borderAxis="both" sx={{minWidth: 600}}>
              <thead>
                <tr>
                  <th style={{width: "20%", padding: "12px"}}>Harga</th>
                  <th style={{width: "15%", padding: "12px"}}>Stok</th>
                  <th style={{width: "30%", padding: "12px"}}>
                    Kombinasi Varian
                  </th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={index}>
                    <td style={{padding: "12px"}}>
                      <NumericFormatInput
                        label="Harga"
                        value={`${variant.price || ""}`}
                        onChange={(e) => handleFormChange(e, index)}
                        name="price"
                        required
                        placeholder="Rp199,000"
                        size="sm"
                      />
                    </td>
                    <td style={{padding: "12px"}}>
                      <FormControl size="sm">
                        <InputNumber
                          required
                          label="Jumlah"
                          onChange={(e) => handleFormChange(e, index)}
                          name="stock"
                          value={`${variant.stock || ""}`}
                          size="sm"
                          placeholder="10"
                        />
                      </FormControl>
                    </td>
                    <td style={{padding: "12px"}}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {variant?.combinations
                          ? Object.entries(variant.combinations).map(
                              ([key, value]) => (
                                <Chip
                                  key={`${key}-${value}`}
                                  size="sm"
                                  variant="outlined"
                                >
                                  {key}: {value}
                                </Chip>
                              )
                            )
                          : null}
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </Stack>
  );
};

export default ProductVariantForm;
