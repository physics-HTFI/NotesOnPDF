import PdfNotes, { Page } from "@/types/PdfNotes";
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
  page?: Page;
  pageSizes?: PageSize[];
  pageLabel: string;
  imageNum?: number;
  previousPageNum?: number;
  setId: (id?: string) => void;
  setPageSizes: (pageSizes?: PageSize[]) => void;
  updaters: Updaters;
}>({
  pageLabel: "",
  setId: () => undefined,
  setPageSizes: () => undefined,
  updaters: {
    assignPdfNotes: () => undefined,
    scrollPage: () => undefined,
    jumpPageStart: () => undefined,
    jumpPageEnd: () => undefined,
    popNote: () => undefined,
    pushNote: () => undefined,
    updateNote: () => undefined,
    updateFileSettings: () => undefined,
    updatePageSettings: () => undefined,
    getChpapterStartPageNum: () => 0,
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
