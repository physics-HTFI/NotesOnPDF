import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, type ReactNode } from "react";

const atomAlert = atom<{ severity: "error" | "info"; message: ReactNode }>();
const atomWaiting = atom<boolean>(false);

const atomAlertClear = atom(null, (_, set) => set(atomAlert, undefined));

//|
//| このフォルダ外から利用されるもの
//|

export const modelGlobal = {
  /** メッセージトーストを表示する */
  alert: {
    atom: atomAlert,
    useValue: () => useAtomValue(atomAlert),
    useClear: () => useSetAtom(atomAlertClear),

    /** 例：`set("error", "失敗しました")` */
    useSet: () => {
      const set = useSetAtom(atomAlert);
      const setAlert = useCallback(
        (type: "error" | "info", message: ReactNode) =>
          set({ severity: type, message }),
        [set],
      );
      return setAlert;
    },
  },

  /** 処理待ちインジケーターを表示する */
  waiting: {
    atom: atomWaiting,
  },
};
