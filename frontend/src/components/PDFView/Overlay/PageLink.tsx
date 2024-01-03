import { FC, useContext, useState } from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import { PageLink as PageLinkType, toDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode?: Mode;
  onMouseDown?: () => void;
}

/**
 * ページへのリンク
 */
const PageLink: FC<Props> = ({ params, mode, onMouseDown }) => {
  const [hover, setHover] = useState(false);
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
          opacity: mode && hover ? 0.5 : 1,
          background: !mode && hover ? "mediumseagreen" : "green",
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
          onMouseDown?.();
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
