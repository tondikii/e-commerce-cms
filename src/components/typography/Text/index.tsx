import type {FC, ReactNode} from "react";
import {Typography, TypographyProps} from "@mui/joy";

export interface TextProps extends TypographyProps {
  children: string | ReactNode;
}

const customSx = {color: "var(--joy-palette-text-primary)"};

const Text: FC<TextProps> = ({
  children,
  level = "body-sm",
  ...props // Nama yang lebih spesifik
}) => {
  return (
    <Typography sx={{...customSx, ...props.sx}} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
