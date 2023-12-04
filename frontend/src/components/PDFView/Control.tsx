import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowUp } from "@mui/icons-material";

/**
 * `Control`の引数
 */
interface Props {
  onOpenFileTree: () => void;
  onOpenSettings: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const Control: React.FC<Props> = ({ onOpenFileTree, onOpenSettings }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Tooltip title="PDFファイル選択パネルを開く">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
            color: "slategray",
          }}
          onClick={onOpenFileTree}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Tooltip>
      <br />
      <Tooltip title="設定パネルを開く／閉じる">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
            color: "slategray",
          }}
          onClick={onOpenSettings}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Control;
