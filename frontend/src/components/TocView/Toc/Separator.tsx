import { Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";

/**
 * 節区切り
 */
export default function Separator({
  onClick,
  tooltip,
  index,
  openTooltips,
  background,
  setOpenTooltips,
}: {
  onClick?: () => void;
  tooltip?: string;
  index?: number;
  openTooltips?: boolean[];
  background?: string;
  setOpenTooltips?: (openTooltips: boolean[]) => void;
}) {
  const openTooltip = index !== undefined && openTooltips?.[index];
  const separator = (
    <span
      style={{
        height: 11,
        width: 1,
        borderLeft: `2px solid ${background ?? grey[100]}`,
        borderRight: `4px solid ${background ?? grey[100]}`,
        background: "darkgray",
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
