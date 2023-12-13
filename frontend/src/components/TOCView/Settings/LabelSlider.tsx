import React from "react";
import { Box, Slider, Typography } from "@mui/material";

/**
 * `LabelSlider`の`Props`
 */
interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * ラベル付きスライダーのコンポーネント
 */
const LabelSlider: React.FC<Props> = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: "flex", "&:first-child": { mb: 1 } }}>
      <Typography variant="button" sx={{ whiteSpace: "nowrap", pr: 2 }}>
        {label}
      </Typography>
      <Slider
        size="small"
        min={0}
        max={25}
        step={1}
        value={value}
        sx={{ flexGrow: 1 }}
        valueLabelDisplay="auto"
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