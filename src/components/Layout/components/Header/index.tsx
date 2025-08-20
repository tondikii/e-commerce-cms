"use client";

import React, {FC} from "react";
import {Box, Typography, IconButton} from "@mui/joy";
import {Menu as MenuIcon} from "@mui/icons-material";
import {SessionType} from "@/types";
import ProfileMenu from "./components/ProfileMenu";

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  showMenuButton?: boolean;
  session: SessionType;
  handleSignOut: () => void;
}

const Header: FC<HeaderProps> = ({
  onMenuClick,
  title = "Dashboard",
  showMenuButton = false,
  session,
  handleSignOut,
}) => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "background.surface",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left Section */}
      <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
        {showMenuButton && (
          <IconButton
            variant="outlined"
            onClick={onMenuClick}
            sx={{display: {lg: "none"}}}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography level="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      {/* Right Section */}
      <ProfileMenu session={session} handleSignOut={handleSignOut} />
    </Box>
  );
};

export default Header;
