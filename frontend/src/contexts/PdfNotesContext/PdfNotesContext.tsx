import { createContext } from "react";
import { type Updaters } from "./useUpdaters";

/**
 * 注釈のコンテクスト
 */
const PdfNotesContext = createContext<{
  updaters: Updaters;
}>({
  updaters: {
    assignPdfNotes: () => undefined,
    scrollPage: () => undefined,
    jumpPage: () => undefined,
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
