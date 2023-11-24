import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch, Typography } from "@mui/material";

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
    <FormControlLabel
      control={
        <Switch
          size="small"
          checked={excludedLocal}
          onChange={(e) => {
            const newVal = e.target.checked;
            setExcludedLocal(newVal);
            onChange(newVal);
          }}
        />
      }
      label={<Typography variant="button">このページを除外する</Typography>}
      sx={{ pt: 1 }}
    />
  );
};

export default Excluded;
