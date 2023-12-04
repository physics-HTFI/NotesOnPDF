import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
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
const CheckboxText: React.FC<Props> = ({
  label,
  tooltip,
  text,
  preferredText,
  onChange,
}) => {
  const [textLocal, setTextLocal] = useState("");
  const [checkedLocal, setCheckedLocal] = useState(false);

  useEffect(() => {
    setCheckedLocal(text !== undefined);
    setTextLocal(text ?? preferredText);
  }, [text, preferredText]);

  return (
    <Box sx={{ whiteSpace: "nowrap", width: "100%", display: "flex" }}>
      <Tooltip title={tooltip} disableInteractive>
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
      </Tooltip>
      <TextField
        hidden={!checkedLocal}
        value={textLocal}
        variant="standard"
        InputProps={{
          sx: {
            fontSize: "140%",
            visibility: checkedLocal ? "visible" : "hidden",
            height: 30,
            width: "auto",
            flexGrow: 1,
          },
        }}
        onChange={(e) => {
          const newVal = e.target.value;
          setTextLocal(newVal);
          onChange(checkedLocal ? newVal : undefined);
        }}
        sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
      />
    </Box>
  );
};

export default CheckboxText;
