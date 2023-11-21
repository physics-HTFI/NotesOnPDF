import React, { useEffect, useRef, useState } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import Control from "./TOC/Control";
import Settings from "./TOC/Settings";

/**
 * `TOC`の引数
 */
interface Props {
  onOpenFileTree?: () => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOC: React.FC<Props> = ({ onOpenFileTree }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

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
      <Box sx={{ p: 0.5 }}>
        <Control onOpenFileTree={onOpenFileTree} />
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
        <Settings />
      </Drawer>
    </Box>
  );
};

export default TOC;
