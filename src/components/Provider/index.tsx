"use client";

import {CssBaseline, CssVarsProvider} from "@mui/joy";
import {SessionProvider} from "next-auth/react";
import type {FC, ReactNode} from "react";

interface Props {
  children: ReactNode;
}

const Provider: FC<Props> = ({children}) => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <SessionProvider>{children}</SessionProvider>
    </CssVarsProvider>
  );
};
export default Provider;
