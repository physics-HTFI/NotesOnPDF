import { ReactNode, createContext, useState } from "react";
import Waiting from "@/components/Fullscreen/Waiting";
import { Alert, Backdrop, Button, Snackbar, Stack } from "@mui/material";

/**
 * UIの状態コンテクスト（待機中、ドロワーの開閉状態）
 */
export const UiStateContext = createContext<{
  openFileTreeDrawer: boolean;
  openSettingsDrawer: boolean;
  waiting: boolean;
  readOnly: boolean;
  initialized: boolean;
  inert: boolean;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  setErrorMessage: (snackbarMessage?: JSX.Element) => void;
  setInfoMessage: (snackbarMessage?: JSX.Element) => void;
  setRootDirectoryChanged: (waiting: boolean) => void;
  setServerFailed: (waiting: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  waiting: false,
  readOnly: false,
  initialized: false,
  inert: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
  setReadOnly: () => undefined,
  setErrorMessage: () => undefined,
  setInfoMessage: () => undefined,
  setRootDirectoryChanged: () => undefined,
  setServerFailed: () => undefined,
  setInitialized: () => undefined,
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
  const [rootDirectoryChanged, setRootDirectoryChanged] = useState(false);
  const [serverFailed, setServerFailed] = useState(false);
  const [initialized, setInitialized] = useState(false);

  return (
    <UiStateContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        waiting,
        readOnly,
        initialized,
        inert: serverFailed || rootDirectoryChanged,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
        setWaiting,
        setReadOnly,
        setErrorMessage,
        setInfoMessage,
        setRootDirectoryChanged,
        setServerFailed,
        setInitialized,
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />

      {!serverFailed && !rootDirectoryChanged && (
        <>
          {/* エラー */}
          <ErrorOrInfo
            severity="error"
            autoHideDuration={3000}
            onClose={() => {
              setErrorMessage(undefined);
            }}
            message={errorMessage}
          />

          {/* インフォ */}
          <ErrorOrInfo
            severity="info"
            onClose={() => {
              setInfoMessage(undefined);
            }}
            message={infoMessage}
          />
        </>
      )}

      {/* 起動待ち */}
      <CriticalError
        open={serverFailed && !rootDirectoryChanged}
        needsReload={!initialized}
      >
        {initialized ? (
          <>
            NotesOnPdf を起動してください
            <br />
            再起動するのを待っています...
          </>
        ) : (
          <>
            NotesOnPdf が起動していません
            <br />
            起動してからリロードしてください
          </>
        )}
      </CriticalError>

      {/* 基準フォルダ変更によるリロード */}
      <CriticalError open={rootDirectoryChanged} needsReload={true}>
        <>
          設定が変更されました
          <br />
          リロードしてください
        </>
      </CriticalError>
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

/**
 * バックエンドが起動していない、または、設定を変更してためにリロードが必要であることを示すスナックバー
 */
function CriticalError({
  open,
  needsReload,
  children,
}: {
  open: boolean;
  needsReload: boolean;
  children: JSX.Element;
}) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Snackbar open={open}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          <Stack direction="row">
            <span>{children}</span>
            {needsReload && (
              <Button
                variant="contained"
                color="warning"
                sx={{ ml: 2 }}
                onClick={() => {
                  location.reload();
                }}
              >
                リロード
              </Button>
            )}
          </Stack>
        </Alert>
      </Snackbar>
    </Backdrop>
  );
}
