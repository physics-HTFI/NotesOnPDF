import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import { MouseEventHandler, ReactNode, useState } from "react";

type Placement =
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "right"
  | "top-end"
  | "top-start"
  | "top";

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
  onClick?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  sx?: SxProps;
  disabled?: boolean;
  tooltipTitle: ReactNode;
  tooltipPlacement?: Placement;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      title={tooltipTitle}
      placement={tooltipPlacement}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disableInteractive
    >
      <Box sx={sx}>
        <IconButton
          disabled={disabled ?? false}
          sx={{ color: "inherit" }}
          onClick={onClick}
          onMouseDown={(e) => {
            setOpen(false); // これがないと、設定パネル位置変更ボタンをクリックしたときにツールチップが消えない
            onMouseDown?.(e);
          }}
          size="small"
        >
          {icon}
        </IconButton>
      </Box>
    </Tooltip>
  );
}
