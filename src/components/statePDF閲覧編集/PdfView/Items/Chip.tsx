import { type MouseEvent, useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { type Mode } from "../SpeedDial";
import type { Chip as ChipType, Node, NoteType } from "@/types/PdfNotes";
import useCursor from "./utils/useCursor";
import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";

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
  const { cursor } = useCursor(mode);
  const scale = modelPdfNotes.fontScale.useValue();
  if (!scale) return <></>;

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
      label={params.text ? params.text : "Chip"}
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
