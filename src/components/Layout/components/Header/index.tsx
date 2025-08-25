"use client";

import React, {FC} from "react";
import {Box, IconButton, Breadcrumbs, Link} from "@mui/joy";
import {
  KeyboardArrowRight,
  Menu as MenuIcon,
  ReplyAllRounded,
} from "@mui/icons-material";
import {SessionType} from "@/types";
import ProfileMenu from "./components/ProfileMenu";
import {BREAD_CRUMB_PATHNAMES} from "@/constants";
import {usePathname, useRouter} from "next/navigation";
import Title from "@/components/typography/Title";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  session: SessionType;
  handleSignOut: () => void;
}

const Header: FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
  session,
  handleSignOut,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const breadCrumbsData = BREAD_CRUMB_PATHNAMES.filter((e) =>
    pathname
      .split("/")
      .find((breadCrumbPathname) => breadCrumbPathname === e.name)
  );

  const goBack = () => {
    router.back();
  };

  const renderBreadcrumb = () => {
    if (breadCrumbsData.length > 0) {
      return (
        <Breadcrumbs
          separator={<KeyboardArrowRight />}
          aria-label="breadcrumbs"
        >
          {breadCrumbsData.map((e, idx) => {
            if (idx === breadCrumbsData.length - 1) {
              return (
                <Title level="title-lg" key={e.name}>
                  {e.label}
                </Title>
              );
            }

            let route = "";

            for (let i = 0; i <= idx; i++) {
              route += `/${breadCrumbsData[i].name}`;
            }
            return (
              <Link key={e.name} color="neutral" href={route} fontWeight={500}>
                {e.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      );
    }

    if (pathname === "/") {
      return <Title level="title-lg">Home</Title>;
    }

    return null;
  };

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

        <IconButton
          sx={{
            backgroundColor: "var(--joy-palette-neutral-100)",
            color: "var(--joy-palette-neutral-800)",
            "&:hover": {
              backgroundColor: "var(--joy-palette-primary-100)",
              color: "var(--joy-palette-primary-700)",
            },
          }}
          onClick={goBack}
        >
          <ReplyAllRounded />
        </IconButton>

        {renderBreadcrumb()}
      </Box>

      {/* Right Section */}
      <ProfileMenu session={session} handleSignOut={handleSignOut} />
    </Box>
  );
};

export default Header;
