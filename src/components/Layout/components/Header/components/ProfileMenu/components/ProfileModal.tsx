"use client";

import React, {FC, Fragment} from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Sheet,
  Avatar,
  Divider,
  Box,
  Grid,
} from "@mui/joy";
import {UserType} from "@/types";
import {format} from "date-fns";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user?: UserType;
}

const ProfileModal: FC<ProfileModalProps> = ({open, onClose, user}) => {
  const getInitialsName = (name: string = "User"): string =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const accountDetailData = [
    {label: "Nomor HP", value: user?.phoneNumber || "-"},
    {
      label: "Bergabung",
      value: user?.createdAt
        ? format(new Date(user.createdAt), "dd MMMM yyyy")
        : "-",
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{p: 3, borderRadius: "md"}}>
        <ModalClose />
        <Typography level="h4" component="h2" mb={2}>
          Informasi Profil
        </Typography>

        <Sheet variant="outlined" sx={{p: 3, borderRadius: "md"}}>
          <Box sx={{textAlign: "center", mb: 2}}>
            <Avatar
              size="lg"
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "primary.500",
                mx: "auto",
                mb: 2,
              }}
            >
              {getInitialsName(user?.name)}
            </Avatar>
            <Typography level="title-lg" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography level="body-sm" color="neutral">
              {user?.email}
            </Typography>
          </Box>

          <Divider sx={{my: 2}} />

          <Box>
            <Typography level="body-sm" fontWeight={600} mb={1}>
              Informasi Akun
            </Typography>

            <Grid container>
              {accountDetailData.map((e) => (
                <Fragment key={e.label}>
                  <Grid xs={6}>
                    <Typography level="body-xs">{e.label}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography level="body-xs">: {e.value}</Typography>
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </Box>
        </Sheet>
      </ModalDialog>
    </Modal>
  );
};

export default ProfileModal;
