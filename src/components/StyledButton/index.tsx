import {Button} from "@mui/joy";
import type {FC} from "react";

interface indexProps {
  children: string | React.ReactNode;
  size?: "lg" | "sm" | "md";
  startDecorator?: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "soft" | "outlined" | "plain";
}

const customSx = {
  "&:hover": {
    backgroundColor: "#212b36",
  },
  bgcolor: "#212b36",
  fontWeight: 700,
  color: "#ffffff",
};

const index: FC<indexProps> = ({
  size = "md",
  startDecorator,
  children,
  onClick = () => {},
  variant = "solid",
}) => {
  return (
    <Button
      sx={customSx}
      startDecorator={startDecorator}
      size={size}
      onClick={onClick}
      variant={variant}
    >
      {children}
    </Button>
  );
};
export default index;
