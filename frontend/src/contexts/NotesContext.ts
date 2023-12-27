import { Notes } from "@/types/Notes";
import { createContext } from "react";

interface NotesContextType {
  notes?: Notes;
  setNotes?: (notes: Notes) => void;
  pdfPath?: string;
}

export const NotesContext = createContext<NotesContextType>({});
