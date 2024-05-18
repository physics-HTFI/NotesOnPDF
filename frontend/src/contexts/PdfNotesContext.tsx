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

/**
 * 注釈のコンテクスト
 */
const PdfNotesContext = createContext<{
  id?: string;
  setId: (id?: string) => void;
  pdfNotes?: PdfNotes;
  setPdfNotes: (pdfNotes?: PdfNotes) => void;
  previousPageNum?: number;
  setPreviousPageNum: (previousPageNum?: number) => void;
}>({
  setId: () => undefined,
  setPdfNotes: () => undefined,
  setPreviousPageNum: () => undefined,
});

export default PdfNotesContext;

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model } = useContext(ModelContext);
  const { readOnly, setSnackbarMessage } = useContext(UiStateContext);
  const [id, setId_] = useState<string>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
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
          id?: string,
          pdfNotes?: PdfNotes,
          model?: IModel,
          setSnackbarMessage?: (
            snackbarMessage: JSX.Element | undefined
          ) => void
        ) => {
          if (!pdfNotes || !id) return;
          model?.putPdfNotes(id, pdfNotes).catch(() => {
            setSnackbarMessage?.(model.getMessage("注釈ファイルの保存"));
          });
        },
        1000
      ),
    []
  );
  useEffect(() => {
    if (readOnly) return;
    putPdfNotesDebounced(id, pdfNotes, model, setSnackbarMessage);
  }, [id, pdfNotes, model, readOnly, putPdfNotesDebounced, setSnackbarMessage]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        setId,
        pdfNotes,
        setPdfNotes,
        previousPageNum,
        setPreviousPageNum,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
