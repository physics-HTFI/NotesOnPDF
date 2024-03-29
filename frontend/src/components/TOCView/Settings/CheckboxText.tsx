import { FC } from "react";
import { Box, TextField } from "@mui/material";
import Checkbox from "./Checkbox";

/**
 * `CheckboxText`の`Props`
 */
interface Props {
  label: string;
  tooltip?: string;
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
      <Checkbox
        label={label}
        checked={checked}
        tooltip={tooltip}
        onChange={(checked) => {
          onChange(checked ? textLocal : undefined);
        }}
      />
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
