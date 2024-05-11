import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * チェックボックス
 */
export default function Checkbox({
  label,
  checked,
  tooltip,
  onChange,
}: {
  label: string;
  checked?: boolean;
  tooltip?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Tooltip title={tooltip} disableInteractive placement="right">
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
}
