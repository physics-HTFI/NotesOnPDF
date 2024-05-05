import { FC, MouseEvent, useContext, useState } from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import { Node, NoteType, PageLink as PageLinkType } from "@/types/PdfNotes";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";
import { useCursor } from "./useCursor";
import usePdfNotes from "@/hooks/usePdfNotes";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}

/**
 * ページへのリンク
 */
const PageLink: FC<Props> = ({ params, mode, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const { getCursor } = useCursor(mode);
  const { pdfNotes, jumpPage } = usePdfNotes();
  const { scale } = useContext(MouseContext);
  const cursor = getCursor() ?? "pointer";
  if (!pdfNotes) return <></>;
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          cursor,
          opacity: mode && hover ? 0.5 : 1,
          background: !mode && hover ? "mediumseagreen" : "green",
          fontSize: "75%",
          transformOrigin: "top left",
          transform: `scale(${scale}%)`,
        }}
        color="success"
        icon={<Shortcut />}
        label={`p. ${pdfNotes.pages[params.page]?.num ?? "???"}`}
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
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
    </>
  );
};

export default PageLink;
