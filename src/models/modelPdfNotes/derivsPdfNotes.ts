import type PdfNotes from "@/types/PdfNotes";
import { atom } from "jotai";
import {
  editPageStyle,
  getChapterStartPageNum,
  updatePageNum,
  type NoteType,
  type Page,
  type Settings,
} from "@/types/PdfNotes";
import { derivsUI } from "../modelUI/derivsUI";
import { atomsUI } from "../modelUI/atomsUI";
import { atomsファイル } from "../modelファイル/atomsファイル";
import { atomsPdfNotes } from "./atomsPdfNotes";

/**
 * 使いやすいように `atomsPdfNotes` を分解しておく
 */
const {
  pdfNotes: {
    currentPage: atomCurrentPage,
    pages: atomPages,
    settings: atomSettings,
    title: atomTitle,
    version: atomVersion,
  },
  selectedList: atomsSelectedList,
  splitPage: atomsSplitPage,
  undo: atomsUndo,
} = atomsPdfNotes;

const atomPdfNotesValue = atom((get) => {
  const title = get(atomTitle);
  const version = get(atomVersion);
  const pages = get(atomPages);
  const settings = get(atomSettings);
  const currentPage = get(atomCurrentPage);
  console.log("!!!", pages);
  if (!title || !version || !settings || currentPage === undefined)
    return undefined;
  return {
    title,
    version,
    currentPage,
    settings,
    pages,
  } satisfies PdfNotes as PdfNotes;
});

const atomAssignPdfNotes = atom(null, (_, set, pdfNotes?: PdfNotes) => {
  set(atomTitle, pdfNotes?.title);
  set(atomVersion, pdfNotes?.version);
  set(atomPages, pdfNotes?.pages ?? []);
  set(atomSettings, pdfNotes?.settings);
  set(atomCurrentPage, pdfNotes?.currentPage);
  set(atomsUndo.pdfNotes, structuredClone(pdfNotes));
  set(atomsUndo.notes, undefined);
  set(atomsUndo.pageNum, undefined);
  console.log("###", pdfNotes?.pages);
  if (pdfNotes) {
    const flagsPage = Array<boolean>(pdfNotes.pages.length).fill(false);
    const flagsChapter = Array<boolean>(pdfNotes.pages.length).fill(false);
    flagsPage[pdfNotes.currentPage] = true;
    set(atomsSelectedList.page, flagsPage);
    set(atomsSelectedList.chapter, flagsChapter);
  }
});

/** 今選択されている page の情報を持つ atom を取得する atom */
const atomAtomPageValue = atom((get) => {
  const pdfNotes = get(atomPdfNotesValue);
  const currentPage = get(atomCurrentPage);
  if (!pdfNotes || currentPage === undefined) return undefined;
  return get(atomsSplitPage.atomsPage)[currentPage];
});

/** 今選択されている page を取得する atom */
const atomPageValue = atom((get) => {
  const atom = get(atomAtomPageValue);
  if (!atom) return undefined;
  return get(atom);
});

const atomPageLabelValue = atom(
  (get) => `p. ${get(atomPageValue)?.num ?? "???"}`,
);

const atomInvalidValue = atom(
  (get) =>
    !get(atomPdfNotesValue) ||
    get(atomsUI.openDrawer_pdfSelector) ||
    get(atomsUI.waiting),
);

/** % 単位 */
const atomFontScaleValue = atom((get) => {
  const pageRect = get(atomsファイル.pdf.pageRect);
  const settings = get(atomSettings);
  if (!settings || !pageRect?.rect) return 100;
  return (settings.fontSize * pageRect.rect.width) / 600;
});

const _atomUpdateNotesSnapshot = atom(null, (get, set) => {
  const page = get(atomPageValue);
  if (!page || get(atomsUndo.notes)) return;
  set(atomsUndo.notes, structuredClone(page.notes ?? []));
});

/**
 * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
 */
const atomPushNote = atom(null, (get, set, note: NoteType) => {
  const atomPage = get(atomAtomPageValue);
  if (!atomPage || get(atomInvalidValue)) return;
  set(_atomUpdateNotesSnapshot);
  const page = get(atomPage);
  page.notes ??= [];
  page.notes.push(note);
  set(atomPage, { ...page });
});

/**
 * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
 */
const atomPopNote = atom(null, (get, set, note: NoteType) => {
  const atomPage = get(atomAtomPageValue);
  if (!atomPage || get(atomInvalidValue)) return;
  set(_atomUpdateNotesSnapshot);
  const page = get(atomPage);
  if (!page.notes) return;
  page.notes = page.notes.filter((n) => n !== note);
  if (page.notes.length === 0) page.notes = undefined;
  set(atomPage, { ...page });
});

/**
 * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
 * `pop`がない場合は`push`の追加だけが行われる。
 */
