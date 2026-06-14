import { useAtomValue, useSetAtom } from "jotai";
import { derivsPdfNotes } from "./derivsPdfNotes";
import { atomsPdfNotes } from "./atomsPdfNotes";

export const modelPdfNotes = {
  pdfNotes: {
    useTitle: () => useAtomValue(atomsPdfNotes.pdfNotes.title),
    useVersion: () => useAtomValue(atomsPdfNotes.pdfNotes.version),
    usePages: () => useAtomValue(atomsPdfNotes.pdfNotes.pages),
    useSettings: () => useAtomValue(atomsPdfNotes.pdfNotes.settings),
    useCurrentPage: () => useAtomValue(atomsPdfNotes.pdfNotes.currentPage),
  },

  fontScale: { useValue: () => useAtomValue(derivsPdfNotes.values.fontScale) },
  page: {
    useValue: () => useAtomValue(derivsPdfNotes.values.page),
  },
  pageLabel: {
    useValue: () => useAtomValue(derivsPdfNotes.values.pageLabel),
  },
  preferredLabels: {
    useValue: () => useAtomValue(derivsPdfNotes.values.preferredLabels),
  },
  previousPageNum: {
    useValue: () => useAtomValue(atomsPdfNotes.undo.pageNum),
  },

  atomsIsSelected: {
    usePageValue: () =>
      useAtomValue(atomsPdfNotes.splitPage.atomsIsSelectedPage),
    useChapterValue: () =>
      useAtomValue(atomsPdfNotes.splitPage.atomsIsSelectedChapter),
  },

  update: {
    usePushNote: () => useSetAtom(derivsPdfNotes.update.pushNote),
    usePopNote: () => useSetAtom(derivsPdfNotes.update.popNote),
    useSetNote: () => useSetAtom(derivsPdfNotes.update.setNote),
    useSetPageSettings: () => useSetAtom(derivsPdfNotes.update.setPageSettings),
    useSetFileSettings: () => useSetAtom(derivsPdfNotes.update.setFileSettings),
    useJumpPage: () => useSetAtom(derivsPdfNotes.update.jumpPage),
    useScrollPage: () => useSetAtom(derivsPdfNotes.update.scrollPage),
    useKeyDown: () => useSetAtom(derivsPdfNotes.update.keyDown),
  },
};
