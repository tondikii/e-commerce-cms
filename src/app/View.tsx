"use client";

import {FC} from "react";
import {SessionType} from "@/types";
import Image from "next/image";
import {Typography} from "@mui/joy";
interface Props {
  session: SessionType;
}

// eslint-disable-next-line @next/next/no-async-client-component
const HomePageComponent: FC<Props> = ({session}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Image
        src="/working.svg"
        alt="Selamat bekerja"
        priority
        className="w-3/4 md:1/2 lg:w-2/5 mb-4"
        width={0}
        height={0}
      />
      <Typography level="title-lg" color="neutral" sx={{marginBottom: 8}}>
        Selamat bekerja {session?.user?.name}, Semoga harimu menyenangkan!
      </Typography>
    </div>
  );
};

export default HomePageComponent;
