import { model起動直後 } from "@/components/state起動直後/model起動直後";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { History, HistoryItem } from "@/types/History";
import { fileUtils } from "@/global/utils/fileUtils";
import { atom, useSetAtom } from "jotai";
import { useState } from "react";
import { modelPDFファイル } from "../modelPDFファイル";
import { createHistoryItem } from "./createHistoryItem";

export const atomHistory = atom<History>([]);

/**
 *  履歴の更新を行う
 */
export const atomUpdateHistory = atom(
  null,
  async (get, set, arg: TypeUpdateHistory) => {
    let history = [...get(atomHistory)];
    if (arg.type === "追加")
      history = [arg.item, ...history.filter((e) => e.path !== arg.item.path)];
    if (arg.type === "削除")
      history = history.filter((e) => e.path != arg.path);
    if (arg.type === "全削除") history = [];
    set(atomHistory, history);

    // 保存
    const folder = get(model起動直後.folder.atomValue);
    const ok = await fileUtils.writeJsonToPathAsync(
      history,
      PATH_HISTORY,
      folder,
    );
    if (!ok)
      set(model起動直後.readOnly.atomSetWithMessage, `${PATH_HISTORY} の出力`);
  },
);

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
  const folder = model起動直後.folder.useValue();
  const pdfInfo = modelPDFファイル.info.useValue();
  const setHistory = useSetAtom(atomHistory);
  const updateHistory = useSetAtom(atomUpdateHistory);

  // 📁 が変更されたときに、履歴の初期値をファイルから読み込む
  if (currentFolder !== folder) {
    setCurrentFolder(folder);
    fileUtils
      .readJsonFromPathAsync<History>(PATH_HISTORY, folder)
      .then((history) => {
        setHistory(history ?? []);
      });
  }

  // PDF ファイルが選択されたときに、履歴を更新する
  if (currentPdfInfo !== pdfInfo) {
    setCurrentPdf(pdfInfo);
    if (!pdfInfo) return;
    const item = createHistoryItem(pdfInfo);
    if (item) updateHistory({ type: "追加", item });
  }

  return <></>;
}
