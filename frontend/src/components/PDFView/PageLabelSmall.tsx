import React from "react";
import { Chip } from "@mui/material";

/**
 * `PageLabelSmall`の引数
 */
interface Props {
  label?: string;
}

/**
 * 画面隅のページ数表示コンポーネント
 */
const PageLabelSmall: React.FC<Props> = ({ label }) => (
  <Chip
    sx={{
      position: "absolute",
      left: 3,
      bottom: 2,
      fontSize: "75%",
      cursor: "default",
    }}
    variant="outlined"
    color="success"
    label={label}
    size="small"
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
  />
);

export default PageLabelSmall;
