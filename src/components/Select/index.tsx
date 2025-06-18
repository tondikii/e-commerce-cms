"use client";
import React, {FC} from "react";

import Select, {ActionMeta, StylesConfig} from "react-select";
import {FormControl} from "..";

export interface Option {
  label: string;
  value: string | number;
}
interface Props {
  options: Option[];
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  styles?: StylesConfig<any>;
  label?: string;
  errorMessage?: string;
  size?: "lg" | "sm" | "md";
  required?: boolean;
  onChange?: (newValue: Option) => void;
  value?: Option;
}

const SelectComponent: FC<Props> = ({
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
      <Select {...props} />
    </FormControl>
  );
};
export default SelectComponent;
