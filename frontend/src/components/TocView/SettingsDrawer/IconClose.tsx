import TooltipIconButton from "@/components/common/TooltipIconButton";
import { Close } from "@mui/icons-material";
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
    <TooltipIconButton
      icon={<Close />}
      onClick={onClose}
      sx={{
        position: "absolute",
        right: 2,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        color: grey[600],
        background: "#f5f5f5e5",
        borderRadius: "100%",
        "&:hover": {
          background: grey[300],
        },
      }}
      tooltipTitle="設定パネルを閉じます"
      tooltipPlacement={isBottom ? "top" : "bottom"}
    />
  );
}
