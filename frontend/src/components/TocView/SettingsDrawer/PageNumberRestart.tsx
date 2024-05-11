import { Box, TextField } from "@mui/material";
import Checkbox from "./Checkbox";

/**
 * ページ番号を設定するコンポーネント
 */
export default function PageNumberRestart({
  numberRestart,
  preferredPageNumber,
  onChange,
}: {
  numberRestart?: number;
  preferredPageNumber?: number;
  onChange: (numberRestart?: number) => void;
}) {
  const isManual = numberRestart !== undefined;
  const restart = numberRestart ?? preferredPageNumber ?? 1;

  return (
    <Box sx={{ whiteSpace: "nowrap" }}>
      {/* ページ番号を手動で決める */}
      <Checkbox
        label="ページ番号を振りなおす"
        checked={isManual}
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
}
