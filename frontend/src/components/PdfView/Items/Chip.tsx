import { MouseEvent, useContext, useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../SpeedDial";
import { Chip as ChipType, Node, NoteType } from "@/types/PdfNotes";
import MouseContext from "@/contexts/MouseContext";
import useCursor from "./useCursor";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * チップ
 */
export default function Chip({
  params,
  mode,
  onMouseDown,
}: {
  params: ChipType;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}) {
  const [hover, setHover] = useState(false);
  const { getCursor } = useCursor(mode);
  const { scale } = useContext(MouseContext);
  const { pdfNotes } = useContext(PdfNotesContext);
  if (!pdfNotes || !scale) return <></>;

  const cursor = getCursor();
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * params.x}%`,
        top: `${100 * params.y}%`,
        cursor,
        opacity: hover ? 0.5 : 1,
        fontSize: "75%",
        transformOrigin: "top left",
        transform: `scale(${scale}%)`,
      }}
      color="primary"
      variant={params.style === "outlined" ? "outlined" : undefined}
      size="small"
      label={params.text}
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
  );
}
