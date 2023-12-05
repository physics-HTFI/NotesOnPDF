import React, { useRef } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";

/**
 * `IconButtons`の引数
 */
interface Props {
  onOpenFile: (file: File) => void;
}

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
const IconButtons: React.FC<Props> = ({ onOpenFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{ mb: 0.5, borderBottom: "solid 1px gainsboro", textAlign: "right" }}
    >
      {/* PC内のPDFファイルを開く */}
      <Tooltip title="既定のフォルダ以外のPDFファイルを開く">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
            color: "slategray",
          }}
          onClick={() => {
            inputRef.current?.click();
          }}
          size="small"
        >
          <FolderOpen />
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onOpenFile(file);
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default IconButtons;
