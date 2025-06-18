import * as React from "react";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {FormControl} from "..";
import {SxProps} from "@mui/material";

interface CustomProps {
  onChange: (event: {target: {name: string; value: string}}) => void;
  name: string;
}

const NumericFormatAdapter = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatAdapter(props, ref) {
    const {onChange, ...other} = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="Rp"
      />
    );
  }
);

const customSx = {
  "--Input-focusedInset": "var(--any, )",
  "--Input-focusedThickness": "0rem",
  "&::before": {
    transition: "box-shadow .15s ease-in-out",
  },
  "&:focus-within": {
    borderColor: "#212b36",
  },
};

interface Props {
  label?: string;
  errorMessage?: string;
  size?: "lg" | "sm" | "md";
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  sx?: SxProps;
}

const NumericFormatInput: React.FC<Props> = ({
  label,
  errorMessage,
  size,
  required,
  value,
  onChange,
  name,
  placeholder,
  sx = customSx,
}) => {
  return (
    <FormControl
      label={label}
      errorMessage={errorMessage}
      size={size}
      required={required}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        slotProps={{
          input: {
            component: NumericFormatAdapter,
          },
        }}
        name={name}
        sx={sx}
      />
    </FormControl>
  );
};
export default NumericFormatInput;
