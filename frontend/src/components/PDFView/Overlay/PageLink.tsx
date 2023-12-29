import React, { useContext, useState } from "react";
import { Chip, Popover } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import PageLinkEditor from "./Editors/PageLinkEditor";
import { PageLink as PageLinkType, toDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";
import { Mode } from "../SpeedDial";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode: Mode;
  onDelete: () => void;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ params, mode, onDelete }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const [anchor, setAnchor] = useState<HTMLElement>();
  const { pageNum, pageLabel } = toDisplayedPage(notes, params.page);
  const [hover, setHover] = useState(false);
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
          opacity: hover ? 0.5 : 1,
          fontSize: "75%",
        }}
        color="success"
        icon={<Shortcut />}
        label={pageLabel}
        size="small"
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          e.preventDefault();
          if (mode === "delete") onDelete();
          if (mode === "edit") setAnchor(e.currentTarget);
          if (mode === "move") {
            // TODO 移動
          }
          if (!mode) {
            // ページリンク先へ移動
            if (notes.currentPage === params.page) return;
            if (params.page < 0 || notes.numPages <= params.page) return;
            setNotes({ ...notes, currentPage: params.page });
          }
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
      {/* メニュー */}
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchor(undefined);
        }}
      >
        <PageLinkEditor
          pageNum={pageNum ?? toDisplayedPage(notes).pageNum ?? 1}
          params={params}
          onClose={() => {
            setAnchor(undefined);
          }}
        />
      </Popover>
    </>
  );
};

export default PageLink;
