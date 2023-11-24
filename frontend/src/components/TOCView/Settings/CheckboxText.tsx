import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch, TextField, Typography } from "@mui/material";

/**
 * `CheckboxText`の`Props`
 */
interface Props {
  label: string;
  text?: string;
  preferredText?: string;
  onChange: (text?: string) => void;
}

/**
 * ☑ラベル ________
 * という形のコンポーネント
 */
const CheckboxText: React.FC<Props> = ({
  label,
  text,
  preferredText,
  onChange,
}) => {
  const [textLocal, setTextLocal] = useState("");
  const [checkedLocal, setCheckedLocal] = useState(false);

  useEffect(() => {
    setCheckedLocal(text !== undefined);
    setTextLocal(text ?? preferredText ?? "");
  }, [text, preferredText]);

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
              onChange(newVal ? textLocal : undefined);
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
          onChange(checkedLocal ? newVal : undefined);
        }}
        sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
      />
    </>
  );
};

export default CheckboxText;
