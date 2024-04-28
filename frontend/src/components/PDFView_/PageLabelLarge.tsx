import { FC } from "react";
import { Paper } from "@mui/material";

/**
 * `PageLabelLarge`の引数
 */
interface Props {
  label?: string;
  shown: boolean;
}

/**
 * 画面中央のページ数表示コンポーネント
 */
const PageLabelLarge: FC<Props> = ({ label, shown }) =>
  shown && (
    <Paper
      elevation={5}
      sx={{
        color: "white",
        background: "darkseagreen",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 140,
        height: 50,
        m: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2em",
      }}
    >
      {label}
    </Paper>
  );

export default PageLabelLarge;
