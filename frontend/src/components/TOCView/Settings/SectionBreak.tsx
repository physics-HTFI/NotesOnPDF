import React, { useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import {
  getSectionBreak,
  SectionBreak as SectionBreakType,
} from "../../../types/Notes";

/**
 * `SctionBreak`の引数
 */
interface Props {
  sectionBreak?: SectionBreakType;
  onChange: (sectionBreak: SectionBreakType) => void;
}

/**
 * 節区切りを設定するコンポーネント
 */
const SectionBreak: React.FC<Props> = ({ sectionBreak, onChange }) => {
  const [top, setTop] = useState(false);
  const [middle, setMiddle] = useState(false);

  useEffect(() => {
    setTop(sectionBreak?.includes("top") ?? false);
    setMiddle(sectionBreak?.includes("middle") ?? false);
  }, [sectionBreak]);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={top}
            onChange={(e) => {
              const newVal = e.target.checked;
              setTop(newVal);
              onChange(getSectionBreak(newVal, middle));
            }}
          />
        }
        label={<Typography variant="button">節区切り</Typography>}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={middle}
            onChange={(e) => {
              const newVal = e.target.checked;
              setMiddle(newVal);
              onChange(getSectionBreak(top, newVal));
            }}
          />
        }
        label={<Typography variant="button">ページ途中</Typography>}
      />
      <Box sx={{ width: "100%" }} />
    </>
  );
};

export default SectionBreak;
