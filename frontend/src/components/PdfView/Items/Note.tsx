import { MouseEvent, useContext, useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../SpeedDial";
import MouseContext from "@/contexts/MouseContext";
import { Node, Note as NoteParams, NoteType } from "@/types/PdfNotes";
import useCursor from "./useCursor";

/**
 * テキストや数式
 */
export default function Note({
  params,
  mode,
  onMouseDown,
}: {
  params: NoteParams;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}) {
  const [hover, setHover] = useState(false);
  const { getCursor } = useCursor(mode);
  const { scale } = useContext(MouseContext);
  const cursor = getCursor();
  const html = params.html
    .replace(/(\n *\$\$|\$\$ *\n)/g, "$$$$") // 別行立て数式前後の改行を除去する
    .replace(/\n/g, "<br/>");
  return (
    <MathJax hideUntilTypeset={"first"}>
      <Box
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          color: "red",
          cursor,
          lineHeight: 1.2,
          fontSize: "80%",
          background: hover ? "#F881" : undefined,
          whiteSpace: "nowrap", // 画面右端においたときに改行するのを防ぐ
          transformOrigin: "top left",
          transform: `scale(${scale}%)`,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
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
}
