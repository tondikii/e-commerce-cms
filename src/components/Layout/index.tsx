"use client";

import type {FC, ReactNode} from "react";
import {CssVarsProvider} from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import {Sidebar, Header} from "@/components";
import {SessionType} from "@/types";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";

interface Props {
  // session: SessionType;
  children: ReactNode;
}

const Layout: FC<Props> = ({children}) => {
  const session: SessionType = useSession()?.data;

  const pathname = usePathname();
  if (pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{display: "flex", minHeight: "100dvh"}}>
        <Header />
        <Sidebar session={session} />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: {xs: 2, md: 6},
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: {xs: 2, sm: 2, md: 3},
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </CssVarsProvider>
  );
};
export default Layout;
