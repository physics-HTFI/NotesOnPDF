import { FC } from "react";
import { Box, Slider, Typography } from "@mui/material";

/**
 * `LabelSlider`の`Props`
 */
interface Props {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
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
  onChange,
}) => {
  return (
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
  );
};

export default LabelSlider;
