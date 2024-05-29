import PdfNotes from "@/types/PdfNotes";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { debounce } from "@mui/material";
import IModel from "@/models/IModel";
import ModelContext from "./ModelContext";
import UiStateContext from "./UiStateContext";

export interface PageSize {
  width: number;
  height: number;
}

/**
 * 注釈のコンテクスト
 */
const PdfNotesContext = createContext<{
  id?: string;
  pdfNotes?: PdfNotes;
  pageSizes?: PageSize[];
  previousPageNum?: number;
  setId: (id?: string) => void;
  setPdfNotes: (pdfNotes?: PdfNotes) => void;
  setPageSizes: (pageSizes?: PageSize[]) => void;
  setPreviousPageNum: (previousPageNum?: number) => void;
}>({
  setId: () => undefined,
  setPdfNotes: () => undefined,
  setPageSizes: () => undefined,
  setPreviousPageNum: () => undefined,
});

export default PdfNotesContext;

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model } = useContext(ModelContext);
  const { readOnly, setErrorMessage } = useContext(UiStateContext);
  const [id, setId_] = useState<string>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [pageSizes, setPageSizes] = useState<PageSize[]>();
  const [previousPageNum, setPreviousPageNum] = useState<number>();

  const setId = (id?: string) => {
    setId_(id);
    setPreviousPageNum(undefined);
  };

  // 変更されたら保存
  const putPdfNotesDebounced = useMemo(
    () =>
      debounce(
        (
          id: string,
          pdfNotes: PdfNotes,
          model?: IModel,
          setErrorMessage?: (snackbarMessage: JSX.Element | undefined) => void
        ) => {
          model?.putPdfNotes(id, pdfNotes).catch(() => {
            setErrorMessage?.(model.getMessage("注釈ファイルの保存"));
          });
        },
        1000
      ),
    []
  );
  useEffect(() => {
    if (!pdfNotes || !id) return;
    document
      .getElementById(String(pdfNotes.currentPage))
      ?.scrollIntoView({ block: "nearest" });
    if (readOnly) return;
    putPdfNotesDebounced(id, pdfNotes, model, setErrorMessage);
    // 目次パネル中の選択されたページが隠れないようにスクロールする
  }, [id, pdfNotes, model, readOnly, putPdfNotesDebounced, setErrorMessage]);

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
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
