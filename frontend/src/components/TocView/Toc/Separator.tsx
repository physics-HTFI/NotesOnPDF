import { Tooltip } from "@mui/material";

/**
 * 節区切り
 */
export default function Separator({
  onClick,
  tooltip,
  index,
  openTooltips,
  visible,
  setOpenTooltips,
}: {
  onClick?: () => void;
  tooltip?: string;
  index?: number;
  openTooltips?: boolean[];
  visible?: boolean;
  setOpenTooltips?: (openTooltips: boolean[]) => void;
}) {
  const openTooltip = index !== undefined && openTooltips?.[index];
  const separator = (
    <span
      style={{
        height: visible ? 10 : undefined,
        width: 1,
        marginLeft: 2,
        marginRight: 2,
        background: visible ? "darkgray" : undefined,
        display: "inline-block",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
  return (
    <span
      onMouseEnter={() => {
        if (!setOpenTooltips || !openTooltips) return;
        setOpenTooltips(openTooltips.map((_, j) => index === j));
      }}
    >
      {!openTooltip && separator}
      {openTooltip && (
        <Tooltip
          title={tooltip}
          disableInteractive
          enterDelay={0}
          leaveDelay={0}
        >
          {separator}
        </Tooltip>
      )}
    </span>
  );
}
