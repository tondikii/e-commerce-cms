"use client";

import {useEffect, useState, type FC, type ReactNode} from "react";
import {CssVarsProvider} from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import {Sidebar} from "@/components";
import {SessionType} from "@/types";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";
import {Header} from "./components";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({children}) => {
  const session: SessionType = useSession()?.data;

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // atau return loading state
  }

  if (pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <Box sx={{display: "flex", minHeight: "100dvh", flexDirection: "row"}}>
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
          minHeight: "100dvh",
          gap: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default Layout;
