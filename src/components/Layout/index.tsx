"use client";

import {useEffect, useState, type FC, type ReactNode} from "react";
import Box from "@mui/joy/Box";

import {Sidebar} from "@/components";
import {SessionType} from "@/types";
import {usePathname} from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import Header from "./components/Header";
import Swal from "sweetalert2";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({children}) => {
  const session: SessionType = useSession()?.data;
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const {isConfirmed} = await Swal.fire({
      title: "Apakah anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#171a1c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
    });
    if (isConfirmed) {
      signOut({
        callbackUrl: "/sign-in",
      });
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <Box sx={{display: "flex", minHeight: "100dvh"}}>
      <Sidebar
        session={session}
        handleSignOut={handleSignOut}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          ml: {xs: 0, md: "260px"},
          width: {xs: "100%", md: "calc(100% - 260px)"},
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header
          session={session}
          handleSignOut={handleSignOut}
          onMenuClick={toggleSidebar}
          showMenuButton={true}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default Layout;
