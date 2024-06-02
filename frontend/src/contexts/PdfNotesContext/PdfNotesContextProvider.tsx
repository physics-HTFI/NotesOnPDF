import PdfNotes from "@/types/PdfNotes";
import { ReactNode, useContext, useEffect, useState } from "react";
import { debounce } from "@mui/material";
import IModel from "@/models/IModel";
import ModelContext from "../ModelContext/ModelContext";
import UiContext from "../UiContext";
import useNewCoverages from "./useNewCoverages";
import PdfNotesContext, { PageSize } from "./PdfNotesContext";
import useUpdaters from "./useUpdaters";

/**
 * 間隔をあけて`pdfNotes`を保存する
 */
const putPdfNotesDebounced = debounce(
  (
    id: string,
    pdfNotes: PdfNotes,
    model: IModel,
    setAlert: (
      severity?: "error" | "info" | undefined,
      message?: ReactNode
    ) => void
  ) => {
    model.putPdfNotes(id, pdfNotes).catch(() => {
      setAlert("error", "注釈ファイルの保存に失敗しました");
    });
  },
  1000
);

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model, setCoverages } = useContext(ModelContext);
  const { readOnly, setAlert } = useContext(UiContext);
  const [id, setId_] = useState<string>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [pageSizes, setPageSizes] = useState<PageSize[]>();
  const [previousPageNum, setPreviousPageNum] = useState<number>();
  const { getNewCoveragesOrUndefined } = useNewCoverages();
  const updaters = useUpdaters({
    pdfNotes,
    setPdfNotes,
    previousPageNum,
    setPreviousPageNum,
  });

  const setId = (id?: string) => {
    setId_(id);
    setPreviousPageNum(undefined);
  };

  // `pdfNotes`が変更されたときの処理
  useEffect(() => {
    if (!pdfNotes || !id) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(pdfNotes.currentPage))
      ?.scrollIntoView({ block: "nearest" });
    if (!readOnly) {
      // 注釈ファイル保存
      putPdfNotesDebounced(id, pdfNotes, model, setAlert);
    }
    // 必要であれば`coverages`を更新する
    const newCoverages = getNewCoveragesOrUndefined(id, pdfNotes);
    if (newCoverages) {
      // `Coverages`が不整合になることがある：
      // ・`readOnly`状態で`pdfNotes`を変更→別のファイルを開いて`readOnly`を解除、としたときに前のファイルの`Coverage`が変化してしまう。
      // だが稀なので気にしない（`!readOnly`状態で`Coverages`が変化しないほうが不自然なので）。
      setCoverages(newCoverages);
    }
  }, [
    getNewCoveragesOrUndefined,
    id,
    model,
    pdfNotes,
    readOnly,
    setAlert,
    setCoverages,
  ]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        pdfNotes,
        pageSizes,
        previousPageNum,
        setId,
        setPdfNotes,
        setPageSizes,
        setPreviousPageNum,
        updaters,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
