import { FC, ReactNode, createContext, useState } from "react";
import Waiting from "@/components/Fullscreen/Waiting";

interface UiStateContextType {
  openFileTreeDrawer: boolean;
  openSettingsDrawer: boolean;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
  setWaiting: (waiting: boolean) => void;
}

/**
 * UIの状態コンテクスト（待機中、ドロワーの開閉状態）
 */
export const UiStateContext = createContext<UiStateContextType>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
  setWaiting: () => undefined,
});

/**
 * `UiStateContextProvider`の引数
 */
interface Props {
  children: ReactNode;
}

/**
 * `UiStateContext`のプロバイダー
 */
export const UiStateContextProvider: FC<Props> = ({ children }) => {
  const [openFileTreeDrawer, setOpenFileTreeDrawer] = useState(true);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [waiting, setWaiting] = useState(false);

  return (
    <UiStateContext.Provider
      value={{
        setWaiting,
        openFileTreeDrawer,
        setOpenFileTreeDrawer,
        openSettingsDrawer,
        setOpenSettingsDrawer,
      }}
    >
      {children}
      <Waiting isWaiting={waiting} />
    </UiStateContext.Provider>
  );
};
