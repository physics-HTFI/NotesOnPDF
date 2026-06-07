import { type ReactNode, useEffect, useState } from "react";
import { debounce } from "@mui/material";
import useNewCoverages from "./useNewCoverages";
import PdfNotesContext from "./PdfNotesContext";
import useUpdaters from "./useUpdaters";
import { modelフォルダ } from "@/models/modelフォルダ";
import { modelファイル } from "@/models/modelファイル";

/**
 * 間隔をあけて`pdfNotes`を保存する
 */
const putPdfNotesDebounced = debounce(
  (save: () => Promise<void>) => save(),
  1000,
);

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const setCoverages = modelファイル.coverages.useSet();
  const [id, setId] = useState<string>();
  const { getNewCoveragesOrUndefined } = useNewCoverages();
  const updaters = useUpdaters();
  const pdfNotes = updaters.pdfNotes;
  const save = modelフォルダ.json.useSave();

  // `pdfNotes`が変更されたときの処理
  useEffect(() => {
    if (!pdfNotes || !id) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(updaters.imageNum))
      ?.scrollIntoView({ block: "nearest" });
    // 注釈ファイル保存
    void putPdfNotesDebounced(() => save(pdfNotes, id));
    // 必要であれば`coverages`を更新する
    const newCoverages = getNewCoveragesOrUndefined(id, pdfNotes);
    if (newCoverages) {
      void setCoverages(newCoverages);
    }
  }, [
    getNewCoveragesOrUndefined,
    id,
    pdfNotes,
    save,
    setCoverages,
    updaters.imageNum,
  ]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        pdfNotes,
        page: updaters.page,
        pageLabel: updaters.pageLabel,
        previousPageNum: updaters.previousPageNum,
        imageNum: updaters.imageNum,
        setId,
        updaters,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
