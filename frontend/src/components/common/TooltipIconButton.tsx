import {
  Box,
  IconButton,
  type SxProps,
  Tooltip,
  type TooltipProps,
} from "@mui/material";
import { type ReactNode, useState } from "react";

/**
 * ツールチップ付きアイコンボタン
 */
export default function TooltipIconButton({
  icon,
  onClick,
  onMouseDown,
  sx,
  disabled,
  tooltipTitle,
  tooltipPlacement,
}: {
  icon: ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
  sx?: SxProps;
  disabled?: boolean;
  tooltipTitle: ReactNode;
  tooltipPlacement?: TooltipProps["placement"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      title={tooltipTitle}
      placement={tooltipPlacement}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disableInteractive
    >
      <Box sx={sx}>
        <IconButton
          disabled={disabled ?? false}
          sx={{ color: "inherit" }}
          onClick={(e) => {
            e.stopPropagation(); // TableCell 内に置いたときにクリックが貫通するのを防ぐ
            onClick?.();
          }}
          onMouseDown={() => {
            setOpen(false); // これがないと、設定パネル位置変更ボタンをクリックしたときにツールチップが消えない
            onMouseDown?.();
          }}
          size="small"
        >
          {icon}
        </IconButton>
      </Box>
    </Tooltip>
  );
}
