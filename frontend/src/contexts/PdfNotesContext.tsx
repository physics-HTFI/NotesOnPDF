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
}

/**
 * 注釈のコンテクスト
 */
export const PdfNotesContext = createContext<PdfNotesContextType>({
  setIdOrFile: () => undefined,
  setPdfNotes: () => undefined,
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
  const [idOrFile, setIdOrFile] = useState<string | File>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const id = idOrFile instanceof File ? undefined : idOrFile;
  const file = idOrFile instanceof File ? idOrFile : undefined;

  useEffect(() => {
    if (!pdfNotes || !id) return;
    model.putPdfNotes(id, pdfNotes).catch(() => undefined);
  }, [model, id, pdfNotes]);

  return (
    <PdfNotesContext.Provider
      value={{ id, file, setIdOrFile, pdfNotes, setPdfNotes }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
};
