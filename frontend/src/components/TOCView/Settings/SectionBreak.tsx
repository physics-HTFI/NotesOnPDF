import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * `SctionBreak`の引数
 */
interface Props {
  sectionBreak?: boolean;
  onChange: (sectionBreak?: boolean) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: React.FC<Props> = ({ sectionBreak, onChange }) => {
  const [sectionBreakLocal, setSectionBreakLocal] = useState(false);

  useEffect(() => {
    setSectionBreakLocal(sectionBreak ?? false);
  }, [sectionBreak]);
  return (
    <>
      <Tooltip title="このページの前に空白を入れます" disableInteractive>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={sectionBreakLocal}
              onChange={(e) => {
                const newVal = e.target.checked;
                setSectionBreakLocal(newVal);
                onChange(newVal ? true : undefined);
              }}
            />
          }
          label={<Typography variant="button">節区切り</Typography>}
        />
      </Tooltip>
      <Box sx={{ width: "100%" }} />
    </>
  );
};

export default SectionBreak;
