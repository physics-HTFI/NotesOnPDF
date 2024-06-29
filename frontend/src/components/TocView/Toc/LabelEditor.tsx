import { useCallback, useState } from "react";
import { Modal, Paper } from "@mui/material";
import TextareaAutosize from "@/components/common/TextAreaAutosize";

/**
 * ラベルクリック時にポップアップする編集ダイアログ
 */
export default function LabelEditor({
  initLabel,
  x,
  y,
  onClose,
}: {
  initLabel: string;
  x: number;
  y: number;
  onClose: (label?: string) => void;
}) {
  const [label, setLabel] = useState(initLabel);
  const handleRef = useCallback((ref: HTMLTextAreaElement | null) => {
    setTimeout(() => {
      ref?.select();
    }, 10);
  }, []);
  const handleClose = () => {
    if (!label.trim() || label === initLabel) {
      onClose();
    } else {
      onClose(label);
    }
  };

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
      onClose={handleClose}
    >
      <Paper
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(calc(${x}px), calc(${y}px))`,
          display: "flex",
          p: 1,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <TextareaAutosize
          value={label}
          sx={{ pl: 1 }}
          spellCheck={false}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
          ref={handleRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClose();
            }
            if (e.key === "Escape") {
              onClose();
            }
            e.stopPropagation();
          }}
        />
      </Paper>
    </Modal>
  );
}
