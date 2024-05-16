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
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
  setAccessFailedReason: (reason: string) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  waiting: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
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
  const [accessFailedReason, setAccessFailedReason] = useState<string>();
  const handleClose = () => {
    setAccessFailedReason(undefined);
  };

  return (
    <UiStateContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        waiting,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
        setWaiting,
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
    </UiStateContext.Provider>
  );
}
