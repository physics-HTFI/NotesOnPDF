import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";

/**
 * 設定パネル位置変更ボタン
 */
export default function IconTogglePosition({
  isBottom,
  onToggleSettingsPosition,
}: {
  isBottom: boolean;
  onToggleSettingsPosition: () => void;
}): JSX.Element {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 39,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        background: grey[100],
        "&:hover": {
          background: grey[300],
        },
      }}
      onClick={onToggleSettingsPosition}
      size="small"
    >
      {isBottom ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
    </IconButton>
  );
}
