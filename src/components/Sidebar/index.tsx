"use client";
import {useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import {MenusType} from "@/types";
import {usePathname} from "next/navigation";
import Menu from "./components/Menu";
import StoreName from "../StoreLogo";
import Link from "next/link";
import {Stack} from "@mui/joy";
import Image from "next/image";
import {StoreLogo} from "..";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({open = true, onClose}) => {
  const pathname: string = usePathname();
  const [selectedMenuRoute, setSelectedMenuRoute] = useState<string>("");

  const menus: MenusType = [
    {label: "Home", route: "/", icon: <HomeRoundedIcon />},
    {
      label: "Produk",
      route: "/products",
      icon: <DashboardRoundedIcon />,
      child: [
        {label: "Kategori", route: "/categories"},
        {label: "Koleksi", route: "/collections"},
      ].map(({route, label}) => ({
        label,
        route: `/products${route}`,
      })),
    },
  ];

  useEffect(() => {
    const excludedRoute = "/";
    if (pathname === excludedRoute && selectedMenuRoute !== excludedRoute) {
      setSelectedMenuRoute(excludedRoute);
    } else if (pathname === excludedRoute) {
      return;
    }

    for (let i = 0; i < menus.length; i++) {
      let newSelectedMenuRoute = "";

      const {child = [], route} = menus[i];
      if (child?.length > 0) {
        for (let j = 0; j < child?.length; j++) {
          const menuChildRoute = child?.[j].route || "";
          const isMenuChildSelected =
            menuChildRoute !== excludedRoute &&
            pathname.startsWith(menuChildRoute);
          if (isMenuChildSelected) {
            newSelectedMenuRoute = menuChildRoute;
            break;
          }
        }
      }

      const isMenuSelected =
        !newSelectedMenuRoute &&
        route !== excludedRoute &&
        pathname.startsWith(route);
      if (isMenuSelected) {
        newSelectedMenuRoute = route;
      }

      if (newSelectedMenuRoute) {
        setSelectedMenuRoute(newSelectedMenuRoute);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1199,
            display: {xs: "block", md: "none"},
          }}
          onClick={onClose}
        />
      )}

      <Sheet
        className="Sidebar"
        sx={{
          position: "fixed",
          zIndex: 1200,
          height: "100vh",
          width: "260px",
          top: 0,
          left: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.surface",
          boxShadow: "sm",
          transform: {
            xs: open ? "translateX(0)" : "translateX(-100%)",
            md: "translateX(0)",
          },
          transition: "transform 0.3s ease",
        }}
      >
        <Link href="/" style={{alignSelf: "center"}}>
          <StoreLogo />
        </Link>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <List
            size="sm"
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              "--ListItem-radius": "8px",
              "--List-gap": "6px",
            }}
          >
            {menus.map((menu) => (
              <Menu
                key={menu.label}
                pathname={pathname}
                menu={menu}
                selectedMenuRoute={selectedMenuRoute}
              />
            ))}
          </List>
        </Box>
      </Sheet>
    </>
  );
};

export default Sidebar;
