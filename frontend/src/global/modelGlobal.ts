import { atom, useAtomValue, useSetAtom } from "jotai";
import type { ReactNode } from "react";

const atomAlert = atom<{ type: "error" | "info"; message: ReactNode }>();
const atomWaiting = atom<boolean>(false);

//|
//| このフォルダ外から利用されるもの
//|

export const modelGlobal = {
  /** メッセージトーストを表示する */
  alert: {
    atom: atomAlert,
    useValue: () => useAtomValue(atomAlert),

    /** 例：`set("error", "失敗しました")` */
    useSet: () => {
      const set = useSetAtom(atomAlert);
      return (type: "error" | "info", message: ReactNode) =>
        set({ type, message });
    },
  },

  /** 処理待ちインジケーターを表示する */
  waiting: {
    atom: atomWaiting,
  },
};
