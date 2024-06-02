import PdfNotes from "@/types/PdfNotes";
import { createContext } from "react";
import { Updaters } from "./useUpdaters";

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
  updaters: Updaters;
}>({
  setId: () => undefined,
  setPdfNotes: () => undefined,
  setPageSizes: () => undefined,
  setPreviousPageNum: () => undefined,
  updaters: {
    pageLabel: "",
    scrollPage: () => undefined,
    jumpPage: () => undefined,
    popNote: () => undefined,
    pushNote: () => undefined,
    updateNote: () => undefined,
    handleKeyDown: () => undefined,
    getPreferredLabels: () => ({
      volumeLabel: "",
      partLabel: "",
      chapterLabel: "",
      pageNum: -1,
    }),
  },
});

export default PdfNotesContext;
