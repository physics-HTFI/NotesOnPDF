import { FC } from "react";
import { Box, TextField } from "@mui/material";
import Checkbox from "./Checkbox";

/**
 * `PageNumberRestart`の引数
 */
interface Props {
  numberRestart?: number;
  preferredPageNumber?: number;
  onChange: (numberRestart?: number) => void;
}

/**
 * ページ番号を設定するコンポーネント
 */
const PageNumberRestart: FC<Props> = ({
  numberRestart,
  preferredPageNumber,
  onChange,
}) => {
  const isManual = numberRestart !== undefined;
  const restart = numberRestart ?? preferredPageNumber ?? 1;

  return (
    <Box sx={{ whiteSpace: "nowrap" }}>
      {/* ページ番号を手動で決める */}
      <Checkbox
        label="ページ番号を手動で設定"
        checked={isManual}
        tooltip="チェックを外すと「前ページ＋１」がページ番号になります"
        onChange={(checked) => {
          onChange(checked ? restart : undefined);
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
          pl: 3.5,
          width: 80,
          visibility: isManual ? "visible" : "hidden",
        }}
      />
    </Box>
  );
};

export default PageNumberRestart;
