import { FC } from "react";
import { Box } from "@mui/material";
import Checkbox from "./Checkbox";

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
      <Checkbox
        label="節区切り"
        checked={sectionBreak}
        tooltip="このページの前に節区切りを入れます"
        onChange={(checked) => {
          onChange(checked ? true : undefined, sectionBreakInner);
        }}
      />
      <Checkbox
        label="(ページ内)"
        checked={sectionBreakInner}
        tooltip="このページの途中に節区切りを入れます"
        onChange={(checked) => {
          onChange(sectionBreak, checked ? true : undefined);
        }}
      />
    </Box>
  );
};

export default SectionBreak;
