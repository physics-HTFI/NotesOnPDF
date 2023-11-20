import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TOCControl from "./TOC/TOCControl";

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
  return (
    <Box
      sx={{
        width: 300,
        background: "whitesmoke",
        minWidth: 300,
        position: "relative",
        height: "100vh",
      }}
    >
      <TOCControl onOpenFileTree={onOpenFileTree} />
    </Box>
  );
};

export default TOC;
