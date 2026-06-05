import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { History, HistoryItem } from "@/types/History";
import { atom, useSetAtom } from "jotai";
import { HistoryWatcher } from "./modelHistory.ui";
import { useCallback } from "react";

const atomHistory = atom<History>([]);

/**
 *  履歴の更新を行う
 */
function useUpdateHistory() {
  const save = modelフォルダ.json.useSave();
  const setHistory = useSetAtom(atomHistory);

  const update = useCallback(
    async (arg: TypeUpdateHistory) => {
      let get: (h: History) => History;
      switch (arg.type) {
        case "追加":
          get = (h) => [arg.item, ...h.filter((e) => e.path !== arg.item.path)];
          break;
        case "削除":
          get = (h) => h.filter((e) => e.path != arg.path);
          break;
        case "全削除":
          get = () => [];
          break;
      }
      setHistory((h) => {
        const history = get(h);
        void save(history, PATH_HISTORY);
        return history;
      });
    },
    [save, setHistory],
  );

  return update;
}

type TypeUpdateHistory =
  | { type: "追加"; item: HistoryItem }
  | { type: "削除"; path: string }
  | { type: "全削除" };

//|
//| このフォルダ外から利用されるもの
//|

export const modelHistory = {
  atomHistory,
  useUpdateHistory,
  Watcher: HistoryWatcher,
};
