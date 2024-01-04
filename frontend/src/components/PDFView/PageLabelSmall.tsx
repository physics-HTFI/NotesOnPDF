import { FC } from "react";
import { Chip } from "@mui/material";

/**
 * `PageLabelSmall`の引数
 */
interface Props {
  label?: string;
  hidden: boolean;
}

/**
 * 画面隅のページ数表示コンポーネント
 */
const PageLabelSmall: FC<Props> = ({ label, hidden }) => (
  <Chip
    sx={{
      position: "absolute",
      left: 3,
      bottom: 2,
      fontSize: "75%",
      cursor: "default",
      visibility: hidden ? "collapse" : undefined,
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
