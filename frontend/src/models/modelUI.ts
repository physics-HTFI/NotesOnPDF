import { atom, useSetAtom } from "jotai";
import { type ReactNode } from "react";

const atomAlert = atom<{ severity: "error" | "info"; message: ReactNode }>();
const atomWaiting = atom<boolean>(false);
const atomOpenPdfFileTreeDrawer = atom<boolean>(true);
const atomOpenSettingsDrawer = atom<boolean>(false);

//|
//| 派生 atom
//|

const atomAlertValue = atom((get) => get(atomAlert));
const atomAlertClear = atom(null, (_, set) => set(atomAlert, undefined));

//|
//| export
//|

export const modelUI = {
  /** メッセージトーストを表示する */
  alert: {
    atomValue: atomAlertValue,
    atomClear: atomAlertClear,

    /** アラートを簡潔に設定できるようにしたもの。例：`set("error", "失敗しました")` */
    useSet: () => {
      const set = useSetAtom(atomAlert);
      return (severity: "error" | "info", message: ReactNode) =>
        set({ severity, message });
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
