import { modelUI } from "@/models/modelUI";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";

/**
 * 処理中を表すモーダル表示
 */
export function Waiting() {
  const waiting = useAtomValue(modelUI.waiting.atom);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={waiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
