"use client";
import {cloneElement, FC, isValidElement} from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {MenuType} from "@/types";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";

interface MenuProps {
  menu: MenuType;
  pathname: string;
  selectedMenuRoute: string;
}

const Menu: FC<MenuProps> = ({pathname, menu, selectedMenuRoute}) => {
  const {label, child = [], route} = menu;
  const nested = Boolean(Array.isArray(child) && child.length > 0);
  const isOpened = pathname.startsWith(route) && nested;

  const renderMenu = (menuItem: MenuType, isChild = false) => {
    const isSelected = selectedMenuRoute === menuItem.route;
    const hasChildren =
      Array.isArray(menuItem.child) && menuItem.child.length > 0;

    const renderIcon = () => {
      if (isValidElement<{sx?: object}>(menuItem?.icon)) {
        return cloneElement(menuItem?.icon, {
          sx: {
            color: isSelected
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
        selected={isSelected}
        component={motion.div}
        whileHover={{scale: 1.02}}
        sx={{
          mt: isChild ? 0.5 : 0,
          borderRadius: "md",
          px: 2,
          backgroundColor: isSelected
            ? "var(--joy-palette-primary-50)"
            : "transparent",
          "&:hover": {
            backgroundColor: isSelected
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
                color: isSelected
                  ? "var(--joy-palette-primary-700)"
                  : "var(--joy-palette-neutral-800)",
                fontWeight: isSelected ? 600 : 500,
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
                color: isSelected
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

export default Menu;
