import React, { useState } from "react";
import { Chip, Popover } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import PageLinkMenu from "./Menus/PageLinkMenu";

/**
 * `PageLink`の引数
 */
interface Props {
  x: number;
  y: number;
  label: string;
  pageNum: number;
  pageRect: DOMRect;
  onLeftClick: () => void;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ x, y, label, pageNum, onLeftClick }) => {
  const [anchor, setAnchor] = useState<HTMLElement>();
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * x}%`,
          top: `${100 * y}%`,
          cursor: "pointer",
          fontSize: "75%",
        }}
        color="success"
        icon={<Shortcut />}
        label={label}
        size="small"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.button === 0) {
            onLeftClick();
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
          key={pageNum}
          pageNum={pageNum}
          onClose={() => {
            setAnchor(undefined);
          }}
        />
      </Popover>
    </>
  );
};

export default PageLink;
