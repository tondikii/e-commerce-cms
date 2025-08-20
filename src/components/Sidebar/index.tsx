"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {MenusType, MenuType, SessionType, UserType} from "@/types";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";

interface MenuProps {
  pathname: string;
  menu: MenuType;
}

const Menu: React.FC<MenuProps> = ({pathname, menu}) => {
  const {label, child = [], route} = menu;
  const nested = Boolean(Array.isArray(child) && child.length > 0);
  const isOpened = pathname.includes(route) && nested;

  const renderMenu = (menuItem: MenuType, isChild = false) => {
    const isSelectedChild = pathname === menuItem.route;
    const hasChildren =
      Array.isArray(menuItem.child) && menuItem.child.length > 0;

    const renderIcon = () => {
      if (React.isValidElement<{sx?: object}>(menuItem?.icon)) {
        return React.cloneElement(menuItem?.icon, {
          sx: {
            color: isSelectedChild
              ? "var(--joy-palette-primary-500)"
              : "var(--joy-palette-neutral-500)",
            transition: "color 0.2s",
          },
        });
      }
      return null;
    };

    return (
      <ListItemButton
        key={menuItem.route}
        selected={isSelectedChild}
        component={motion.div}
        whileHover={{scale: 1.02}}
        sx={{
          mt: isChild ? 0.5 : 0,
          borderRadius: "md",
          px: 2,
          backgroundColor: isSelectedChild
            ? "var(--joy-palette-primary-50)"
            : "transparent",
          "&:hover": {
            backgroundColor: isSelectedChild
              ? "var(--joy-palette-primary-100)"
              : "var(--joy-palette-neutral-100)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Link
          href={menuItem.route}
          passHref
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "12px",
          }}
        >
          {renderIcon()}
          <ListItemContent>
            <Typography
              level="title-sm"
              sx={{
                color: isSelectedChild
                  ? "var(--joy-palette-primary-700)"
                  : "var(--joy-palette-neutral-800)",
                fontWeight: isSelectedChild ? 600 : 500,
                letterSpacing: "0.5px",
              }}
            >
              {menuItem.label}
            </Typography>
          </ListItemContent>
          {hasChildren && (
            <KeyboardArrowDownIcon
              sx={{
                transform: isOpened ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
                color: isSelectedChild
                  ? "var(--joy-palette-primary-500)"
                  : "var(--joy-palette-neutral-500)",
                marginLeft: "auto",
              }}
            />
          )}
        </Link>
      </ListItemButton>
    );
  };

  return (
    <ListItem
      key={label}
      nested={nested}
      sx={{
        width: "100%",
      }}
    >
      {renderMenu(menu)}
      <AnimatePresence>
        {nested && isOpened && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2}}
            style={{overflow: "hidden", width: "100%"}}
          >
            <List
              sx={{
                "--List-nestedInsetStart": "24px",
                pl: 1,
              }}
            >
              {child.map((menuChild) => (
                <ListItem key={menuChild.route} sx={{width: "100%"}}>
                  {renderMenu(menuChild, true)}
                </ListItem>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </ListItem>
  );
};

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({open = true, onClose}) => {
  const pathname: string = usePathname();

  const menus: MenusType = [
    {label: "Home", route: "/", icon: <HomeRoundedIcon />},
    {
      label: "Produk",
      route: "/products",
      icon: <DashboardRoundedIcon />,
      child: [
        {label: "Kategori", route: "/category"},
        {label: "Koleksi", route: "/collection"},
      ].map(({route, label}) => ({
        label,
        route: `/products${route}`,
      })),
    },
  ];

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
        <Typography
          level="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            py: 1,
            px: 2,
            borderRadius: "sm",
          }}
        >
          TokoTrend
        </Typography>

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
              <Menu key={menu.label} pathname={pathname} menu={menu} />
            ))}
          </List>
        </Box>
      </Sheet>
    </>
  );
};

export default Sidebar;
