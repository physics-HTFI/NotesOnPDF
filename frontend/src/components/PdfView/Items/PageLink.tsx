import { MouseEvent, useContext, useState } from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import { Node, NoteType, PageLink as PageLinkType } from "@/types/PdfNotes";
import { Mode } from "../SpeedDial";
import MouseContext from "@/contexts/MouseContext";
import useCursor from "./utils/useCursor";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * ページへのリンク
 */
export default function PageLink({
  params,
  mode,
  onMouseDown,
}: {
  params: PageLinkType;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}) {
  const [hover, setHover] = useState(false);
  const { cursor } = useCursor(mode);
  const {
    pdfNotes,
    updaters: { jumpPageStart: jumpPage },
  } = useContext(PdfNotesContext);
  const { scale } = useContext(MouseContext);
  if (!pdfNotes) return <></>;
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          cursor: cursor ?? "pointer",
          opacity: mode && hover ? 0.5 : 1,
          background: !mode && hover ? "mediumseagreen" : "green",
          fontSize: "75%",
          transformOrigin: "top left",
          transform: `scale(${scale}%)`,
        }}
        color="success"
        icon={<Shortcut />}
        label={`p. ${pdfNotes.pages[params.page]?.num ?? "---"}`}
        size="small"
        onMouseDown={(e) => {
          e.stopPropagation();
          if (e.button === 0 && !mode) {
            jumpPage(params.page);
            return;
          }
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
    </>
  );
}
