import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ReactNode } from "react";

/**
 * 閉じるボタン
 */
export default function IconClose({
  isBottom,
  onClose,
}: {
  isBottom: boolean;
  onClose: () => void;
}): ReactNode {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 2,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        background: grey[100],
        "&:hover": {
          background: grey[300],
        },
      }}
      onClick={onClose}
      size="small"
    >
      <Close />
    </IconButton>
  );
}
