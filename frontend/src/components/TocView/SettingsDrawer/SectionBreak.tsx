import { FC } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { Page, Separator } from "../Toc";

/**
 * `SctionBreak`の引数
 */
interface Props {
  tooltip?: string;
  breakBefore?: boolean;
  breakMiddle?: boolean;
  onChange: (breakBefore: boolean, breakMiddle: boolean) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: FC<Props> = ({
  tooltip,
  breakBefore,
  breakMiddle,
  onChange,
}) => {
  const value = breakBefore
    ? breakMiddle
      ? "before-middle"
      : "before"
    : breakMiddle
    ? "middle"
    : "none";
  return (
    <Box
      sx={{
        py: 0.5,
        pl: 3.5,
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Tooltip title={tooltip} disableInteractive>
        <Typography variant="button" sx={{ whiteSpace: "nowrap", pr: 1 }}>
          節区切り
        </Typography>
      </Tooltip>
      <ToggleButtonGroup
        value={value}
        exclusive
        size="small"
        sx={{ "& *:focus": { outline: "none" } }}
        onChange={(_, newValue: string | null) => {
          if (!newValue) return;
          onChange(newValue.includes("before"), newValue.includes("middle"));
        }}
      >
        <ToggleButton value="none">
          {/* TooltipをToggleButtonの外に置くと、コードは減るが、選択時にハイライトされなくなるので注意 */}
          <Tooltip title="区切り＝なし" disableInteractive>
            <span style={{ marginLeft: 2, marginBottom: -4 }}>{<Page />}</span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before">
          <Tooltip title="区切り＝ページ前" disableInteractive>
            <span style={{ marginBottom: -3 }}>
              <Separator />
              <Page />
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="middle">
          <Tooltip title="区切り＝ページ途中" disableInteractive>
            <span style={{ marginLeft: 2, marginBottom: -3 }}>
              <Page sectionBreakInner={true} />
              <Separator />
              <Page sectionBreakInner={true} />
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before-middle">
          <Tooltip title="区切り＝ページ前・途中" disableInteractive>
            <span style={{ marginBottom: -3 }}>
              <Separator />
              <Page sectionBreakInner={true} />
              <Separator />
              <Page sectionBreakInner={true} />
            </span>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SectionBreak;
