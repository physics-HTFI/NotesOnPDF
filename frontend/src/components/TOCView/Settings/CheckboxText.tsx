import React from "react";
import { FormControlLabel, Switch, TextField, Typography } from "@mui/material";

/**
 * `CheckboxText`の`Props`
 */
interface Props {
  label: string;
  checked: boolean;
  setChecked: (v: boolean) => void;
  text: string;
  setText: (v: string) => void;
}

/**
 * ☑ラベル ________
 * という形のコンポーネント
 */
const CheckboxText: React.FC<Props> = ({
  label,
  checked,
  setChecked,
  text,
  setText,
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            size="small"
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          />
        }
        label={<Typography variant="button">{label}</Typography>}
      />
      <TextField
        hidden={!checked}
        value={text}
        variant="standard"
        InputProps={{
          sx: {
            fontSize: "140%",
            visibility: checked ? "visible" : "hidden",
            height: 30,
          },
        }}
        onChange={(e) => {
          setText(e.target.value);
        }}
        sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
      />
    </>
  );
};

export default CheckboxText;
