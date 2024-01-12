import { FC } from "react";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ClickOption } from "@/types/AppSettings";

/**
 * `ClickOptionSelect`の引数
 */
interface Props {
  value: ClickOption;
  label: string;
  onChange: (option: ClickOption) => void;
}

/**
 * 注釈クリック時の処理を設定するコンポーネント
 */
const ClickOptionSelect: FC<Props> = ({ value, label, onChange }) => {
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
        value={value ?? "none"}
        variant="standard"
        onChange={(e: SelectChangeEvent<string | undefined>) => {
          const v = e.target.value;
          if (v !== "none" && v !== "edit" && v !== "move" && v !== "delete")
            return;
          onChange(v === "none" ? null : v);
        }}
        sx={{ flexGrow: 1, fontSize: "160%" }}
      >
        <MenuItem value={"none"}>なし</MenuItem>
        <MenuItem value={"edit"}>変更</MenuItem>
        <MenuItem value={"move"}>移動・変形</MenuItem>
        <MenuItem value={"delete"}>削除</MenuItem>
      </Select>
    </Box>
  );
};

export default ClickOptionSelect;
