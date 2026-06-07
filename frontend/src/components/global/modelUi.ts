import { atom, useSetAtom } from "jotai";
import { type ReactNode } from "react";

const atomAlert = atom<{ severity: "error" | "info"; message: ReactNode }>();
const atomWaiting = atom<boolean>(false);
const atomOpenPdfFileTreeDrawer = atom<boolean>(true);
const atomOpenSettingsDrawer = atom<boolean>(false);

const atomAlertValue = atom((get) => get(atomAlert));
const atomAlertClear = atom(null, (_, set) => set(atomAlert, undefined));

//|
//| このフォルダ外から利用されるもの
//|

export const modelUi = {
  /** メッセージトーストを表示する */
  alert: {
    atomValue: atomAlertValue,
    useClear: () => useSetAtom(atomAlertClear),

    /** 例：`set("error", "失敗しました")` */
    useSet: () => {
      const set = useSetAtom(atomAlert);
      return (type: "error" | "info", message: ReactNode) =>
        set({ severity: type, message });
    },
  },

  /** 処理待ちインジケーターを表示する */
  waiting: {
    atom: atomWaiting,
  },

  openDrawer: {
    settings: { atom: atomOpenSettingsDrawer },
    pdfFileTree: { atom: atomOpenPdfFileTreeDrawer },
  },
};
