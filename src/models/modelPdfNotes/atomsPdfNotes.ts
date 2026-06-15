import type PdfNotes from "@/types/PdfNotes";
import type { NoteType, Page, Settings } from "@/types/PdfNotes";
import { atom } from "jotai";
import { splitAtom } from "jotai/utils";

const atomPages = atom<Page[]>([]);
const atomIsSelectedListPage = atom<boolean[]>([]);
const atomIsSelectedListChapter = atom<boolean[]>([]);

export const atomsPdfNotes = {
  pdfNotes: {
    title: atom<string>(),
    version: atom<number>(),
    pages: atomPages,
    settings: atom<Settings>(),
    currentPage: atom<number>(),
  },

  undo: {
    pageNum: atom<number>(),
    pdfNotes: atom<PdfNotes>(),
    notes: atom<NoteType[]>(),
  },

  selectedList: {
    /** 目次で、ハイライトすべきページが `true` になる */
    page: atomIsSelectedListPage,
    /** 目次で、ハイライトすべき章を持つページが `true` になる */
    chapter: atomIsSelectedListChapter,
  },

  splitPage: {
    atomsIsSelectedPage: splitAtom(atomIsSelectedListPage),
    atomsIsSelectedChapter: splitAtom(atomIsSelectedListChapter),
    atomsPage: splitAtom(atomPages),
  },
};
