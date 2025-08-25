import type {FC} from "react";
import Text, {TextProps} from "../Text";

const customSx = {color: "var(--joy-palette-neutral-500)"};

const TextSecondary: FC<TextProps> = ({level = "body-sm", ...textProps}) => {
  return <Text level={level} sx={{...customSx, ...textProps}} {...textProps} />;
};

export default TextSecondary;
