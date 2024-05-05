import { PdfNotes } from "@/types/PdfNotes";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModelContext } from "./ModelContext";

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
  const id = idOrFile instanceof File ? undefined : idOrFile;
  const file = idOrFile instanceof File ? idOrFile : undefined;
  const setIdOrFile = (idOrFile?: string | File) => {
    setIdOrFile_(idOrFile);
    setPreviousPageNum(undefined);
  };

  useEffect(() => {
    if (!pdfNotes || !id) return;
    model.putPdfNotes(id, pdfNotes).catch(() => undefined);
  }, [model, id, pdfNotes]);

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
