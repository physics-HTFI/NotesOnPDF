import { Backdrop, CircularProgress } from "@mui/material";

/**
 * 処理中を表すモーダル表示
 */
export default function Waiting({ isWaiting }: { isWaiting: boolean }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isWaiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
