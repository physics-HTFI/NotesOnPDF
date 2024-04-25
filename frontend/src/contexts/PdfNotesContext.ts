import { PdfNotes } from "@/types/PdfNotes";
import { createContext } from "react";

interface PdfNotesContextType {
  id?: string;
  pdfNotes?: PdfNotes;
  setPdfNotes: (pdfNotes: PdfNotes) => void;
}

export const PdfNotesContext = createContext<PdfNotesContextType>({
  setPdfNotes: () => undefined,
});
