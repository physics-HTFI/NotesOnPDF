import React, { useRef } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Delete, OpenWith } from "@mui/icons-material";
import { Notes, PageLink, fromDisplayedPage } from "@/types/Notes";

/**
 * `PageLinkMenu`の引数
 */
interface Props {
  params: PageLink;
  pageNum: number;
  notes: Notes;
  onClose: (p?: PageLink | "delete") => void;
}

/**
 * ページリンクのメニュー
 */
const PageLinkMenu: React.FC<Props> = ({ params, pageNum, notes, onClose }) => {
  const num = useRef<number>(pageNum);
  return (
    <Box
      onMouseLeave={() => {
        if (pageNum === num.current) {
          onClose();
        } else {
          onClose({ ...params, page: fromDisplayedPage(notes, num.current) });
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      <Box>
        <IconButton onClick={undefined}>
          <OpenWith />
        </IconButton>
        <IconButton
          onClick={() => {
            onClose("delete");
          }}
        >
          <Delete />
        </IconButton>
      </Box>
      <TextField
        variant="standard"
        defaultValue={pageNum}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
        type="number"
        sx={{ width: 80, p: 1 }}
      />
    </Box>
  );
};

export default PageLinkMenu;
