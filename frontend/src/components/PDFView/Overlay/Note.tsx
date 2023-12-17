import React from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";

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
    <MathJax hideUntilTypeset={"first"}>
      <Box
        sx={{
          position: "absolute",
          left: x,
          top: y,
          color: "red",
          cursor: "pointer",
          background: "#FFFc",
          lineHeight: 1.2,
          fontSize: "90%",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
      ></Box>
    </MathJax>
  );
};

export default Note;
