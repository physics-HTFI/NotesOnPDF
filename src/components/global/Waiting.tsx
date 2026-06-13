import { modelUI } from "@/models/modelUI/modelUI";
import { Backdrop, CircularProgress } from "@mui/material";

/**
 * 処理中を表すモーダル表示
 */
export function Waiting() {
  const waiting = modelUI.waiting.useValue();
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={waiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
