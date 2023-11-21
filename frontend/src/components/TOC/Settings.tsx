import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

/**
 * `Settings`の引数
 */
interface Props {
  dummy?: number;
}

/**
 * 設定パネル
 */
const Settings: React.FC<Props> = () => {
  return (
    <Box sx={{ fontSize: "80%", p: 1, pl: 1.5 }}>
      <FormControlLabel
        control={<Switch size="small" />}
        label={<Typography variant="button">題区切り</Typography>}
      />
      <TextField variant="standard" InputProps={{ sx: { fontSize: "140%" } }} />
      <br />
      <FormControlLabel
        control={<Switch size="small" />}
        label={<Typography variant="button">部区切り</Typography>}
      />
      <TextField variant="standard" InputProps={{ sx: { fontSize: "140%" } }} />
      <br />
      <FormControlLabel
        control={<Switch size="small" />}
        label={<Typography variant="button">章区切り</Typography>}
      />
      <TextField variant="standard" InputProps={{ sx: { fontSize: "140%" } }} />
      <br />
      <FormControlLabel
        control={<Switch size="small" />}
        label={<Typography variant="button">節区切り</Typography>}
      />
      <br />
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={<Typography variant="button">ページ前で区切る</Typography>}
      />
      <br />
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={<Typography variant="button">ページ途中で区切る</Typography>}
      />
      <br />
      <FormControlLabel
        control={<Switch size="small" />}
        label={
          <Typography variant="button">
            ページ番号を前ページから決める
          </Typography>
        }
      />
      <br />
      <Typography variant="button">新しく始める</Typography>
      <TextField
        variant="standard"
        InputProps={{ sx: { fontSize: "140%" } }}
        type="number"
      />
      <br />
      <FormControlLabel
        control={<Switch size="small" />}
        label={<Typography variant="button">このページを除外する</Typography>}
      />
      <br />
    </Box>
  );
};

export default Settings;
