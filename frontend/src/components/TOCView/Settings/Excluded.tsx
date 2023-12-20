import React from "react";
import { FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";

/**
 * `Excluded`の引数
 */
interface Props {
  excluded?: boolean;
  onChange: (exclude?: boolean) => void;
}

/**
 * ページを除外するかを決めるコンポーネント
 */
const Excluded: React.FC<Props> = ({ excluded, onChange }) => {
  const excludedLocal = excluded ?? false;

  return (
    <Tooltip title="このページを灰色にします" disableInteractive>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={excludedLocal}
            onChange={(e) => {
              onChange(e.target.checked ? true : undefined);
            }}
          />
        }
        label={<Typography variant="button">このページを除外する</Typography>}
        sx={{ pt: 1, width: "100%", whiteSpace: "nowrap" }}
      />
    </Tooltip>
  );
};

export default Excluded;
