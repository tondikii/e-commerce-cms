"use client";
import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card, Typography, Box, IconButton, Sheet, Stack} from "@mui/joy";
import {
  CloudUploadRounded,
  CloseRounded,
  WarningRounded,
} from "@mui/icons-material";
import {createPreviewUrl} from "../ProductForm/utils";
import Image from "next/image";
import {MAX_FILE_SIZE} from "@/constants";
import {formatFileSize} from "@/utils";

interface FileWithPreview extends File {
  preview: string;
}

interface ImageUploadProps {
  initialFiles?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialFiles = [],
  onChange,
  maxFiles = 5,
  maxSize = MAX_FILE_SIZE,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<
    {file: File; reason: string}[]
  >([]);

  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    const validFiles: FileWithPreview[] = [];
    const rejected: {file: File; reason: string}[] = [];

    acceptedFiles.forEach((file) => {
      if (file.size > maxSize) {
        rejected.push({
          file,
          reason: `Ukuran file melebihi ${formatFileSize(maxSize)}`,
        });
      } else if (files.length + validFiles.length >= maxFiles) {
        rejected.push({
          file,
          reason: `Hanya boleh upload maksimal ${maxFiles} file`,
        });
      } else {
        validFiles.push(
          Object.assign(file, {preview: URL.createObjectURL(file)})
        );
      }
    });

    fileRejections.forEach(({file, errors}: any) => {
      errors.forEach((e: any) => {
        rejected.push({file, reason: e.message});
      });
    });

    setFiles((prev) => {
      const updatedFiles = [...prev, ...validFiles].slice(0, maxFiles);
      return updatedFiles;
    });

    setRejectedFiles((prev) => [...prev, ...rejected]);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      const updatedFiles = prev.filter((_, i) => i !== index);
      return updatedFiles;
    });
  };

  const removeRejectedFile = (index: number) => {
    setRejectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (initialFiles.length > 0 && files.length === 0) {
      const initialFilesWithPreview = initialFiles.map((file) =>
        Object.assign(file, {preview: URL.createObjectURL(file)})
      );
      setFiles(initialFilesWithPreview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiles]); // Hanya initialFiles sebagai dependency

  useEffect(() => {
    if (onChange) {
      onChange(files);
    }

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <Box>
      <Typography level="body-xs" sx={{mb: 1}}>
        Gambar{" "}
        <Typography level="body-xs" sx={{color: "#C41C1C"}}>
          *
        </Typography>
      </Typography>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Card
          variant="outlined"
          sx={{
            cursor: "pointer",
            transition: "all 0.2s",
            backgroundColor: isDragActive ? "primary.50" : "neutral.50",
            border: "2px dashed",
            borderColor: isDragActive ? "primary.300" : "neutral.300",
            py: 3,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack sx={{alignItems: "center"}}>
            <Stack direction="row" spacing={0.5} sx={{alignItems: "center"}}>
              <CloudUploadRounded
                sx={{
                  color: isDragActive
                    ? "primary.500"
                    : "var(--joy-palette-neutral-500)",
                  fontWeight: 600,
                }}
              />
              <Typography
                level="body-sm"
                sx={{
                  color: "var(--joy-palette-neutral-500)",
                  fontWeight: 600,
                }}
              >
                Upload Gambar
              </Typography>
            </Stack>

            <Typography
              level="body-sm"
              sx={{color: "var(--joy-palette-neutral-400)"}}
            >
              Drag & drop atau klik untuk pilih file.
            </Typography>
            <Typography level="body-xs" sx={{color: "neutral.400", mt: 0.5}}>
              Maksimal {maxFiles} file, ukuran ≤ {formatFileSize(maxSize)}
            </Typography>
          </Stack>
        </Card>
      </div>

      {/* File yang diterima */}
      {files.length > 0 && (
        <Box>
          {files.map((file, index) => {
            const previewUrl = createPreviewUrl(file);
            return (
              <Sheet
                key={file.name + index}
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "md",
                  mb: 1,
                  gap: 1.5,
                  backgroundColor: "neutral.50",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 60,
                    height: 60,
                    flexShrink: 0,
                    borderRadius: "sm",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="3.75rem"
                  />
                </Box>

                <Box sx={{flexGrow: 1, minWidth: 0}}>
                  <Typography level="body-sm" sx={{fontWeight: "md"}}>
                    {file.name}
                  </Typography>
                  <Typography level="body-xs" sx={{color: "text.tertiary"}}>
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>

                <IconButton
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={() => removeFile(index)}
                  sx={{"&:hover": {backgroundColor: "transparent"}}}
                >
                  <CloseRounded />
                </IconButton>
              </Sheet>
            );
          })}
        </Box>
      )}

      {/* File yang ditolak */}
      {rejectedFiles.length > 0 && (
        <Box sx={{mt: 2}}>
          {rejectedFiles.map(({file, reason}, idx) => (
            <Sheet
              key={file.name + idx}
              variant="soft"
              color="danger"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                borderRadius: "md",
                mb: 1,
                gap: 1.5,
              }}
            >
              <WarningRounded color="error" />
              <Box sx={{flexGrow: 1, minWidth: 0}}>
                <Typography level="body-sm" sx={{fontWeight: "md"}}>
                  {file.name}
                </Typography>
                <Typography level="body-xs" sx={{color: "danger.plainColor"}}>
                  {reason}
                </Typography>
              </Box>
              <IconButton
                size="sm"
                variant="plain"
                color="danger"
                onClick={() => removeRejectedFile(idx)}
                sx={{"&:hover": {backgroundColor: "transparent"}}}
              >
                <CloseRounded />
              </IconButton>
            </Sheet>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
