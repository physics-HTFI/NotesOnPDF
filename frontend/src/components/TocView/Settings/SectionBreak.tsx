import { FC } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { getPage, getSeparator } from "../getTocData";

/**
 * `SctionBreak`の引数
 */
interface Props {
  breakBefore?: boolean;
  breakMiddle?: boolean;
  onChange: (breakBefore: boolean, breakMiddle: boolean) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: FC<Props> = ({ breakBefore, breakMiddle, onChange }) => {
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
      <Typography variant="button" sx={{ whiteSpace: "nowrap", pr: 1 }}>
        節区切り
      </Typography>
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
          <Tooltip title="区切りなし">
            <span style={{ marginLeft: 2, marginBottom: -4 }}>{getPage()}</span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before">
          <Tooltip title="ページ前に区切り">
            <span style={{ marginBottom: -3 }}>
              {getSeparator()}
              {getPage()}
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="middle">
          <Tooltip title="ページ途中に区切り">
            <span style={{ marginLeft: 2, marginBottom: -3 }}>
              {getPage(true)}
              {getSeparator()}
              {getPage(true)}
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before-middle">
          <Tooltip title="ページ前・途中に区切り">
            <span style={{ marginBottom: -3 }}>
              {getSeparator()}
              {getPage(true)}
              {getSeparator()}
              {getPage(true)}
            </span>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SectionBreak;
