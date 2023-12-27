import React, { useContext, useState } from "react";
import { Chip, Popover } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import PageLinkMenu from "./Menus/PageLinkMenu";
import { PageLink as PageLinkType, toDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  pageRect: DOMRect;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ params }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const [anchor, setAnchor] = useState<HTMLElement>();
  const { pageNum, pageLabel } = toDisplayedPage(notes, params.page);
  if (!notes || !setNotes) return <></>;
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          cursor: "pointer",
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
            if (notes.currentPage === params.page) return;
            if (params.page < 0 || notes.numPages <= params.page) return;
            setNotes({ ...notes, currentPage: params.page });
          }
        }}
        onContextMenu={(e) => {
          setAnchor(e.currentTarget);
          e.preventDefault();
        }}
      />
      {/* メニュー */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchor(undefined);
        }}
      >
        <PageLinkMenu
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
