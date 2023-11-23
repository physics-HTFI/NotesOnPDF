import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { Settings } from "@mui/icons-material";

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
        right: 0,
      }}
    >
      <Tooltip title="PDFファイルを選択">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
          }}
          color="primary"
          onClick={onOpenFileTree}
        >
          <FileOpenIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="設定パネルを開く／閉じる">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
          }}
          color="primary"
          onClick={onOpenSettings}
        >
          <Settings />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Control;
