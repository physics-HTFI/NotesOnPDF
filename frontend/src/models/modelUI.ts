import type { MousePosition } from "@/types/MousePosition";
import { atom, useSetAtom } from "jotai";
import { type ReactNode } from "react";
import { watchMaps } from "./Watch/watchMaps";

const atomAlert = atom<{ severity: "error" | "info"; message: ReactNode }>();
const atomWaiting = atom<boolean>(false);
const atomOpenPdfFileTreeDrawer = atom<boolean>(true);
const atomOpenSettingsDrawer = atom<boolean>(false);
const atomMouse = atom<MousePosition>();

//|
//| 派生 atom
//|

const atomAlertClear = atom(null, (_, set) => set(atomAlert, undefined));

//|
//| export
//|

export const modelUI = {
  /** メッセージトーストを表示する */
  alert: {
    atom: atomAlert,
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

  mouse: { atom: atomMouse },
};

//|
//| watch
//|

const id = "modelUI";

// ルート📁が変更されたときに、ドロワーを閉じる
watchMaps.folder.set(id, () => {
  const setOpenSettingsDrawer = useSetAtom(atomOpenSettingsDrawer);
  const setOpenPdfFileTreeDrawer = useSetAtom(atomOpenPdfFileTreeDrawer);
  return async (folder) => {
    if (folder) return;
    setOpenSettingsDrawer(false);
    setOpenPdfFileTreeDrawer(false);
  };
});

// PDF が変更されたときに、ドロワーを閉じる
watchMaps.pdfPath.set(id, () => {
  const setOpenSettingsDrawer = useSetAtom(atomOpenSettingsDrawer);
  return async () => {
    setOpenSettingsDrawer(false);
  };
});
