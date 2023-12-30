import React, { useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../SpeedDial";
import { Note as NoteType } from "@/types/Notes";

/**
 * `Note`の引数
 */
interface Props {
  params: NoteType;
  mode: Mode;
  onDelete: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Note: React.FC<Props> = ({ params, mode, onDelete }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MathJax hideUntilTypeset={"first"}>
      <Box
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          color: "red",
          cursor: cursor,
          opacity: hover ? 0.5 : 1,
          background: "#FFFc",
          lineHeight: 1.2,
          fontSize: "90%",
        }}
        dangerouslySetInnerHTML={{ __html: params.html }}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          if (mode === "delete") onDelete();
          if (mode === "edit") {
            // TODO
          }
          if (mode === "move") {
            // TODO
          }
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
