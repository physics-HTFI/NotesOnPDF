import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import type { PdfHistory } from "@/types/History";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { modelPDFファイル } from "../modelPDFファイル";
import { createPdfHistoryItem } from "./createPdfHistoryItem";
import { modelPdfHistory } from "./modelPdfHistory";

// modelHistory.ts 内に React コンポーネントを置くと
// fast refresh 出来ないという警告が出るので、分離している。

/**
 *  選択 📁 と選択 PDF が変更されたときの処理を行うコンポーネント。
 *  コンポーネントが削除されないように main.tsx 内に置く。
 */
export function HistoryWatcher() {
  const [currentFolder, setCurrentFolder] = useState<typeof folder>();
  const [currentPdfInfo, setCurrentPdf] = useState<typeof pdfInfo>();
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const pdfInfo = useAtomValue(modelPDFファイル.info.atom);
  const read = modelフォルダ.json.useRead();
  const setHistory = useSetAtom(modelPdfHistory.atom);
  const update = modelPdfHistory.useUpdate();

  // setTimeout せずに直接 set すると以下のエラーが出る：
  // Cannot update a component (A) while rendering a different component (B)
  // atom が変化したときのリレンダー中に setState/setAtom をしないほうが良い。
  // useEffect を使うという手もあるが、カスタムフック由来の関数があると
  // useCallback する必要があるのと更新タイミングが読みづらくなる。

  // 📁 が変更されたときに、履歴の初期値をファイルから読み込む
  if (currentFolder !== folder) {
    setTimeout(async () => {
      setCurrentFolder(folder);
      const history = await read<PdfHistory>(PATH_HISTORY, false);
      setHistory(history ?? []);
    }, 0);
  }

  // PDF ファイルが選択されたときに、履歴を更新する
  if (currentPdfInfo !== pdfInfo) {
    setTimeout(async () => {
      setCurrentPdf(pdfInfo);
      const item = createPdfHistoryItem(pdfInfo);
      if (!item) return;
      void update({ type: "追加", item });
    }, 0);
  }

  return <></>;
}
