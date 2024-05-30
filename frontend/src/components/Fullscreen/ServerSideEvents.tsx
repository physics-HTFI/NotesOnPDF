import ModelContext from "@/contexts/ModelContext";
import { Alert, Backdrop, Snackbar } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";

/**
 * サーバーからのメッセージを受け取るコンポーネント
 */
export default function ServerSideEvents() {
  const { model } = useContext(ModelContext);
  const [connectionError, setConnectionError] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);
  const eventSource = useRef<EventSource>();

  useEffect(() => {
    eventSource.current = model.getEventSource();
    if (!eventSource.current) return;
    eventSource.current.onerror = () => {
      setConnectionError(true);
    };
    eventSource.current.onmessage = (e) => {
      setConnectionError(false);
      if (e.data === "reload") {
        setNeedsReload(true);
      }
    };
    return () => {
      document.oncontextmenu = null;
      eventSource.current?.close();
    };
  }, [model]);

  if (!eventSource.current) return undefined;

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={connectionError || needsReload}
    >
      <Snackbar open={connectionError && !needsReload}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          NotesOnPdf が起動していません
          <br />
          起動を待っています
        </Alert>
      </Snackbar>
      <Snackbar open={needsReload}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          設定が変更されました
          <br />
          リロードしてください
        </Alert>
      </Snackbar>
    </Backdrop>
  );
}
