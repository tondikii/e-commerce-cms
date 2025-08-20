"use client";

import React, {useState, useRef} from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemDecorator,
} from "@mui/joy";
import {LogoutRounded, AccountCircle, Close} from "@mui/icons-material";
import {SessionType, UserType} from "@/types";
import ProfileModal from "./components/ProfileModal";
import {getInitialsName} from "@/components/utils";

interface ProfileMenuProps {
  session: SessionType;
  handleSignOut: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({session, handleSignOut}) => {
  const user: UserType | undefined = session?.user;
  const [open, setOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenHover = () => {
    if (!forceOpen) setOpen(true);
  };

  const handleCloseHover = () => {
    if (!forceOpen) setOpen(false);
  };

  const handleToggleClick = () => {
    if (forceOpen) {
      setForceOpen(false);
      setOpen(false);
    } else {
      setForceOpen(true);
      setOpen(true);
    }
  };

  const handleCloseMenu = () => {
    setForceOpen(false);
    setOpen(false);
  };

  const handleProfileModal = () => {
    setIsModalOpen(true);
    handleCloseMenu();
  };

  return (
    <>
      {/* Avatar Button */}
      <IconButton
        ref={anchorRef}
        onClick={handleToggleClick}
        onMouseEnter={handleOpenHover}
        sx={{
          borderRadius: "md",
          "&:hover": {backgroundColor: "background.level1"},
        }}
        size="lg"
      >
        <AccountCircle />
      </IconButton>

      {/* Menu */}
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleCloseMenu}
        placement="bottom-end"
        onMouseLeave={handleCloseHover}
        sx={{minWidth: 280, zIndex: 2000, p: 1}}
      >
        {/* Header */}
        <Box sx={{position: "relative", p: 2}}>
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={handleCloseMenu}
            sx={{position: "absolute", top: 8, right: 8}}
          >
            <Close />
          </IconButton>

          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Avatar size="md" sx={{backgroundColor: "primary.500"}}>
              {getInitialsName(user?.name)}
            </Avatar>
            <Box>
              <Typography level="title-sm" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography level="body-xs" color="neutral">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfileModal}>
          <ListItemDecorator>
            <AccountCircle />
          </ListItemDecorator>
          Profil Saya
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleSignOut();
            handleCloseMenu();
          }}
          color="danger"
        >
          <ListItemDecorator>
            <LogoutRounded />
          </ListItemDecorator>
          Keluar
        </MenuItem>
      </Menu>

      {/* Modal Profil */}
      <ProfileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
};

export default ProfileMenu;
