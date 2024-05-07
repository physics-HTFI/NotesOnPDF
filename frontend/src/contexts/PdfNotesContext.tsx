import { PdfNotes } from "@/types/PdfNotes";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ModelContext } from "./ModelContext";
import { debounce } from "@mui/material";
import IModel from "@/models/IModel";

interface PdfNotesContextType {
  id?: string;
  file?: File;
  setIdOrFile: (idOrFile?: string | File) => void;
  pdfNotes?: PdfNotes;
  setPdfNotes: (pdfNotes?: PdfNotes) => void;
  previousPageNum?: number;
  setPreviousPageNum: (previousPageNum?: number) => void;
}

/**
 * 注釈のコンテクスト
 */
export const PdfNotesContext = createContext<PdfNotesContextType>({
  setIdOrFile: () => undefined,
  setPdfNotes: () => undefined,
  setPreviousPageNum: () => undefined,
});

/**
 * `AppSettingsContextProvider`の引数
 */
interface Props {
  children: ReactNode;
}

/**
 * `AppSettingsContext`のプロバイダー
 */
export const PdfNotesContextProvider: FC<Props> = ({ children }) => {
  const { model } = useContext(ModelContext);
  const [idOrFile, setIdOrFile_] = useState<string | File>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [previousPageNum, setPreviousPageNum] = useState<number>();
  const putPdfNotesDebounced = useMemo(
    () =>
      debounce((id?: string, pdfNotes?: PdfNotes, model?: IModel) => {
        if (!pdfNotes || !id) return;
        model?.putPdfNotes(id, pdfNotes).catch(() => undefined);
      }, 1000),
    []
  );

  const id = idOrFile instanceof File ? undefined : idOrFile;
  const file = idOrFile instanceof File ? idOrFile : undefined;
  const setIdOrFile = (idOrFile?: string | File) => {
    setIdOrFile_(idOrFile);
    setPreviousPageNum(undefined);
  };
  useEffect(() => {
    putPdfNotesDebounced(id, pdfNotes, model);
  }, [id, pdfNotes, model, putPdfNotesDebounced]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        file,
        setIdOrFile,
        pdfNotes,
        setPdfNotes,
        previousPageNum,
        setPreviousPageNum,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
};
