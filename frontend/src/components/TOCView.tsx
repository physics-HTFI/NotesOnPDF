import React, { useEffect, useRef, useState } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import Control from "./TOCView/Control";
import Settings from "./TOCView/Settings";
import { Notes } from "../types/Notes";

/**
 * `TOCView`の引数
 */
interface Props {
  notes?: Notes;
  pageNum?: number;
  onChanged?: (pageNum: number) => void;
  onOpenFileTree?: () => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOCView: React.FC<Props> = ({
  notes,
  pageNum,
  onChanged,
  onOpenFileTree,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        width: 300,
        background: "whitesmoke",
        minWidth: 300,
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Control
        onOpenFileTree={onOpenFileTree}
        onOpenSettings={() => {
          setOpen(!open);
        }}
      />
      {notes && (
        <Box sx={{ p: 0.5 }}>
          <Typography variant="body1" gutterBottom>
            タイトル
          </Typography>
          <Typography variant="body2" gutterBottom>
            第1部
          </Typography>
          <Typography variant="caption" sx={{ display: "block" }}>
            第1章
          </Typography>
          <span>■■■■■■■■■■■ ■■■■■■■■■■■■■■</span>
          <Typography variant="caption" sx={{ display: "block" }}>
            第2章
          </Typography>
          <span>
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■ ■■■■■■■■■■■■■■■■■■■■ ■■■■■
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■ ■■■■■■■■■■■■■■■■■■■■ ■■■■■
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■ ■■■■■■■■■■■■■■■■■■■■ ■■■■■
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■ ■■■■■■■■■■■■■■■■■■■■ ■■■■■
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■ ■■■■■■■■■■■■■■■■■■■■ ■■■■■
            ■■■■■■■■■■■■■■■■■■■■ ■■■■■
          </span>
        </Box>
      )}

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={open}
        PaperProps={{
          square: false,
          sx: {
            position: "absolute",
            borderRadius: "10px 10px 0 0",
          },
        }}
      >
        <Settings
          page={notes ? notes.pages[notes.currentPage] ?? {} : {}}
          preferredBook=""
          preferredPart=""
          preferredChapter=""
          preferredPageNum={10}
          onChange={(page) => {
            if (!notes) return;
            notes.pages[notes.currentPage] = page;
            // TODO pdfが変更されたという情報を上に上げる
          }}
        />
      </Drawer>
    </Box>
  );
};

export default TOCView;
