import { modelフォルダ } from "@/models/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { PdfHistory, PdfHistoryItem } from "@/types/History";
import { atom, useSetAtom } from "jotai";
import { createPdfHistoryItem } from "./utils/createPdfHistoryItem";
import type { PdfInfo } from "@/types/PdfInfo";
import { watchMaps } from "./Watch/watchMaps";

const atomHistory = atom<PdfHistory>([]);

/**
 *  履歴の更新を行う
 */
function useUpdateHistory() {
  const save = modelフォルダ.json.useSave();
  const setHistory = useSetAtom(atomHistory);

  return async (arg: TypeUpdateHistory) => {
    let get: (h: PdfHistory) => PdfHistory;
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
  };
}

type TypeUpdateHistory =
  | { type: "追加"; item: PdfHistoryItem }
  | { type: "削除"; path: string }
  | { type: "全削除" };

//|
//| export
//|

export const modelPDF履歴 = {
  atom: atomHistory,
  useUpdate: useUpdateHistory,
};

//|
//| watch
//|

const id = "modelPDF履歴";

// ルート📁が変更されたときに、履歴を読み直す
watchMaps.folder.set(id, () => {
  const read = modelフォルダ.json.useRead();
  const setHistory = useSetAtom(modelPDF履歴.atom);
  return async () => {
    const history = await read<PdfHistory>(PATH_HISTORY, false);
    setHistory(history ?? []);
  };
});

// PDF ファイルが選択されたときに、履歴を更新する
watchMaps.pdfInfo.set(id, () => {
  const update = modelPDF履歴.useUpdate();
  return (info?: PdfInfo) => {
    const item = createPdfHistoryItem(info);
    if (!item) return;
    void update({ type: "追加", item });
  };
});
