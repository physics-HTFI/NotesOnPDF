import { FC } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * `CheckboxText`の`Props`
 */
interface Props {
  label: string;
  tooltip: string;
  text?: string;
  preferredText: string;
  onChange: (text?: string) => void;
}

/**
 * ☑ラベル ________
 * という形のコンポーネント
 */
const CheckboxText: FC<Props> = ({
  label,
  tooltip,
  text,
  preferredText,
  onChange,
}) => {
  const checked = text !== undefined;
  const textLocal = text ?? preferredText;

  return (
    <Box sx={{ whiteSpace: "nowrap", width: "100%", display: "flex" }}>
      <Tooltip title={tooltip} disableInteractive>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              size="small"
              onChange={(e) => {
                onChange(e.target.checked ? textLocal : undefined);
              }}
            />
          }
          label={<Typography variant="button">{label}</Typography>}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />
      </Tooltip>
      <TextField
        hidden={!checked}
        value={textLocal}
        variant="standard"
        InputProps={{
          sx: {
            fontSize: "140%",
            visibility: checked ? undefined : "hidden",
            height: 30,
            width: "auto",
            flexGrow: 1,
          },
        }}
        onChange={(e) => {
          onChange(checked ? e.target.value : undefined);
        }}
        sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
      />
    </Box>
  );
};

export default CheckboxText;
