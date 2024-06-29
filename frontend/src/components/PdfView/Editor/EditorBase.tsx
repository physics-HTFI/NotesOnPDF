import { ReactNode, useContext } from "react";
import { Modal, Paper } from "@mui/material";
import MouseContext from "@/contexts/MouseContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * 画面クリック時にポップアップする編集ダイアログ
 */
export default function EditorBase({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const { pdfNotes } = useContext(PdfNotesContext);
  const { mouse } = useContext(MouseContext);
  if (!pdfNotes || !mouse) return <></>;

  return (
    <Modal
      open
      slotProps={{
        backdrop: {
          sx: { background: "#0005" },
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onWheel: (e) => {
            e.stopPropagation();
          },
        },
      }}
      onClose={() => {
        onClose();
      }}
    >
      <Paper
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(calc(-50% + ${mouse.pageX}px), calc(-50% + ${mouse.pageY}px))`,
          display: "flex",
          alignItems: "center",
          cursor: "default",
          p: 1,
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
}
