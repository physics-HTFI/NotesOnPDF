import React, { useEffect, useRef, useState } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import Control from "./TOC/Control";
import Settings from "./TOC/Settings";
import { PDF } from "../types/PDF";

/**
 * `TOC`の引数
 */
interface Props {
  pdf?: PDF;
  onOpenFileTree?: () => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOC: React.FC<Props> = ({ pdf, onOpenFileTree }) => {
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
      {!pdf && (
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
          page={{
            book: "タイトル",
            part: "第1部",
          }}
          preferredBook=""
          preferredPart=""
          preferredChapter=""
          preferredPageNum={10}
          onChange={() => undefined}
        />
      </Drawer>
    </Box>
  );
};

export default TOC;
