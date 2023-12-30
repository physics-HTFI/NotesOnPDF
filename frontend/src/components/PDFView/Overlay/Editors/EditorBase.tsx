import React, { ReactNode, useContext } from "react";
import { Paper } from "@mui/material";
import { NotesContext } from "@/contexts/NotesContext";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `EditorBase`の引数
 */
interface Props {
  children: ReactNode;
  width: number;
  height: number;
  onClose: () => void;
}

/**
 * 画面クリック時にポップアップするエディタ
 */
const EditorBase: React.FC<Props> = ({ children, width, height, onClose }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const { mouse, pageRect } = useContext(MouseContext);
  if (!notes || !setNotes || !mouse || !pageRect) return <></>;

  const x = (100 * (mouse.pageX - pageRect.left)) / pageRect.width;
  const y = (100 * (mouse.pageY - pageRect.top)) / pageRect.height;
  return (
    <Paper
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width,
        height,
        m: "auto",
        transform: `translate(${-50 + x}cqw, ${-50 + y}cqh)`,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "default",
      }}
      onMouseLeave={onClose}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </Paper>
  );
};

export default EditorBase;
