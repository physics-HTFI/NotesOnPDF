import type PdfNotes from "@/types/PdfNotes";
import type { Page } from "@/types/PdfNotes";
import { createContext } from "react";
import { type Updaters } from "./useUpdaters";

/**
 * 注釈のコンテクスト
 */
const PdfNotesContext = createContext<{
  pdfNotes?: PdfNotes;
  page?: Page;
  pageLabel: string;
  imageNum?: number;
  previousPageNum?: number;
  updaters: Updaters;
}>({
  pageLabel: "",
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
