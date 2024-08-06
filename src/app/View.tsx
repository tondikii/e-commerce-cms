"use client";

import {FC} from "react";
import {SessionType} from "@/types";
import Image from "next/image";
import {Typography} from "@mui/joy";
interface Props {
  session: SessionType;
}

// eslint-disable-next-line @next/next/no-async-client-component
const HomePageComponent: FC<Props> = async ({session}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Image
        src="/Teamwork.svg"
        alt="Illustration developer"
        priority
        className="w-3/4 md:1/2 lg:w-2/5 mb-4"
        width={0}
        height={0}
      />
      <Typography level="title-lg" color="neutral">
        Selamat bekerja {session?.user?.name}
      </Typography>
    </div>
  );
};

export default HomePageComponent;
