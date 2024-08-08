"use client";
import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, {listItemButtonClasses} from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {closeSidebar, getInitialsName} from "../utils";
import {MenusType, MenuType, SessionType, UserType} from "@/types";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Swal from "sweetalert2";
import {signOut} from "next-auth/react";
import {Toggler} from "../";
import {CATEGORIES} from "@/constant";

const menus: MenusType = [
  {label: "Home", route: "/", icon: <HomeRoundedIcon />},
  {
    label: "Produk",
    route: "/",
    icon: <DashboardRoundedIcon />,
    child: CATEGORIES.map(({id, name}) => ({
      label: name,
      route: `/products/${id}`,
    })),
  },
];

interface Props {
  session: SessionType;
}

const emptyUser = {email: "", name: ""};

const Sidebar: React.FC<Props> = ({session}) => {
  const pathname: string = usePathname();

  const user: UserType = session?.user || emptyUser;

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

  const renderMenu = (menu: MenuType) => {
    const {label, icon, child = []} = menu;
    const nested = Boolean(Array.isArray(child) && child.length > 0);

    const renderComponent = (props: MenuType) => (
      <ListItemButton
        selected={pathname === props.route}
        sx={{mt: nested ? 0.5 : 0}}
      >
        {props.icon ? props.icon : null}
        <ListItemContent>
          <Link href={props.route || ""}>
            <Typography level="title-sm">{props.label}</Typography>
          </Link>
        </ListItemContent>
      </ListItemButton>
    );

    return (
      <ListItem key={label} nested={nested}>
        {nested ? (
          <Toggler
            renderToggle={({open, setOpen}) => (
              <ListItemButton onClick={() => setOpen(!open)}>
                {icon}
                <ListItemContent>
                  <Typography level="title-sm">{label}</Typography>
                </ListItemContent>
                <KeyboardArrowDownIcon
                  sx={{transform: open ? "rotate(180deg)" : "none"}}
                />
              </ListItemButton>
            )}
          >
            <List>{child.map((menuChild) => renderComponent(menuChild))}</List>
          </Toggler>
        ) : (
          renderComponent(menu)
        )}
      </ListItem>
    );
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {xs: "fixed", md: "sticky"},
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Typography level="title-lg">TokoTrend</Typography>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {menus.map((menu) => renderMenu(menu))}
        </List>
      </Box>
      <Divider />
      <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
        <Avatar variant="outlined" size="sm">
          {getInitialsName(user.name)}
        </Avatar>
        <Box sx={{minWidth: 0, flex: 1}}>
          <Typography level="title-sm">{user.name}</Typography>
          <Typography level="body-xs">{user.email}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleSignOut}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default Sidebar;
