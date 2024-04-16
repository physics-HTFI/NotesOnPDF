import { PdfNotes } from "@/types/PdfNotes";
import { createContext } from "react";

interface PdfNotesContextType {
  pdfNotes?: PdfNotes;
  setPdfNotes?: (pdfNotes: PdfNotes) => void;
  pdfPath?: string;
}

export const PdfNotesContext = createContext<PdfNotesContextType>({});
