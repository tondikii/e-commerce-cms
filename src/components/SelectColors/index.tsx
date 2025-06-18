import type {FC} from "react";
import Select, {Option as SelectOption} from "../Select";
import {ColourOption} from "@/types";
import {StylesConfig} from "react-select";
import chroma from "chroma-js";

interface Props {
  colors: ColourOption[];
  onChange?: (newValue: SelectOption) => void;
  value?: SelectOption;
}

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({...styles, backgroundColor: "white"}),
  option: (styles, {data, isDisabled, isFocused, isSelected}) => {
    const color = chroma(data.color);

    return {
      ...styles,
      backgroundColor: isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  input: (styles) => ({...styles, ...dot()}),
  placeholder: (styles) => ({...styles, ...dot("#ccc")}),
  singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
};

const index: FC<Props> = ({colors, ...props}) => {
  return (
    <Select
      options={colors}
      placeholder="Pilih warna"
      required
      label="Warna"
      styles={colourStyles}
      {...props}
    />
  );
};
export default index;
