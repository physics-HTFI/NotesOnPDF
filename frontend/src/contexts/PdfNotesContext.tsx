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
  setId: (id?: string) => void;
  file?: File;
  setFile: (file?: File) => void;
  pdfNotes?: PdfNotes;
  setPdfNotes: (pdfNotes?: PdfNotes) => void;
}

/**
 * 注釈のコンテクスト
 */
export const PdfNotesContext = createContext<PdfNotesContextType>({
  setId: () => undefined,
  setFile: () => undefined,
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
  const [id, setId] = useState<string>();
  const [file, setFile] = useState<File>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();

  useEffect(() => {
    if (!pdfNotes || !id) return;
    model.putPdfNotes(id, pdfNotes).catch(() => undefined);
  }, [model, id, pdfNotes]);

  return (
    <PdfNotesContext.Provider
      value={{ id, setId, file, setFile, pdfNotes, setPdfNotes }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
};
