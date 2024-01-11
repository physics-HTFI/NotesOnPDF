import { FC } from "react";
import { Box, TextField } from "@mui/material";
import Checkbox from "./Checkbox";

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
      <Checkbox
        label="ページ番号を手動で決める"
        checked={isManual}
        tooltip="チェックを外すと、ページ番号を前のページから決めます"
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
          pl: 3.6,
          width: 80,
          visibility: isManual ? "visible" : "hidden",
        }}
      />
    </Box>
  );
};

export default PageNumberRestart;
