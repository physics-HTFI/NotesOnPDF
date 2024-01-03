import { FC, useContext, useState } from "react";
import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { Mode } from "../SpeedDial";
import { Note as NoteType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Note`の引数
 */
interface Props {
  params: NoteType;
  mode?: Mode;
  onMouseDown?: () => void;
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
          cursor: cursor,
          opacity: hover ? 0.5 : 1,
          lineHeight: 1.2,
          fontSize: "80%",
          // background: "#FFFc",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          e.preventDefault(); // これがないと編集エディタの表示時にフォーカスが当たらない
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          onMouseDown?.();
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
