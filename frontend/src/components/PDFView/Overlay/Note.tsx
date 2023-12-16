import React from "react";
import { Box } from "@mui/material";

/**
 * `Note`の引数
 */
interface Props {
  x: string;
  y: string;
  html: string;
  onClick: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Note: React.FC<Props> = ({ x, y, html, onClick }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: x,
        top: y,
        color: "red",
        cursor: "pointer",
        background: "#FFFc",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default Note;