const atomSetNote = atom(null, (get, set, pop: NoteType, push: NoteType) => {
  const atomPage = get(atomAtomPageValue);
  if (!atomPage || get(atomInvalidValue)) return;
  set(_atomUpdateNotesSnapshot);
  const page = get(atomPage);
  page.notes ??= [];
  page.notes = page.notes.filter((n) => n !== pop);
  page.notes.push(push);
  set(atomPage, { ...page });
});

/**
 * （注釈以外の）ページの設定を更新する
 */
const atomSetPageSettings = atom(
  null,
  (get, set, settings: Partial<Omit<Page, "notes">>, pageNum?: number) => {
    const pages = get(atomPages);
    const currentPage = get(atomCurrentPage);
    if (currentPage === undefined) return;
    pageNum ??= currentPage;
    pages[pageNum] = { ...pages[pageNum], ...settings };
    if (Object.keys(settings).includes("numRestart")) {
      updatePageNum(pages);
    }
    set(atomPages, [...pages]);
  },
);

/**
 * PDFファイルの設定を更新する
 */
const atomSetFileSettings = atom(
  null,
  (get, set, settings: Partial<Settings>) => {
    const settings0 = get(atomSettings);
    if (!settings0) return;
    set(atomSettings, { ...settings0, ...settings });
  },
);
/**
 * 今いる章の開始ページの番号を返す
 */
const atomChapterStartPageNumValue = atom((get) => {
  const currentPage = get(atomCurrentPage);
  if (get(atomInvalidValue) || currentPage === undefined) return;
  const pages = get(atomPages);
  return getChapterStartPageNum(currentPage, pages);
});

/**
 * 部名・章名・ページ番号の候補を返す
 */
const atomPreferredLabelsValue = atom((get) => {
  const title = get(atomTitle);
  const pages = get(atomPages);
  const currentPage = get(atomCurrentPage);
  if (get(atomInvalidValue) || title === undefined || currentPage === undefined)
    return {
      volumeLabel: "タイトル",
      partLabel: "第??部",
      chapterLabel: "第??章",
      pageNum: -1,
    };

  let volumeNum = 1;
  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < currentPage; i++) {
    ++pageNum;
    const page = pages[i];
    if (!page) continue;
    if (page.volume !== undefined) ++volumeNum;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.numRestart) {
      pageNum = 1 + page.numRestart;
    }
  }
  return {
    volumeLabel: title + (volumeNum === 1 ? "" : ` 第${volumeNum}巻`),
    partLabel: `第${partNum}部`,
    chapterLabel: `第${chapterNum}章`,
    pageNum,
  };
});

/**
 * 特定のページに移動する（ページ移動処理を行うのはここだけ）
 */
const atomJumpPage = atom(null, (get, set, num: number) => {
  const pages = get(atomPages);
  const currentPage = get(atomCurrentPage);
  if (get(atomInvalidValue) || !pages || currentPage === undefined) return;
  set(derivsUI.clearAlert);
  if (num < 0 || pages.length <= num) return;
  set(atomCurrentPage, num);
  set(atomsUndo.pageNum, currentPage);
  set(atomsUndo.notes, undefined);
  // 目次のハイライト用変数の更新
  set(get(atomsSplitPage.atomsIsSelectedPage)[currentPage], false);
  set(get(atomsSplitPage.atomsIsSelectedPage)[num], true);
  const chapterPageNum0 = getChapterStartPageNum(currentPage, pages);
  const chapterPageNum1 = getChapterStartPageNum(num, pages);
  if (chapterPageNum0 !== undefined)
    set(get(atomsSplitPage.atomsIsSelectedChapter)[chapterPageNum0], false);
  if (chapterPageNum1 !== undefined)
    set(get(atomsSplitPage.atomsIsSelectedChapter)[chapterPageNum1], true);
});

/**
 * ページをスクロールする
 */
const atomScrollPage = atom(
  null,
  (get, set, forward: boolean, type?: "section" | "chapter") => {
    const pages = get(atomPages);
    let nextPage = get(atomCurrentPage);
    if (get(atomInvalidValue) || nextPage === undefined) return;
    for (;;) {
      nextPage = nextPage + (forward ? 1 : -1);
      if (!type) break;
      if (nextPage === -1 || nextPage === pages.length) break;
      const page = pages[nextPage];
      const sectionBreak =
        page.style?.some((s) => s.includes("break")) === true;
      const chapterBreak =
        (page.volume ?? page.chapter ?? page.part) !== undefined;
      if (type === "section" && (sectionBreak || chapterBreak)) break;
      if (type === "chapter" && chapterBreak) break;
    }
    set(atomJumpPage, nextPage);
  },
);

/**
 * キーボードによる操作
 */
