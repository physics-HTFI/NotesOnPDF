import PdfNotes from "@/types/PdfNotes";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
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
    ) => void,
    setReadOnly: (readOnly: boolean) => void
  ) => {
    model.putPdfNotes(id, pdfNotes).catch(() => {
      setAlert(
        "error",
        <span>
          注釈ファイルの保存に失敗しました。
          <br />
          読み取り専用モードに切り替えました。
        </span>
      );
      setReadOnly(true);
    });
  },
  1000
);

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model, setCoverages } = useContext(ModelContext);
  const { readOnly, setAlert, setReadOnly } = useContext(UiContext);
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

  const setId = useCallback((id?: string) => {
    setId_(id);
    setPreviousPageNum(undefined);
  }, []);

  // `pdfNotes`が変更されたときの処理
  useEffect(() => {
    if (!pdfNotes || !id) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(pdfNotes.currentPage))
      ?.scrollIntoView({ block: "nearest" });
    if (!readOnly) {
      // 注釈ファイル保存
      putPdfNotesDebounced(id, pdfNotes, model, setAlert, setReadOnly);
      // 必要であれば`coverages`を更新する
      const newCoverages = getNewCoveragesOrUndefined(id, pdfNotes);
      if (newCoverages) {
        setCoverages(newCoverages);
        model.putCoverages(newCoverages).catch(() => {
          setAlert(
            "error",
            <span>
              進捗率ファイルの保存に失敗しました。
              <br />
              読み取り専用モードに切り替えました。
            </span>
          );
          setReadOnly(true);
        });
      }
    }
  }, [
    getNewCoveragesOrUndefined,
    id,
    model,
    pdfNotes,
    readOnly,
    setAlert,
    setCoverages,
    setReadOnly,
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
