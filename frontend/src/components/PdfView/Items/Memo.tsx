import { MouseEvent, useContext, useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../SpeedDial";
import MouseContext from "@/contexts/MouseContext";
import { Node, Memo as NoteParams, NoteType } from "@/types/PdfNotes";
import useCursor from "./utils/useCursor";
import DOMPurify from "dompurify";

/**
 * テキストや数式
 */
export default function Memo({
  params,
  mode,
  onMouseDown,
}: {
  params: NoteParams;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}) {
  const [hover, setHover] = useState(false);
  const { cursor } = useCursor(mode);
  const { scale } = useContext(MouseContext);
  const htmlFolded = params.html.match(
    params.style === "fold" && !hover ? /^.*/ : /[\s\S]*/
  )?.[0];
  const folded = htmlFolded !== params.html;
  const html = (!htmlFolded ? "" : htmlFolded)
    .replace(/(\n *\$\$|\$\$ *\n)/g, "$$$$") // 別行立て数式前後の改行を除去する
    .replace(/\n/g, "<br/>");
  const filter = `drop-shadow(0px 0px 2px ${
    hover && cursor ? "snow" : "white"
  })`;
  return (
    <MathJax hideUntilTypeset={"first"} dynamic>
      <Box
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          color: "red",
          lineHeight: 1.2,
          fontSize: "80%",
          whiteSpace: "nowrap", // 画面右端においたときに改行するのを防ぐ
          transformOrigin: "top left",
          transform: `scale(${scale}%)`,
          filter: `${filter} ${filter} ${filter} ${filter} ${filter}`,
          textDecoration: folded ? "underline" : undefined,
          "&::after": folded
            ? { content: '"..."', pointerEvents: "all" } // 「...」に当たり判定をなくすため、メモとは別の要素にしている
            : undefined,
        }}
      >
        <span
          style={{ cursor }}
          dangerouslySetInnerHTML={{
            __html: html ? DOMPurify.sanitize(html) : "注釈",
          }}
          onMouseDown={(e) => {
            onMouseDown?.(e, params);
          }}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        />
      </Box>
    </MathJax>
  );
}
