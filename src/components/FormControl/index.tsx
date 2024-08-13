import {InfoOutlined} from "@mui/icons-material";
import {
  FormControl as FormControlMui,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
import type {FC} from "react";

interface Props {
  label?: string;
  children: React.ReactNode;
  errorMessage?: string;
  size?: "lg" | "sm" | "md";
}

const FormControl: FC<Props> = ({
  label,
  children,
  errorMessage,
  size = "md",
}) => {

  return (
    <FormControlMui
      sx={{marginTop: "1rem", flex: 1}}
      error={Boolean(errorMessage)}
      size={size}
    >
      {label ? <FormLabel>{label}</FormLabel> : null}
      {children}
      {errorMessage ? (
        <FormHelperText>
          <InfoOutlined />
          {errorMessage}
        </FormHelperText>
      ) : null}
    </FormControlMui>
  );
};

export default FormControl;
