import { FC } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * `SctionBreak`の引数
 */
interface Props {
  sectionBreak?: boolean;
  sectionBreakInner?: boolean;
  onChange: (sectionBreak?: boolean, sectionBreakInner?: boolean) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: FC<Props> = ({
  sectionBreak,
  sectionBreakInner,
  onChange,
}) => {
  return (
    <Box
      sx={{ whiteSpace: "nowrap", display: "flex", flexDirection: "row" }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <Tooltip title="このページの前に節区切りを入れます" disableInteractive>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={sectionBreak ?? false}
              onChange={(e) => {
                onChange(e.target.checked, sectionBreakInner);
              }}
            />
          }
          label={<Typography variant="button">節区切り</Typography>}
        />
      </Tooltip>
      <Tooltip title="このページの途中に節区切りを入れます" disableInteractive>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={sectionBreakInner ?? false}
              onChange={(e) => {
                onChange(sectionBreak, e.target.checked);
              }}
            />
          }
          label={<Typography variant="button">(ページ内)</Typography>}
        />
      </Tooltip>
    </Box>
  );
};

export default SectionBreak;
