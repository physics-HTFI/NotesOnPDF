import { ReactNode, createContext, useCallback, useState } from "react";
import Waiting from "@/components/dialogs/Waiting";
import { Alert, Snackbar } from "@mui/material";

/**
 * UIの状態コンテクスト（待機中、ドロワーの開閉状態）
 */
export const UiContext = createContext<{
  openFileTreeDrawer: boolean;
  openSettingsDrawer: boolean;
  waiting: boolean;
  readOnly: boolean;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  setAlert: (severity?: "error" | "info", message?: ReactNode) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  waiting: false,
  readOnly: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
  setReadOnly: () => undefined,
  setAlert: () => undefined,
});

export default UiContext;

/**
 * `UiContext`のプロバイダー
 */
export function UiContextProvider({ children }: { children: ReactNode }) {
  const [openFileTreeDrawer, setOpenFileTreeDrawer] = useState(true);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [alert, setAlert] = useState<ReactNode>();
  const [severity, setSeverity] = useState<"error" | "info">();
  // この関数はコンテクストに渡すのでuseCallbackしておく
  const setAlertAndSeverity = useCallback(
    (severity?: "error" | "info", alert?: ReactNode) => {
      setAlert(alert);
      setSeverity(alert === undefined ? undefined : severity);
    },
    []
  );

  return (
    <UiContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        waiting,
        readOnly,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
        setWaiting,
        setReadOnly,
        setAlert: setAlertAndSeverity,
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />

      {/* エラー・インフォ */}
      <ErrorOrInfo
        severity={severity}
        onClose={() => {
          setAlert(undefined);
        }}
        message={alert}
      />
    </UiContext.Provider>
  );
}

/**
 * エラー・情報をスナックバーで表示する
 */
function ErrorOrInfo({
  severity,
  onClose,
  message,
}: {
  severity?: "error" | "info";
  onClose: () => void;
  message?: ReactNode;
}) {
  // メッセージ（`flag && <></>`の形にしているのは非表示時に空白のメッセージが一瞬表示されるのを防ぐため）
  if (!message) return undefined;
  return (
    <Snackbar
      open={!!message}
      onClose={() => {
        onClose();
      }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
