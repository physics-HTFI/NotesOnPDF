import { FC } from "react";
import { Box, Slider, Tooltip, Typography } from "@mui/material";

/**
 * `LabelSlider`の`Props`
 */
interface Props {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  tooltipTitle: string;
  onChange: (value: number) => void;
}

/**
 * ラベル付きスライダーのコンポーネント
 */
const LabelSlider: FC<Props> = ({
  label,
  value,
  minValue,
  maxValue,
  step,
  tooltipTitle,
  onChange,
}) => {
  return (
    <Tooltip title={tooltipTitle} disableInteractive placement="right">
      <Box sx={{ display: "flex", pt: 1 }}>
        <Typography
          variant="button"
          sx={{ whiteSpace: "nowrap", pr: 2, width: 110 }}
        >
          {label}
        </Typography>
        <Slider
          size="small"
          min={minValue}
          max={maxValue}
          step={step}
          value={value}
          sx={{ flexGrow: 1 }}
          valueLabelDisplay="off"
          onChange={(_, v) => {
            if (typeof v === "number") {
              onChange(v);
            }
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default LabelSlider;
