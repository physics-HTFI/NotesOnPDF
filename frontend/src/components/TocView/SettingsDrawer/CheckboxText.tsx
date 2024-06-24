import { Box, TextField, Tooltip } from "@mui/material";
import Checkbox from "./Checkbox";
import { ReactNode } from "react";

/**
 * ☑ラベル ________
 * という形のコンポーネント
 */
export default function CheckboxText({
  label,
  tooltip,
  text,
  preferredText,
  onChange,
}: {
  label: string;
  tooltip?: ReactNode;
  text?: string;
  preferredText: string;
  onChange: (text?: string) => void;
}) {
  const checked = text !== undefined;
  const textLocal = text ?? preferredText;

  return (
    <Tooltip title={tooltip} disableInteractive placement="right">
      <Box sx={{ whiteSpace: "nowrap", width: "100%", display: "flex" }}>
        <Checkbox
          label={label}
          checked={checked}
          onChange={(checked) => {
            onChange(checked ? textLocal : undefined);
          }}
        />
        <TextField
          hidden={!checked}
          value={textLocal}
          variant="standard"
          InputProps={{
            sx: {
              fontSize: "140%",
              visibility: checked ? undefined : "hidden",
              height: 30,
              width: "auto",
              flexGrow: 1,
            },
          }}
          onChange={(e) => {
            onChange(checked ? e.target.value : undefined);
          }}
          sx={{ flexGrow: 1, pb: 0.5, pt: 1 }}
        />
      </Box>
    </Tooltip>
  );
}
