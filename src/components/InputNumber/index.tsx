import type {FC} from "react";
import {FormControl} from "..";

interface Props {
  label?: string;
  errorMessage?: string;
  size?: "lg" | "sm" | "md";
  required?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
}

const InputNumber: FC<Props> = ({
  label,
  errorMessage,
  size,
  required,
  ...props
}) => {
  return (
    <FormControl
      label={label}
      errorMessage={errorMessage}
      size={size}
      required={required}
    >
      <input type="number" className="p-1.5 rounded-md border-2" {...props} />
    </FormControl>
  );
};
export default InputNumber;
