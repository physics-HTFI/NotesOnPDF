import { FC } from "react";
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * `Checkbox`の引数
 */
interface Props {
  label: string;
  checked?: boolean;
  tooltip?: string;
  onChange: (checked: boolean) => void;
}

/**
 * チェックボックス
 */
const Checkbox: FC<Props> = ({ label, checked, tooltip, onChange }) => {
  return (
    <Tooltip title={tooltip} disableInteractive followCursor placement="bottom">
      <FormControlLabel
        control={
          <MuiCheckbox
            size="small"
            checked={checked ?? false}
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
        }
        label={<Typography variant="button">{label}</Typography>}
        sx={{ whiteSpace: "nowrap" }}
      />
    </Tooltip>
  );
};

export default Checkbox;
