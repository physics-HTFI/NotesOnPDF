import React, { useState } from "react";
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
  const [hover, setHover] = useState(false);
  return (
    <MathJax hideUntilTypeset={"first"}>
      <Box
        sx={{
          position: "absolute",
          left: x,
          top: y,
          color: "red",
          cursor: "alias",
          opacity: hover ? 0.5 : 1,
          background: "#FFFc",
          lineHeight: 1.2,
          fontSize: "90%",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onMouseDown={(e) => {
          if (e.button !== 2) return;
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
    </MathJax>
  );
};

export default Note;
