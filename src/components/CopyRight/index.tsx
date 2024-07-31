import {Box, Typography} from "@mui/joy";
import type {FC} from "react";

interface Props {}

const CopyRight: FC<Props> = ({}) => {
  return (
    <Box component="footer" sx={{py: 3}}>
      <Typography level="body-xs" textAlign="center">
        © TokoTrend {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};
export default CopyRight;
