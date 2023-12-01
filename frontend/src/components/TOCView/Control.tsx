import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { AppRegistration } from "@mui/icons-material";

/**
 * `Control`の引数
 */
interface Props {
  shown: boolean;
  onOpenFileTree: () => void;
  onOpenSettings: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const Control: React.FC<Props> = ({
  shown,
  onOpenFileTree,
  onOpenSettings,
}) => {
  return (
    shown && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "whitesmoke",
        }}
      >
        <Tooltip title="PDFファイル選択パネルを表示する">
          <IconButton
            sx={{
              "&:focus": { outline: "none" },
              color: "slategray",
            }}
            onClick={onOpenFileTree}
          >
            <FileOpenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="設定パネルを開く／閉じる">
          <IconButton
            sx={{
              "&:focus": { outline: "none" },
              color: "slategray",
            }}
            onClick={onOpenSettings}
          >
            <AppRegistration />
          </IconButton>
        </Tooltip>
      </Box>
    )
  );
};

export default Control;
