import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { History } from "@/types/History";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { modelPDFファイル } from "../modelPDFファイル";
import { createHistoryItem } from "./createHistoryItem";
import { modelHistory } from "./modelHistory";

// modelHistory.ts 内に React コンポーネントを置くと
// fast refresh 出来ないという警告が出るので、分離している。

/**
 *  選択 📁 と選択 PDF が変更されたときの処理を行うコンポーネント。
 *  コンポーネントが削除されないように main.tsx 内に置く。
 */
export function HistoryWatcher() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const pdfInfo = useAtomValue(modelPDFファイル.info.atom);
  const read = modelフォルダ.json.useRead();
  const setHistory = useSetAtom(modelHistory.atomHistory);
  const update = modelHistory.useUpdateHistory();

  // useEffect にしないと以下のエラーが出る
  // Cannot update a component (A) while rendering a different component (B)
  // おそらく、atom が変化したときのリレンダー中に setState/setAtom をしないほうが良い。

  // 📁 が変更されたときに、履歴の初期値をファイルから読み込む
  useEffect(() => {
    void (async () => {
      const history = await read<History>(PATH_HISTORY, false);
      setHistory(history ?? []);
    })();
  }, [folder, read, setHistory]);

  // PDF ファイルが選択されたときに、履歴を更新する
  useEffect(() => {
    if (!pdfInfo) return;
    const item = createHistoryItem(pdfInfo);
    if (!item) return;
    void update({ type: "追加", item });
  }, [pdfInfo, update]);

  return <></>;
}
