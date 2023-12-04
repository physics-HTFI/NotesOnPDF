import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

/**
 * `Control`の引数
 */
interface Props {
  isWaiting: boolean;
}

/**
 * 処理中を表すモーダル表示
 */
const Waiting: React.FC<Props> = ({ isWaiting }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isWaiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Waiting;
