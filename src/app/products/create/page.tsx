"use client";
import {useState, useCallback, type FC, useEffect} from "react";
import {
  Box,
  Button,
  Stack,
  Step,
  StepIndicator,
  Stepper,
  Typography,
} from "@mui/joy";
import {ProductDetailForm, ProductVariantForm} from "@/components";
import {KeyboardArrowRight, KeyboardArrowLeft} from "@mui/icons-material";
import {
  INITIAL_FORM_PRODUCT_DETAIL,
  INITIAL_FORM_PRODUCT_OPTIONS,
} from "@/constants";
import {api} from "@/lib/axios";
import {handleFileUpload} from "@/utils";
import {ProductDetailType, ProductVariantFormType} from "@/types/product";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";

interface Props {}

const CreateProductPage: FC<Props> = () => {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [productDetail, setProductDetail] = useState<{
    data: ProductDetailType;
    isCompleted: boolean;
  }>({data: INITIAL_FORM_PRODUCT_DETAIL, isCompleted: false});
  const [productVariants, setProductVariants] = useState<{
    data: ProductVariantFormType;
    isCompleted: boolean;
  }>({
    data: {options: INITIAL_FORM_PRODUCT_OPTIONS, variants: []},
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      label: "Detail",
      completed: productDetail.isCompleted,
    },
    {
      label: "Varian",
      completed: productVariants.isCompleted,
    },
  ];

  const handleChangeProductDetail = useCallback(
    (data: ProductDetailType, isCompleted: boolean) => {
      setProductDetail({data, isCompleted});
    },
    []
  );

  const handleChangeProductVariants = useCallback(
    (data: ProductVariantFormType, isCompleted: boolean) => {
      setProductVariants({data, isCompleted});
    },
    []
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uploadedImages = await Promise.all(
        productDetail.data.images.map(
          async (file) => await handleFileUpload(file)
        )
      );

      await api.post("/products", {
        product: {
          name: productDetail.data.name,
          description: productDetail.data.description,
          images: uploadedImages,
        },
        variants: productVariants.data.variants.map((variant) => ({
          price: variant.price,
          stock: variant.stock,
          optionValues: variant.combinations,
        })),
      });

      setLoading(false);

      await Swal.fire({
        title: "Berhasil",
        text: `Produk ${productDetail.data.name} berhasil dibuat`,
        icon: "success",
      });
      router.back();
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat membuat produk",
        icon: "error",
      });
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={4} sx={{width: "80%", mx: "auto", flex: 1, py: 4}}>
        <Stepper sx={{gap: 2}}>
          {steps.map((step, index) => (
            <Step
              key={step.label}
              sx={{
                flex: 1,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  width: "20px",
                  height: "2px",
                  bgcolor:
                    index < activeStep
                      ? "primary.500"
                      : step.completed
                      ? "primary.200"
                      : "neutral.200",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                },
                "&:last-child::after": {display: "none"},
              }}
            >
              <StepIndicator
                variant={activeStep === index ? "solid" : "outlined"}
                color={
                  activeStep === index
                    ? "primary"
                    : step.completed
                    ? "primary"
                    : "neutral"
                }
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: "sm",
                  fontWeight: "lg",
                  ...(activeStep === index && {boxShadow: "sm"}),
                }}
              >
                {index + 1}
              </StepIndicator>

              <Box sx={{textAlign: "center", mt: 1}}>
                <Typography
                  level="body-sm"
                  sx={{
                    fontWeight: activeStep === index ? "lg" : "md",
                    color:
                      activeStep === index ? "primary.700" : "text.primary",
                  }}
                >
                  {step.label}
                </Typography>
                {step.completed && (
                  <Typography level="body-xs" color="success">
                    ✓ Selesai
                  </Typography>
                )}
              </Box>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <ProductDetailForm
            initialData={productDetail.data}
            onChange={handleChangeProductDetail}
          />
        ) : (
          <ProductVariantForm
            onChange={handleChangeProductVariants}
            initialData={productVariants.data}
          />
        )}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          width: "100%",
          pt: 3,
          backgroundColor: "background.body",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeft />}
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{minWidth: 120}}
        >
          Kembali
        </Button>

        <Button
          variant="solid"
          color="primary"
          endDecorator={<KeyboardArrowRight />}
          onClick={handleNext}
          disabled={activeStep < steps.length && !steps[activeStep].completed}
          sx={{minWidth: 140}}
          loading={loading}
        >
          {activeStep === steps.length - 1 ? "Selesai" : "Selanjutnya"}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateProductPage;
