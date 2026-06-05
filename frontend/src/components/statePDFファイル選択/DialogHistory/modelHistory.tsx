import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { History, HistoryItem } from "@/types/History";
import { atom, useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { modelPDFファイル } from "../modelPDFファイル";
import { createHistoryItem } from "./createHistoryItem";

export const atomHistory = atom<History>([]);

/**
 *  履歴の更新を行う
 */
export function useUpdateHistory() {
  const { saveAsync } = modelフォルダ.json.useSave();
  const [history, setHistory] = useAtom(atomHistory);

  return {
    updateAsync: async (arg: TypeUpdateHistory) => {
      if (arg.type === "追加")
        setHistory([
          arg.item,
          ...history.filter((e) => e.path !== arg.item.path),
        ]);
      if (arg.type === "削除")
        setHistory(history.filter((e) => e.path != arg.path));
      if (arg.type === "全削除") setHistory([]);

      // 保存
      saveAsync(history, PATH_HISTORY);
    },
  };
}

type TypeUpdateHistory =
  | { type: "追加"; item: HistoryItem }
  | { type: "削除"; path: string }
  | { type: "全削除" };

//|
//| このフォルダ外から利用されるもの
//|

export const modelHistory = {
  /** 選択 📁 と選択 PDF が変更されたときの処理を行うコンポーネント */
  Watcher: HistoryWatcher,
};

/**
 *  選択 📁 と選択 PDF が変更されたときの処理を行うコンポーネント
 */
function HistoryWatcher() {
  const [currentFolder, setCurrentFolder] = useState<typeof folder>();
  const [currentPdfInfo, setCurrentPdf] = useState<typeof pdfInfo>();
  const folder = modelフォルダ.folder.useValue();
  const pdfInfo = modelPDFファイル.info.useValue();
  const { readAsync } = modelフォルダ.json.useRead();
  const setHistory = useSetAtom(atomHistory);
  const { updateAsync } = useUpdateHistory();

  // 📁 が変更されたときに、履歴の初期値をファイルから読み込む
  if (currentFolder !== folder) {
    setCurrentFolder(folder);
    readAsync<History>(PATH_HISTORY, false).then((history) => {
      setHistory(history ?? []);
    });
  }

  // PDF ファイルが選択されたときに、履歴を更新する
  if (currentPdfInfo !== pdfInfo) {
    setCurrentPdf(pdfInfo);
    if (!pdfInfo) return;
    const item = createHistoryItem(pdfInfo);
    if (item) void updateAsync({ type: "追加", item });
  }

  return <></>;
}
