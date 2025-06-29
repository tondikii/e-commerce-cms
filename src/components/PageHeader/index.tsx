import {Box, Typography} from "@mui/joy";
import type {FC} from "react";

interface PageHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({title, rightComponent = null}) => {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 4,
        gap: 1,
        flexDirection: {xs: "column", sm: "row"},
        alignItems: {xs: "start", sm: "center"},
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <Typography level="h2" component="h1">
        {title}
      </Typography>

      {rightComponent}
    </Box>
  );
};
export default PageHeader;
