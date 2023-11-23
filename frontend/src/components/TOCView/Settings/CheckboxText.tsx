import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch, TextField, Typography } from "@mui/material";

/**
 * `CheckboxText`の`Props`
 */
interface Props {
  label: string;
  checked: boolean;
  text: string;
  onChange: (checked: boolean, text: string) => void;
}

/**
 * ☑ラベル ________
 * という形のコンポーネント
 */
const CheckboxText: React.FC<Props> = ({ label, checked, text, onChange }) => {
  const [textLocal, setTextLocal] = useState("");
  const [checkedLocal, setCheckedLocal] = useState(false);

  useEffect(() => {
    setTextLocal(text);
    setCheckedLocal(checked);
  }, [text, checked]);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={checkedLocal}
            size="small"
            onChange={(e) => {
              const newVal = e.target.checked;
              setCheckedLocal(newVal);
              onChange(newVal, textLocal);
            }}
          />
        }
        label={<Typography variant="button">{label}</Typography>}
      />
      <TextField
        hidden={!checkedLocal}
        value={textLocal}
        variant="standard"
        InputProps={{
          sx: {
            fontSize: "140%",
            visibility: checkedLocal ? "visible" : "hidden",
            height: 30,
          },
        }}
        onChange={(e) => {
          const newVal = e.target.value;
          setTextLocal(newVal);
          onChange(checkedLocal, newVal);
        }}
        sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
      />
    </>
  );
};

export default CheckboxText;
