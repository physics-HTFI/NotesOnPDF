import { ReactNode, createContext, useState } from "react";
import Waiting from "@/components/Fullscreen/Waiting";
import { Alert, Snackbar } from "@mui/material";

/**
 * UIの状態コンテクスト（待機中、ドロワーの開閉状態）
 */
export const UiStateContext = createContext<{
  openFileTreeDrawer: boolean;
  openSettingsDrawer: boolean;
  waiting: boolean;
  readOnly: boolean;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  setErrorMessage: (snackbarMessage?: JSX.Element) => void;
  setInfoMessage: (snackbarMessage?: JSX.Element) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  waiting: false,
  readOnly: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
  setReadOnly: () => undefined,
  setErrorMessage: () => undefined,
  setInfoMessage: () => undefined,
});

export default UiStateContext;

/**
 * `UiStateContext`のプロバイダー
 */
export function UiStateContextProvider({ children }: { children: ReactNode }) {
  const [openFileTreeDrawer, setOpenFileTreeDrawer] = useState(true);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState<JSX.Element>();
  const [infoMessage, setInfoMessage] = useState<JSX.Element>();

  return (
    <UiStateContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        waiting,
        readOnly,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
        setWaiting,
        setReadOnly,
        setErrorMessage,
        setInfoMessage,
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />

      <ErrorOrInfo
        severity="error"
        autoHideDuration={3000}
        onClose={() => {
          setErrorMessage(undefined);
        }}
        message={errorMessage}
      />
      <ErrorOrInfo
        severity="info"
        onClose={() => {
          setInfoMessage(undefined);
        }}
        message={infoMessage}
      />
    </UiStateContext.Provider>
  );
}

/**
 * エラー・情報をスナックバーで表示する
 */
function ErrorOrInfo({
  severity,
  autoHideDuration,
  onClose,
  message,
}: {
  severity: "error" | "info";
  autoHideDuration?: number;
  onClose: () => void;
  message?: JSX.Element;
}) {
  // メッセージ（`flag && <></>`の形にしているのは非表示時に空白のメッセージが一瞬表示されるのを防ぐため）
  if (!message) return undefined;
  return (
    <Snackbar
      autoHideDuration={autoHideDuration}
      open={!!message}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        onClose(); // 時間が経ったときに閉じる
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
