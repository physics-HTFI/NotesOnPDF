import React, { useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../Control";

/**
 * `Note`の引数
 */
interface Props {
  x: string;
  y: string;
  html: string;
  mode: Mode;
  onClick: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Note: React.FC<Props> = ({ x, y, html, mode, onClick }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MathJax hideUntilTypeset={"first"}>
      <Box
        sx={{
          position: "absolute",
          left: x,
          top: y,
          color: "red",
          cursor: cursor,
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
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
    </MathJax>
  );
};

export default Note;
