import React from "react";
import { Box } from "@mui/material";

/**
 * `PageLink`の引数
 */
interface Props {
  x: string;
  y: string;
  label: string;
  onClick: () => void;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ x, y, label, onClick }) => {
  console.log(x);
  return (
    <Box
      sx={{
        position: "absolute",
        left: x,
        top: y,
        borderRadius: 3,
        border: "solid 1px red",
        color: "red",
        cursor: "pointer",
        px: 1,
        background: "#FFFc",
      }}
      fontSize={12}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    >
      {label}
    </Box>
  );
};

export default PageLink;
