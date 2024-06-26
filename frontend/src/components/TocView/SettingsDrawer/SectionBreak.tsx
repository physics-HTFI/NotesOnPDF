import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import Separator from "../Toc/Separator";
import Page from "../Toc/Page";

/**
 * 節区切りを設定するコンポーネント
 */
export default function SectionBreak({
  breakBefore,
  breakMiddle,
  onChange,
}: {
  breakBefore?: boolean;
  breakMiddle?: boolean;
  onChange: (breakBefore: boolean, breakMiddle: boolean) => void;
}) {
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
          <Tooltip
            title={
              <span>
                区切り＝なし
                <br />
                [Enter] 区切りの切り替え
              </span>
            }
            disableInteractive
          >
            <span style={{ marginLeft: 2, marginBottom: -4 }}>{<Page />}</span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before">
          <Tooltip
            title={
              <span>
                区切り＝ページ前
                <br />
                [Enter] 区切りの切り替え
              </span>
            }
            disableInteractive
          >
            <span style={{ marginBottom: -3 }}>
              <Separator background="white" />
              <Page />
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="middle">
          <Tooltip
            title={
              <span>
                区切り＝ページ途中
                <br />
                [Enter] 区切りの切り替え
              </span>
            }
            disableInteractive
          >
            <span style={{ marginLeft: 2, marginBottom: -3 }}>
              <Page sectionBreakInner={true} />
              <Separator background="white" />
              <Page sectionBreakInner={true} />
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="before-middle">
          <Tooltip
            title={
              <span>
                区切り＝ページ前・途中
                <br />
                [Enter] 区切りの切り替え
              </span>
            }
            disableInteractive
          >
            <span style={{ marginBottom: -3 }}>
              <Separator background="white" />
              <Page sectionBreakInner={true} />
              <Separator background="white" />
              <Page sectionBreakInner={true} />
            </span>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
