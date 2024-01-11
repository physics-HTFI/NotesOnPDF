import { FC } from "react";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

/**
 * `ClickOption`の引数
 */
interface Props {
  value?: string;
  label: string;
  onChange: (option: string | undefined) => void;
}

/**
 * 注釈クリック時の処理を設定するコンポーネント
 */
const ClickOption: FC<Props> = ({ value, label, onChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
      <Typography
        variant="button"
        sx={{ whiteSpace: "nowrap", pr: 2 }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        {label}
      </Typography>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        variant="standard"
        onChange={(e: SelectChangeEvent<string | undefined>) => {
          onChange(e.target.value);
        }}
        sx={{ flexGrow: 1 }}
      >
        <MenuItem value={undefined}>なし</MenuItem>
        <MenuItem value={"edit"}>変更</MenuItem>
        <MenuItem value={"delete"}>削除</MenuItem>
      </Select>
    </Box>
  );
};

export default ClickOption;
