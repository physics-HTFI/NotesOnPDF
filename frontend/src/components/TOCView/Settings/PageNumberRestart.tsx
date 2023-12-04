import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

/**
 * `PageNumberRestart`の引数
 */
interface Props {
  pageNumberRestart?: number;
  preferredPageNumber?: number;
  onChange: (pageNumberRestart?: number) => void;
}

/**
 * ページ番号を設定するコンポーネント
 */
const PageNumberRestart: React.FC<Props> = ({
  pageNumberRestart,
  preferredPageNumber,
  onChange,
}) => {
  const [checked, setChecked] = useState(false);
  const [restart, setRestart] = useState(1);

  useEffect(() => {
    setChecked(pageNumberRestart === undefined);
    setRestart(pageNumberRestart ?? preferredPageNumber ?? 1);
  }, [pageNumberRestart, preferredPageNumber]);

  return (
    <Box sx={{ whiteSpace: "nowrap" }}>
      {/* ページ番号を前ページから決める */}
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={checked}
            onChange={(e) => {
              const newVal = e.target.checked;
              setChecked(newVal);
              onChange(newVal ? undefined : restart);
            }}
          />
        }
        label={
          <Typography variant="button" color={checked ? undefined : "gray"}>
            ページ番号を前ページから決める
          </Typography>
        }
        sx={{ pt: 1 }}
      />
      <br />

      {/* 新しく始める */}
      <Typography
        variant="button"
        sx={{
          pl: 3.6,
          visibility: checked ? "hidden" : "visible",
        }}
      >
        新しく始める
      </Typography>
      <TextField
        variant="standard"
        value={restart}
        onChange={(e) => {
          const num = Number(e.target.value);
          const numValidated = Math.min(999999, Math.max(1, num));
          setRestart(numValidated);
          onChange(checked ? undefined : numValidated);
        }}
        InputProps={{ sx: { fontSize: "140%", pl: 1 } }}
        type="number"
        sx={{
          width: 80,
          pl: 1,
          visibility: checked ? "hidden" : "visible",
        }}
      />
    </Box>
  );
};

export default PageNumberRestart;