const atomKeyDown = atom(null, (get, set, e: KeyboardEvent) => {
  if (get(atomInvalidValue)) return;
  if (e.target instanceof HTMLInputElement) return; // テキストフィールドの場合は何もしない

  // 移動
  let done = true;
  if (e.key === "ArrowLeft") {
    set(atomScrollPage, false, e.shiftKey ? "section" : undefined);
  } else if (e.key === "ArrowRight") {
    set(atomScrollPage, true, e.shiftKey ? "section" : undefined);
  } else if (e.key === "ArrowUp") {
    set(atomScrollPage, false, "chapter");
  } else if (e.key === "ArrowDown") {
    set(atomScrollPage, true, "chapter");
  } else if (e.key === " ") {
    const previousPageNum = get(atomsUndo.pageNum);
    if (previousPageNum !== undefined) set(atomJumpPage, previousPageNum);
  } else {
    done = false;
  }
  if (done) return;

  // 編集
  const atomPage = get(atomAtomPageValue);
  if (!atomPage) return;
  const page = get(atomPage);
  if (e.key === "Enter") {
    const { volumeLabel, partLabel, chapterLabel } = get(
      atomPreferredLabelsValue,
    );
    if (e.altKey) {
      page.volume = page.volume === undefined ? volumeLabel : undefined;
    } else if (e.ctrlKey) {
      page.part = page.part === undefined ? partLabel : undefined;
    } else if (e.shiftKey) {
      page.chapter = page.chapter === undefined ? chapterLabel : undefined;
    } else {
      const breakBefore = page.style?.includes("break-before") === true;
      const breakMiddle = page.style?.includes("break-middle") === true;
      if (!breakBefore && !breakMiddle) {
        page.style = editPageStyle(page.style, "break-before", true);
      }
      if (breakBefore && !breakMiddle) {
        page.style = editPageStyle(page.style, "break-before", false);
        page.style = editPageStyle(page.style, "break-middle", true);
      }
      if (!breakBefore && breakMiddle) {
        page.style = editPageStyle(page.style, "break-before", true);
      }
      if (breakBefore && breakMiddle) {
        page.style = editPageStyle(page.style, "break-before", false);
        page.style = editPageStyle(page.style, "break-middle", false);
      }
    }
  } else if (e.key === "Delete") {
    const setAlert = (message: string) => {
      set(atomsUI.alert, { severity: "info", message });
    };
    if (e.shiftKey) {
      // ページ内注釈の全削除
      if (!page.notes || page.notes.length === 0) {
        setAlert("削除する注釈がありません");
        return;
      }
      set(_atomUpdateNotesSnapshot);
      page.notes = undefined;
      setAlert("このページの注釈を全て削除しました");
    } else if (e.ctrlKey) {
      // ページ内注釈のリセット
      const initialNotes = get(atomsUndo.notes);
      if (!initialNotes) {
        setAlert("未変更のため、リセットする必要はありません");
        return;
      }
      page.notes = initialNotes.length === 0 ? undefined : initialNotes;
      set(atomsUndo.notes, undefined);
      setAlert("このページの注釈を、ページ表示直後の状態にリセットしました");
    } else if (e.altKey) {
      // 注釈・設定の全リセット
      const initialPdfNotes = get(atomsUndo.pdfNotes);
      if (!initialPdfNotes) {
        setAlert("リセットできません");
        return;
      }
      if (
        window.confirm(
          "このPDF中の全ての注釈・設定を、PDF読み込み直後の状態にリセットします",
        )
      ) {
        set(atomAssignPdfNotes, initialPdfNotes);
        setAlert("全ての注釈・設定を、PDF読み込み直後の状態にリセットしました");
        return; // 👇にある set() を回避する
      } else {
        return;
      }
    } else {
      return;
    }
  } else if (e.key === "Escape") {
    const current = page.style?.some((s) => s === "excluded");
    page.style = editPageStyle(page.style, "excluded", !current);
  } else {
    return;
  }
  set(atomPage, { ...page });
});

export const derivsPdfNotes = {
  assignPdfNotes: atomAssignPdfNotes,

  values: {
    pdfNotes: atomPdfNotesValue,
    atomPage: atomAtomPageValue,
    page: atomPageValue,
    pageLabel: atomPageLabelValue,
    invalid: atomInvalidValue,
    fontScale: atomFontScaleValue,
    chapterStartPageNum: atomChapterStartPageNumValue,
    preferredLabels: atomPreferredLabelsValue,
  },

  update: {
    pushNote: atomPushNote,
    popNote: atomPopNote,
    setNote: atomSetNote,
    setPageSettings: atomSetPageSettings,
    setFileSettings: atomSetFileSettings,
    jumpPage: atomJumpPage,
    scrollPage: atomScrollPage,
    keyDown: atomKeyDown,
  },
};
