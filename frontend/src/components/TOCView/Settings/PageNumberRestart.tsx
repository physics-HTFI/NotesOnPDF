import { FC } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
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
const PageNumberRestart: FC<Props> = ({
  pageNumberRestart,
  preferredPageNumber,
  onChange,
}) => {
  const isManual = pageNumberRestart !== undefined;
  const restart = pageNumberRestart ?? preferredPageNumber ?? 1;

  return (
    <Box sx={{ whiteSpace: "nowrap" }}>
      {/* ページ番号を手動で決める */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isManual}
            onChange={(e) => {
              const newVal = e.target.checked;
              onChange(newVal ? restart : undefined);
            }}
          />
        }
        label={
          <Typography variant="button">ページ番号を手動で決める</Typography>
        }
        sx={{ pt: 1 }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      />
      <br />

      <TextField
        variant="standard"
        value={restart}
        onChange={(e) => {
          const num = Number(e.target.value);
          const numValidated = Math.min(999999, Math.max(1, num));
          onChange(isManual ? numValidated : undefined);
        }}
        InputProps={{ sx: { fontSize: "140%", pl: 1 } }}
        type="number"
        sx={{
          pl: 3.6,
          width: 80,
          visibility: isManual ? "visible" : "hidden",
        }}
      />
    </Box>
  );
};

export default PageNumberRestart;
