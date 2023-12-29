import React, { useContext, useState } from "react";
import { Chip, Popover } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import PageLinkEditor from "./Editors/PageLinkEditor";
import { PageLink as PageLinkType, toDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";
import { Mode } from "../Control";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode: Mode;
  pageRect: DOMRect;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ params, mode }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const [anchor, setAnchor] = useState<HTMLElement>();
  const { pageNum, pageLabel } = toDisplayedPage(notes, params.page);
  const [hover, setHover] = useState(false);
  if (!notes || !setNotes) return <></>;
  const cursor = mode === "move" ? "move" : "pointer";
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
          e.stopPropagation();
          e.preventDefault();
          // 左クリック
          if (e.button === 0) {
            if (mode === "delete") {
              // 削除
              const page = notes.pages[notes.currentPage];
              if (!page) return;
              const notesTrimmed = page.notes?.filter((n) => n !== params);
              page.notes = notesTrimmed;
              setNotes({ ...notes });
            } else if (mode === "edit") {
              // 編集
              setAnchor(e.currentTarget);
            } else if (mode === "move") {
              // 移動
            } else {
              // ページリンク先へ移動
              if (notes.currentPage === params.page) return;
              if (params.page < 0 || notes.numPages <= params.page) return;
              setNotes({ ...notes, currentPage: params.page });
            }
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
