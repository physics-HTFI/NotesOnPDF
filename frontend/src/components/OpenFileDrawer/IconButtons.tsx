import React, { useRef } from "react";
import { Box, Divider, IconButton, Tooltip } from "@mui/material";
import { FolderOpen, GitHub, Language, MenuBook } from "@mui/icons-material";
import OpenUrlDialog from "./OpenUrlDialog";

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
      sx={{
        mb: 0.5,
        borderBottom: "solid 1px gainsboro",
        display: "flex",
        justifyContent: "flex-end",
      }}
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
            accept="application/pdf"
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

      {/* URLから開く */}
      <Tooltip title="URLからPDFファイルを開く">
        <IconButton
          disabled
          sx={{
            "&:focus": { outline: "none" },
            color: "slategray",
          }}
          onClick={() => undefined}
          size="small"
        >
          <Language />
        </IconButton>
      </Tooltip>
      <OpenUrlDialog
        open={false}
        onClose={(url) => {
          if (!url) return;
        }}
      />
      <Divider orientation="vertical" variant="middle" flexItem />

      {/* マニュアル */}
      <IconButton disabled>
        <MenuBook />
      </IconButton>

      {/* ソースコード */}
      <IconButton disabled>
        <GitHub />
      </IconButton>
    </Box>
  );
};

export default IconButtons;
