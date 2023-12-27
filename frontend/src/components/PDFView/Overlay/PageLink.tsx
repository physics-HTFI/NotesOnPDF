import React, { useState } from "react";
import { Chip, Popover } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import PageLinkMenu from "./Menus/PageLinkMenu";
import {
  Notes,
  PageLink as PageLinkType,
  toDisplayedPage,
} from "@/types/Notes";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  notes: Notes;
  pageRect: DOMRect;
  onNotesChanged: (notes: Notes) => void;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ params, notes, onNotesChanged }) => {
  const [anchor, setAnchor] = useState<HTMLElement>();
  const { pageNum, pageLabel } = toDisplayedPage(notes, params.page);
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
            if (
              params.page < 0 ||
              notes.numPages <= params.page ||
              notes.currentPage === params.page
            )
              return;
            onNotesChanged({ ...notes, currentPage: params.page });
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
          notes={notes}
          onClose={(p) => {
            setAnchor(undefined);
            const page = notes.pages[notes.currentPage];
            if (!p || !page) return;
            page.notes = page.notes?.filter((n) => n !== params);
            if (p !== "delete") {
              page.notes?.push(p);
            }
            onNotesChanged({ ...notes });
          }}
        />
      </Popover>
    </>
  );
};

export default PageLink;
