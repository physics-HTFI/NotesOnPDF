import React, { useRef } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Delete, Edit, OpenWith } from "@mui/icons-material";

/**
 * `PageLinkMenu`の引数
 */
interface Props {
  pageNum: number;
  onClose: () => void;
}

/**
 * ページリンクのメニュー
 */
const PageLinkMenu: React.FC<Props> = ({ pageNum, onClose }) => {
  const num = useRef<number>(pageNum);
  return (
    <Box
      onMouseLeave={onClose}
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
        <IconButton onClick={undefined}>
          <Edit />
        </IconButton>
        <IconButton onClick={undefined}>
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
