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
  snackbarMessage?: JSX.Element;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  setSnackbarMessage: (snackbarMessage?: JSX.Element) => void;
  setAccessFailedReason: (reason: string) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  waiting: false,
  readOnly: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
  setReadOnly: () => undefined,
  setSnackbarMessage: () => undefined,
  setAccessFailedReason: () => undefined,
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
  const [snackbarMessage, setSnackbarMessage] = useState<JSX.Element>();
  const [accessFailedReason, setAccessFailedReason] = useState<string>();
  const handleClose = () => {
    setAccessFailedReason(undefined);
    setSnackbarMessage(undefined);
  };

  return (
    <UiStateContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        waiting,
        readOnly,
        snackbarMessage,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
        setWaiting,
        setReadOnly,
        setSnackbarMessage,
        setAccessFailedReason,
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />
      <Snackbar open={accessFailedReason !== undefined} onClose={handleClose}>
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          {`${accessFailedReason}に失敗しました`}
          <br />
          NotesOnPdf.exeが起動していないか、入力が不正です
        </Alert>
      </Snackbar>

      {/* メッセージ（`flag && <></>`の形にしているのは非表示時に一瞬からのメッセージが表示されるのを防ぐため） */}
      {!!snackbarMessage && (
        <Snackbar open onClose={handleClose}>
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleClose}
            severity="info"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </UiStateContext.Provider>
  );
}
