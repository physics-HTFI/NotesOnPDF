import React from "react";
import { Box } from "@mui/material";

/**
 * `PageLabelSmall`の引数
 */
interface Props {
  label?: string;
}

/**
 * 画面橋のページ数表示コンポーネント
 */
const PageLabelSmall: React.FC<Props> = ({ label }) => (
  <Box
    sx={{
      position: "absolute",
      left: 3,
      bottom: 2,
      background: "darkseagreen",
      borderRadius: 3,
      color: "white",
      pr: 1,
      pl: 1,
      cursor: "default",
    }}
    fontSize={14}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
  >
    {label}
  </Box>
);

export default PageLabelSmall;
