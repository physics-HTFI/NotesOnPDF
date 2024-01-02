import { FC } from "react";
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
const Excluded: FC<Props> = ({ excluded, onChange }) => {
  return (
    <Tooltip title="このページを灰色にします" disableInteractive>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={excluded ?? false}
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
