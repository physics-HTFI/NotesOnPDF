import React, { useEffect, useState } from "react";
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
  const [excludedLocal, setExcludedLocal] = useState(false);

  useEffect(() => {
    setExcludedLocal(excluded ?? false);
  }, [excluded]);

  return (
    <Tooltip title="このページを灰色にします" disableInteractive>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={excludedLocal}
            onChange={(e) => {
              const newVal = e.target.checked;
              setExcludedLocal(newVal);
              onChange(newVal ? true : undefined);
            }}
          />
        }
        label={<Typography variant="button">このページを除外する</Typography>}
        sx={{ pt: 1 }}
      />
    </Tooltip>
  );
};

export default Excluded;
