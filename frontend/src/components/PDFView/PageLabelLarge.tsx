import React from "react";
import { Box } from "@mui/material";

/**
 * `PageLabelLarge`の引数
 */
interface Props {
  label?: string;
  shown: boolean;
}

/**
 * 画面中央のページ数表示コンポーネント
 */
const PageLabelLarge: React.FC<Props> = ({ label, shown }) =>
  shown && (
    <Box
      sx={{
        color: "darkseagreen",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2em",
        zIndex: 100,
        background: "white",
      }}
    >
      {label}
    </Box>
  );

export default PageLabelLarge;
