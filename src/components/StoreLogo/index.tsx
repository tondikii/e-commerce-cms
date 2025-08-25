import type {FC, ReactNode} from "react";
import Title from "../typography/Title";
import {SxProps} from "@mui/joy/styles/types";
import {Staatliches} from "next/font/google";
import {Stack} from "@mui/joy";
import Image from "next/image";

const staatliches = Staatliches({
  subsets: ["latin"],
  weight: "400", // Staatliches hanya punya 400
});

interface Props {
  level?: "h1" | "h2" | "h3" | "h4"; // restrict only to valid heading level
  sx?: SxProps;
}

const StoreLogo: FC<Props> = ({level = "h3", sx}) => {
  return (
    <Stack spacing={0} sx={{flexDirection: "row", alignItems: "center"}}>
      <Image
        src="/rumah_fashion.svg"
        alt="Logo RUMAH FASHION"
        width={50}
        height={50}
      />
      <Title
        className={staatliches.className}
        sx={{
          fontFamily: "Staatliches, sans-serif",
          fontWeight: 400,
          mt: 1,
          ...sx,
        }}
        level={level}
      >
        RUMAH FASHION
      </Title>
    </Stack>
  );
};
export default StoreLogo;
