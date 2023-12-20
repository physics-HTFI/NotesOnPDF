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
  sectionBreakInner?: boolean;
  onChange: (sectionBreak: boolean, sectionBreakInner: boolean) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: React.FC<Props> = ({
  sectionBreak,
  sectionBreakInner,
  onChange,
}) => {
  const [sectionBreakLocal, setSectionBreakLocal] = useState(false);
  const [sectionBreakInnerLocal, setSectionBreakInnerLocal] = useState(false);

  useEffect(() => {
    setSectionBreakLocal(sectionBreak ?? false);
    setSectionBreakInnerLocal(sectionBreakInner ?? false);
  }, [sectionBreak, sectionBreakInner]);
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Tooltip title="このページの前に節区切りを入れます" disableInteractive>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={sectionBreakLocal}
              onChange={(e) => {
                const newVal = e.target.checked;
                setSectionBreakLocal(newVal);
                onChange(newVal, sectionBreakInnerLocal);
              }}
            />
          }
          label={<Typography variant="button">節区切り</Typography>}
        />
      </Tooltip>
      <Tooltip title="このページの途中に節区切りを入れます" disableInteractive>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={sectionBreakInnerLocal}
              onChange={(e) => {
                const newVal = e.target.checked;
                setSectionBreakInnerLocal(newVal);
                onChange(sectionBreakLocal, newVal);
              }}
            />
          }
          label={<Typography variant="button">(途中)</Typography>}
        />
      </Tooltip>
    </Box>
  );
};

export default SectionBreak;
