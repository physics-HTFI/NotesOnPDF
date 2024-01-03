import { FC, useContext } from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import {
  NoteType,
  PageLink as PageLinkType,
  toDisplayedPage,
} from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode?: Mode;
  onDelete?: () => void;
  onEdit?: (edit: NoteType) => void;
  onMove?: (edit: NoteType) => void;
}

/**
 * ページへのリンク
 */
const PageLink: FC<Props> = ({ params, mode, onDelete, onEdit, onMove }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const { setMouse } = useContext(MouseContext);
  const { pageLabel } = toDisplayedPage(notes, params.page);
  const cursor = mode === "move" ? "move" : "pointer";
  if (!notes || !setNotes) return <></>;
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          cursor: cursor,
          "&:hover": { opacity: 0.5 },
          fontSize: "75%",
        }}
        color="success"
        icon={<Shortcut />}
        label={pageLabel}
        size="small"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.button !== 0) return;
          if (!mode) {
            // ページリンク先へ移動
            if (notes.currentPage === params.page) return;
            if (params.page < 0 || notes.numPages <= params.page) return;
            setNotes({ ...notes, currentPage: params.page });
            return;
          }
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          if (mode === "delete") onDelete?.();
          if (mode === "edit") onEdit?.(params);
          if (mode === "move") onMove?.(params);
        }}
      />
    </>
  );
};

export default PageLink;
