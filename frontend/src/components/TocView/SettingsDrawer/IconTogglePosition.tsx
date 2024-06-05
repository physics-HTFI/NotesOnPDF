import TooltipIconButton from "@/components/common/TooltipIconButton";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { ReactNode } from "react";

/**
 * 設定パネル位置変更ボタン
 */
export default function IconTogglePosition({
  isBottom,
  onToggleSettingsPosition,
}: {
  isBottom: boolean;
  onToggleSettingsPosition: () => void;
}): ReactNode {
  return (
    <TooltipIconButton
      icon={isBottom ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
      onClick={onToggleSettingsPosition}
      sx={{
        position: "absolute",
        right: 39,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        color: grey[600],
        background: "#f5f5f5e5",
        borderRadius: "100%",
        "&:hover": {
          background: grey[300],
        },
      }}
      tooltipTitle="設定パネルを移動します"
      tooltipPlacement={isBottom ? "top" : "bottom"}
    />
  );
}
