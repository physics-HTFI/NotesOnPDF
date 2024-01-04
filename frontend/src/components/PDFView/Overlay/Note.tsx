import { FC, useContext, useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";
import { Node, Note as NoteParams, NoteType } from "@/types/Notes";

/**
 * `Note`の引数
 */
interface Props {
  params: NoteParams;
  mode?: Mode;
  onMouseDown?: (p: NoteType | Node) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Note: FC<Props> = ({ params, mode, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const { setMouse } = useContext(MouseContext);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
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
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          e.preventDefault(); // これがないと編集エディタの表示時にフォーカスが当たらない
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          onMouseDown?.(params);
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
