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

      {/* メッセージ（`flag && <></>`の形にしているのは非表示時に空白のメッセージが一瞬表示されるのを防ぐため） */}
      {!!errorMessage && (
        <Snackbar
          autoHideDuration={3000}
          open={!!errorMessage}
          onClose={(_, reason) => {
            if (reason === "clickaway") return;
            setErrorMessage(undefined);
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={() => {
              setErrorMessage(undefined);
            }}
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      {!!infoMessage && (
        <Snackbar
          open={!!infoMessage}
          onClose={(_, reason) => {
            if (reason === "clickaway") return;
            setInfoMessage(undefined);
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="info"
            onClose={() => {
              setInfoMessage(undefined);
            }}
            sx={{ width: "100%" }}
          >
            {infoMessage}
          </Alert>
        </Snackbar>
      )}
    </UiStateContext.Provider>
  );
}
