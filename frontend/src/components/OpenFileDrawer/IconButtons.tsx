import React, { useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FolderOpen, Language } from "@mui/icons-material";
import OpenURLDialog from "./OpenURLDialog";

/**
 * `IconButtons`の引数
 */
interface Props {
  onOpenFile: (file?: File) => void;
  onOpenURL: (url?: string) => void;
}

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
const IconButtons: React.FC<Props> = ({ onOpenFile, onOpenURL }) => {
  const [openURLDialog, setOpenURLDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box sx={{ mb: 1, borderBottom: "solid 1px gainsboro" }}>
      {/* PC内のPDFファイルを開く */}
      <Tooltip title="PC内のPDFファイルを開く">
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
              onOpenFile(e.target.files?.[0]);
            }}
          />
        </IconButton>
      </Tooltip>

      {/* URLから開く */}
      <Tooltip title="URLからPDFファイルを開く">
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
            color: "slategray",
          }}
          onClick={() => {
            setOpenURLDialog(true);
          }}
          size="small"
        >
          <Language />
        </IconButton>
      </Tooltip>
      <OpenURLDialog
        open={openURLDialog}
        onClose={(url) => {
          setOpenURLDialog(false);
          if (!url) return;
          onOpenURL(url);
        }}
      />
    </Box>
  );
};

export default IconButtons;
