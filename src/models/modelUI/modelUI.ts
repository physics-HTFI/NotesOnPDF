import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { type ReactNode } from "react";
import { atomsUI } from "./atomsUI";
import { derivsUI } from "./derivsUI";

export const modelUI = {
  /** メッセージトーストの表示 */
  alert: {
    useValue: () => useAtomValue(atomsUI.alert),
    useClear: () => useSetAtom(derivsUI.clearAlert),
    useSet: () => {
      const set = useSetAtom(atomsUI.alert);
      return (severity: "error" | "info", message: ReactNode) =>
        set({ severity, message });
    },
  },

  /** 処理待ちインジケーターの表示 */
  waiting: {
    useValue: () => useAtomValue(atomsUI.waiting),
  },

  /** マウス位置の保持 */
  mouse: {
    use: () => useAtom(atomsUI.mouse),
    useValue: () => useAtomValue(atomsUI.mouse),
    useSet: () => useSetAtom(atomsUI.mouse),
  },

  /** 設定ドロワーの表示 */
  openDrawer_settings: { use: () => useAtom(atomsUI.openDrawer_settings) },

  /** PDF ファイル選択ドロワーの表示 */
  openDrawer_pdfSelector: {
    use: () => useAtom(atomsUI.openDrawer_pdfSelector),

    useValue: () => useAtomValue(atomsUI.openDrawer_pdfSelector),
    useOpen: () => useSetAtom(derivsUI.open_pdfSelector),
    useClose: () => useSetAtom(derivsUI.close_pdfSelector),
  },
};
