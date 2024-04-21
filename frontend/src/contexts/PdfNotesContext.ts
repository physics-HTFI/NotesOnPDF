import { Coverages } from "@/types/Coverages";
import { PdfNotes } from "@/types/PdfNotes";
import { createContext } from "react";

interface PdfNotesContextType {
  pdfPath?: string;
  pdfNotes?: PdfNotes;
  setPdfNotes: (pdfNotes: PdfNotes) => void;
  coverages?: Coverages;
  setCoverages: (coverages: Coverages) => void;
}

export const PdfNotesContext = createContext<PdfNotesContextType>({
  setPdfNotes: () => undefined,
  setCoverages: () => undefined,
});
