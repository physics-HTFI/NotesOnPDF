import { modelフォルダ } from "@/models/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { PdfHistory } from "@/types/History";
import { atom, useSetAtom } from "jotai";
import { createPdfHistoryItem } from "./utils/createPdfHistoryItem";
import { watchMaps } from "./Watch/watchMaps";

const atomHistory = atom<PdfHistory>([]);

//|
//| 派生 atom
//|

const atomHistoryValue = atom((get) => get(atomHistory));

/**
 *  履歴の更新を行う
 */
function useUpdateHistory() {
  const save = modelフォルダ.json.useSave();
  const setHistory = useSetAtom(atomHistory);

  const update = async (arg: TypeUpdateHistory) => {
    const getNewHistory = (h: PdfHistory) => {
      switch (arg.type) {
        case "追加":
          return [
            createPdfHistoryItem(arg.path, arg.pages),
            ...h.filter((e) => e.path !== arg.path),
          ];
        case "削除":
          return h.filter((e) => e.path != arg.path);
        case "全削除":
          return [];
      }
    };
    setHistory((h) => {
      const history = getNewHistory(h);
      void save(history, PATH_HISTORY);
      return history;
    });
  };

  return {
    add: (path: string, pages: number) => update({ type: "追加", path, pages }),
    deleteByPath: (path: string) => update({ type: "削除", path }),
    deleteAll: () => update({ type: "全削除" }),
  };
}

type TypeUpdateHistory =
  | { type: "追加"; path: string; pages: number }
  | { type: "削除"; path: string }
  | { type: "全削除" };

//|
//| export
//|

export const modelPDF履歴 = {
  atomValue: atomHistoryValue,
  update: { use: useUpdateHistory },
};

//|
//| watch
//|

const id = "modelPDF履歴";

// ルート📁が変更されたときに、履歴を読み直す
watchMaps.folder.set(id, () => {
  const read = modelフォルダ.json.useRead();
  const setHistory = useSetAtom(atomHistory);
  return async () => {
    const history = await read<PdfHistory>(PATH_HISTORY, false);
    setHistory(history ?? []);
  };
});
