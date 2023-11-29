import React from "react";
import { Box } from "@mui/material";

/**
 * `PageLabel`の引数
 */
interface Props {
  label?: string;
}

/**
 * ページ数表示コンポーネント
 */
const PageLabel: React.FC<Props> = ({ label }) => (
  <Box
    sx={{
      position: "absolute",
      left: 3,
      bottom: 2,
      background: "teal",
      borderRadius: 3,
      color: "white",
      pr: 1,
      pl: 1,
    }}
    fontSize={14}
  >
    {label}
  </Box>
);

export default PageLabel;
