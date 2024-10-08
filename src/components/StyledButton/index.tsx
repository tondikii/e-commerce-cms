import {Button} from "@mui/joy";
import type {FC} from "react";

interface indexProps {
  children: string | React.ReactNode;
  size?: "lg" | "sm" | "md";
  startDecorator?: React.ReactNode;
}

const customSx = {
  "&:hover": {
    backgroundColor: "#212b36",
  },
  bgcolor: "#212b36",
  fontWeight: 700,
};

const index: FC<indexProps> = ({size = "md", startDecorator, children}) => {
  return (
    <Button sx={customSx} startDecorator={startDecorator} size={size}>
      {children}
    </Button>
  );
};
export default index;
