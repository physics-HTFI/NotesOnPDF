import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";

/**
 * `TOCControl`の引数
 */
interface Props {
  onOpenFileTree?: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const TOCControl: React.FC<Props> = ({ onOpenFileTree }) => {
  return (
    <Box>
      <Tooltip title="ファイル選択画面を開きます">
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            "&:focus": { outline: "none" },
          }}
          color="primary"
          onClick={onOpenFileTree}
        >
          <FileOpenIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TOCControl;
