import { modelGlobal } from "@/global/modelGlobal";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";

/**
 * 処理中を表すモーダル表示
 */
export function Waiting() {
  const waiting = useAtomValue(modelGlobal.waiting.atom);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={waiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
