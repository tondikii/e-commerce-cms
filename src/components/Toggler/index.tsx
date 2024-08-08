"use client";

import {Box} from "@mui/joy";
import {SetStateAction, useState} from "react";

export default function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <>
      {renderToggle({open, setOpen})}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}
