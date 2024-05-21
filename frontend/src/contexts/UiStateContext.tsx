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
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />

      {/* メッセージ（`flag && <></>`の形にしているのは非表示時に空白のメッセージが一瞬表示されるのを防ぐため） */}
      {!!snackbarMessage && (
        <Snackbar
          open={!!snackbarMessage}
          onClose={(_, reason) => {
            if (reason === "clickaway") return;
            setSnackbarMessage(undefined);
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="info"
            onClose={() => {
              setSnackbarMessage(undefined);
            }}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </UiStateContext.Provider>
  );
}
