import type {FC} from "react";
import {TextProps} from "../Text";
import Title from "../Title";

const Subtitle: FC<TextProps> = ({level = "title-lg", sx = {}, ...props}) => {
  return <Title level={level} sx={sx} {...props} />;
};

export default Subtitle;
