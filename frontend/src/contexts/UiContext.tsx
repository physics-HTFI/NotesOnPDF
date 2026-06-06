import { type ReactNode, createContext, useState } from "react";

/**
 * UIの状態コンテクスト（待機中、ドロワーの開閉状態）
 */
export const UiContext = createContext<{
  openFileTreeDrawer: boolean;
  openSettingsDrawer: boolean;
  setOpenFileTreeDrawer: (openFileTreeDrawer: boolean) => void;
  setOpenSettingsDrawer: (openSettingsDrawer: boolean) => void;
}>({
  openFileTreeDrawer: true,
  openSettingsDrawer: false,
  setOpenFileTreeDrawer: () => undefined,
  setOpenSettingsDrawer: () => undefined,
});

export default UiContext;

/**
 * `UiContext`のプロバイダー
 */
export function UiContextProvider({ children }: { children: ReactNode }) {
  const [openFileTreeDrawer, setOpenFileTreeDrawer] = useState(true);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);

  return (
    <UiContext.Provider
      value={{
        openFileTreeDrawer,
        openSettingsDrawer,
        setOpenFileTreeDrawer,
        setOpenSettingsDrawer,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}
