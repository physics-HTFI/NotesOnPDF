import React, { ReactNode, useContext } from "react";
import { Modal, Paper } from "@mui/material";
import { NotesContext } from "@/contexts/NotesContext";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `EditorBase`の引数
 */
interface Props {
  children: ReactNode;
  onClose: () => void;
}

/**
 * 画面クリック時にポップアップする編集ダイアログ
 */
const EditorBase: React.FC<Props> = ({ children, onClose }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const { mouse } = useContext(MouseContext);
  if (!notes || !setNotes || !mouse) return <></>;

  return (
    <Modal
      open
      slotProps={{
        backdrop: {
          sx: { background: "#0003" },
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onWheel: (e) => {
            e.stopPropagation();
          },
        },
      }}
      onClose={onClose}
    >
      <Paper
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(calc(-50% + ${mouse.pageX}px), calc(-50% + ${mouse.pageY}px))`,
          display: "flex",
          cursor: "default",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
};

export default EditorBase;
