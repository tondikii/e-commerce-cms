// components/ImageUploadSection.tsx

"use client";

import {FC} from "react";
import {AddPhotoAlternateRounded} from "@mui/icons-material";
import {Box, FormControl, FormLabel, Grid, Typography} from "@mui/joy";
import Image from "next/image";
import {ImageInput} from "../types";
import {MESSAGES} from "../constants";

interface ImageUploadSectionProps {
  colorId: number;
  label: string;
  images: ImageInput[];
  onUploadClick: (colorId: number) => void;
}

const ImageUploadSection: FC<ImageUploadSectionProps> = ({
  colorId,
  label,
  images,
  onUploadClick,
}) => {
  const colorImages = images.filter((img) => img.colorId === colorId);

  return (
    <FormControl size="lg" required>
      <FormLabel>{label}</FormLabel>
      <Grid container spacing={2}>
        {/* Upload Button */}
        <Grid xs={12} md={4}>
          <Box
            onClick={() => onUploadClick(colorId)}
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              border: "4px dashed",
              borderColor: "neutral.outlinedBorder",
              borderRadius: "md",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "primary.50",
                transform: "scale(1.02)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AddPhotoAlternateRounded
                sx={{
                  fontSize: "3rem",
                  color: "text.secondary",
                  transition: "color 0.3s ease",
                }}
              />
              <Typography level="body-sm" color="neutral">
                {MESSAGES.VALIDATION.UPLOAD_PHOTO}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Image Previews */}
        {colorImages.map(({url, previewUrl}, imgIndex) => (
          <Grid key={`${colorId}-${imgIndex}`} xs={12} md={4}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                overflow: "hidden",
                borderRadius: "md",
                border: "2px solid",
                borderColor: "neutral.outlinedBorder",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "md",
                },
              }}
            >
              <Image
                src={url || previewUrl || ""}
                alt={`Preview ${label} ${imgIndex + 1}`}
                fill
                style={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
};

export default ImageUploadSection;
