import type PdfNotes from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { watchMaps } from "./Watch/watchMaps";
import { modelファイル } from "./modelファイル";
import { modelフォルダ } from "./modelフォルダ";
import { modelUI } from "./modelUI";
import {
  createOrGetPdfNotes,
  editPageStyle,
  FORMAT_VERSION,
  updatePageNum,
  type NoteType,
  type Page,
  type PdfNotesWithCurrentPage,
  type Settings,
} from "@/types/PdfNotes";
import { usePdf } from "./utils/usePdf/usePdf";
import { debounce } from "@mui/material";

const atomPdfNotes = atom<PdfNotes>();
const atomPreviousPageNum = atom<number>();
const atomInitialPdfNotesWithCurrentPage = atom<PdfNotesWithCurrentPage>();
const atomInitialNotes = atom<NoteType[]>();
const atomCurrentPageNum = atom<number>(0); // 現在ページ数は、ページ移動時の目次のリレンダーを押さえるため、pdfNotes とは独立に管理する

//|
//| 派生 atom
//|

const atomPreviousPageNumValue = atom((get) => get(atomPreviousPageNum));
const atomAssignPdfNotes = atom(
  null,
  (_, set, pdfNotesWithCurrentPage?: PdfNotesWithCurrentPage) => {
    set(atomPdfNotes, pdfNotesWithCurrentPage);
    set(
      atomInitialPdfNotesWithCurrentPage,
      structuredClone(pdfNotesWithCurrentPage),
    );
    set(atomInitialNotes, undefined);
    set(atomPreviousPageNum, undefined);
    set(atomCurrentPageNum, pdfNotesWithCurrentPage?.currentPage ?? 0);
  },
);
const atomPdfNotesWithCurrentPage = atom((get) => {
  const pdfNotes = get(atomPdfNotes);
  if (!pdfNotes) return undefined;
  return {
    ...pdfNotes,
    currentPage: get(atomCurrentPageNum),
  } as PdfNotesWithCurrentPage;
});
const atomPageValue = atom((get) => {
  const notes = get(atomPdfNotes);
  const pageNum = get(atomCurrentPageNum);
  if (!notes || pageNum === undefined) return undefined;
  return notes.pages[pageNum];
});
const atomPageLabelValue = atom(
  (get) => `p. ${get(atomPageValue)?.num ?? "???"}`,
);
const atomInvalidValue = atom(
  (get) =>
    !get(atomPdfNotes) ||
    !get(atomPageValue) ||
    get(modelUI.openDrawer.pdfFileTree.atom) ||
    get(modelUI.waiting.atom) ||
    get(atomCurrentPageNum) === undefined,
);

/** % 単位 */
function useFontScale() {
  const { pageRect } = usePdf();
  const pdfNotes = useAtomValue(atomPdfNotes);
  if (!pdfNotes || !pageRect?.rect) return 100;
  return (pdfNotes.settings.fontSize * pageRect.rect.width) / 600;
}

const _atomUpdateNotesSnapshot = atom(null, (get, set) => {
  if (get(atomInitialNotes)) return;
  set(atomInitialNotes, structuredClone(get(atomPageValue)?.notes ?? []));
});

const _atomPopNote = atom(null, (get, set, note: NoteType) => {
  const page = get(atomPageValue);
  if (!page) return;
  set(_atomUpdateNotesSnapshot);
  page.notes = page.notes?.filter((n) => n !== note);
  if (!page.notes) return;
  if (page.notes.length === 0) page.notes = undefined;
});

const _atomPushNote = atom(null, (get, set, note: NoteType) => {
  const pdfNotes = get(atomPdfNotes);
  const page = get(atomPageValue);
  const pageNum = get(atomCurrentPageNum);

  if (!pdfNotes || !page) return;
  set(_atomUpdateNotesSnapshot);
  page.notes ??= [];
  page.notes.push(note);
  pdfNotes.pages[pageNum] = page;
});

/**
 * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
 */
const atomPushNote = atom(null, (get, set, note: NoteType) => {
  const pdfNotes = get(atomPdfNotes);
  if (get(atomInvalidValue) || !pdfNotes) return;
  set(_atomPushNote, note);
  set(atomPdfNotes, { ...pdfNotes });
});

/**
 * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
 */
const atomPopNote = atom(null, (get, set, note: NoteType) => {
  const pdfNotes = get(atomPdfNotes);
  if (get(atomInvalidValue) || !pdfNotes) return;
  set(_atomPopNote, note);
  set(atomPdfNotes, { ...pdfNotes });
});

/**
 * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
 * `pop`がない場合は`push`の追加だけが行われる。
 */
const atomUpdateNote = atom(null, (get, set, pop: NoteType, push: NoteType) => {
  const pdfNotes = get(atomPdfNotes);
  if (get(atomInvalidValue) || !pdfNotes) return 0;
  set(_atomPopNote, pop);
  set(_atomPushNote, push);
  set(atomPdfNotes, { ...pdfNotes });
});

/**
 * （注釈以外の）ページの設定を更新する
 */
const atomUpdatePageSettings = atom(
  null,
  (get, set, settings: Partial<Omit<Page, "notes">>, pageNum?: number) => {
    const pdfNotes = get(atomPdfNotes);
    if (!pdfNotes) return;
    pageNum ??= get(atomCurrentPageNum);
    const page = pdfNotes.pages[pageNum];
    if (!page) return;
    pdfNotes.pages[pageNum] = { ...page, ...settings };
    if (Object.keys(settings).includes("numRestart")) {
      updatePageNum(pdfNotes);
    }
    set(atomPdfNotes, { ...pdfNotes });
  },
);

/**
 * PDFファイルの設定を更新する
 */
const atomUpdateFileSettings = atom(
  null,
  (get, set, settings: Partial<Settings>) => {
    const pdfNotes = get(atomPdfNotes);
    if (!pdfNotes) return;
    set(atomPdfNotes, {
      ...pdfNotes,
      settings: { ...pdfNotes.settings, ...settings },
    });
  },
);

/**
 * 今いる章の開始ページの番号を返す
 */
const atomChapterStartPageNumValue = atom((get) => {
  const pdfNotes = get(atomPdfNotes);
  if (get(atomInvalidValue) || !pdfNotes) return 0;
  const currentPage = get(atomCurrentPageNum);
  let pageNum = 0;
  for (let i = 1; i <= currentPage; i++) {
    if (pdfNotes.pages[i]?.chapter === undefined) continue;
    pageNum = i;
  }
  return pageNum;
});

/**
 * 部名・章名・ページ番号の候補を返す
 */
const atomPreferredLabelsValue = atom((get) => {
  const pdfNotes = get(atomPdfNotes);
  const currentPage = get(atomCurrentPageNum);
  if (get(atomInvalidValue) || !pdfNotes)
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
    const page = pdfNotes.pages[i];
    if (!page) continue;
    if (page.volume !== undefined) ++volumeNum;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.numRestart) {
      pageNum = 1 + page.numRestart;
    }
  }
  return {
    volumeLabel: pdfNotes.title + (volumeNum === 1 ? "" : ` 第${volumeNum}巻`),
    partLabel: `第${partNum}部`,
    chapterLabel: `第${chapterNum}章`,
    pageNum,
  };
});

/**
 * 特定のページに移動する（ページ移動処理を行うのはここだけ）
 */
const atomJumpPage = atom(null, (get, set, num: number) => {
  const pdfNotes = get(atomPdfNotes);
  const pageNum = get(atomCurrentPageNum);
  if (get(atomInvalidValue) || !pdfNotes) return;
  set(modelUI.alert.atomClear);
  if (num < 0 || pdfNotes.pages.length <= num) return;
  set(atomCurrentPageNum, num);
  set(atomPreviousPageNum, pageNum);
  set(atomInitialNotes, undefined);
});

/**
 * ページをスクロールする
 */
const atomScrollPage = atom(
  null,
  (get, set, forward: boolean, type?: "section" | "chapter") => {
    const pages = get(atomPdfNotes)?.pages;
    let nextPage = get(atomCurrentPageNum);
    if (get(atomInvalidValue) || !pages || nextPage === undefined) return;
    for (;;) {
      nextPage = nextPage + (forward ? 1 : -1);
      if (!type) break;
      if (nextPage === -1 || nextPage === pages.length) break;
      const page = pages[nextPage];
      const sectionBreak =
        page?.style?.some((s) => s.includes("break")) === true;
      const chapterBreak =
        (page?.volume ?? page?.chapter ?? page?.part) !== undefined;
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
  const pdfNotes = get(atomPdfNotes);
  const page = get(atomPageValue);
  if (get(atomInvalidValue) || !page || !pdfNotes) return;
  if (e.target instanceof HTMLInputElement) return; // テキストフィールドの場合は何もしない

  if (e.key === "ArrowLeft") {
    set(atomScrollPage, false, e.shiftKey ? "section" : undefined);
  }
  if (e.key === "ArrowRight") {
    set(atomScrollPage, true, e.shiftKey ? "section" : undefined);
  }
  if (e.key === "ArrowUp") {
    set(atomScrollPage, false, "chapter");
  }
  if (e.key === "ArrowDown") {
    set(atomScrollPage, true, "chapter");
  }
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
    set(atomPdfNotes, { ...pdfNotes });
  }
  if (e.key === " ") {
    const previousPageNum = get(atomPreviousPageNum);
    if (previousPageNum === undefined) return;
    set(atomJumpPage, previousPageNum);
  }
  if (e.key === "Delete") {
    const setAlert = (message: string) => {
      set(modelUI.alert.atom, { severity: "info", message });
    };
    if (e.shiftKey) {
      // ページ内注釈の全削除
      if (!page.notes || page.notes.length === 0) {
        setAlert("削除する注釈がありません");
      } else {
        set(_atomUpdateNotesSnapshot);
        page.notes = undefined;
        set(atomPdfNotes, { ...pdfNotes });
        setAlert("このページの注釈を全て削除しました");
      }
    } else if (e.ctrlKey) {
      // ページ内注釈のリセット
      const initialNotes = get(atomInitialNotes);
      if (initialNotes) {
        page.notes = initialNotes.length === 0 ? undefined : initialNotes;
        set(atomPdfNotes, { ...pdfNotes });
        set(atomInitialNotes, undefined);
        setAlert("このページの注釈を、ページ表示直後の状態にリセットしました");
      } else {
        setAlert("未変更のため、リセットする必要はありません");
      }
    } else if (e.altKey) {
      // 注釈・設定の全リセット
      const initialPdfNotes = get(atomInitialPdfNotesWithCurrentPage);
      if (initialPdfNotes) {
        if (
          window.confirm(
            "このPDF中の全ての注釈・設定を、PDF読み込み直後の状態にリセットします",
          )
        ) {
          set(atomAssignPdfNotes, initialPdfNotes);
          setAlert(
            "全ての注釈・設定を、PDF読み込み直後の状態にリセットしました",
          );
        }
      } else {
        setAlert("リセットできません");
      }
    }
  }
  if (e.key === "Escape") {
    if (!page) return;
    const current = page.style?.some((s) => s === "excluded");
    page.style = editPageStyle(page.style, "excluded", !current);
    set(atomPdfNotes, { ...pdfNotes });
  }
});

//|
//| export
//|

export const modelPdfNotes = {
  pdfNotes: { atom: atomPdfNotes },
  fontScale: { use: useFontScale },

  page: { atomValue: atomPageValue },
  currentPageNum: { atom: atomCurrentPageNum },
  pageLabel: { atomValue: atomPageLabelValue },
  chapterStartPageNum: { atomValue: atomChapterStartPageNumValue },
  preferredLabels: { atomValue: atomPreferredLabelsValue },
  previousPageNum: { atomValue: atomPreviousPageNumValue },

  update: {
    atomPushNote,
    atomPopNote,
    atomUpdateNote,
    atomUpdatePageSettings,
    atomUpdateFileSettings,
    atomJumpPage,
    atomScrollPage,
    atomKeyDown,
  },
};

//|
//| Watch
//|

const id = "modelPdfNotes";

/**
 * 間隔をあけて`pdfNotes`を保存する。
 * TODO: PDF ファイルを閉じたときに即時保存する。
 */
const putPdfNotesDebounced = debounce(
  (save: () => Promise<void>) => save(),
  1000,
);

// ページ変更時の処理
watchMaps.currentPage.set(id, () => {
  const save = modelフォルダ.json.useSave();
  const pdfNotesWithCurrentPage = useAtomValue(atomPdfNotesWithCurrentPage);
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);

  return async (currentPage) => {
    if (!pdfNotesWithCurrentPage || !jsonPath || currentPage === undefined)
      return;
    pdfNotesWithCurrentPage.currentPage = currentPage;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(currentPage))
      ?.scrollIntoView({ block: "nearest" });
    // 注釈ファイル保存
    void putPdfNotesDebounced(() => save(pdfNotesWithCurrentPage, jsonPath));
  };
});

// pdfNotes 変更時の処理
watchMaps.pdfNotes.set(id, () => {
  const save = modelフォルダ.json.useSave();
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const pageNum = useAtomValue(modelPdfNotes.currentPageNum.atom);
  const pdfNotesWithCurrentPage = useAtomValue(atomPdfNotesWithCurrentPage);

  return () => {
    if (!pdfNotesWithCurrentPage || !jsonPath || pageNum === undefined) return;
    // 注釈ファイル保存
    void putPdfNotesDebounced(() => save(pdfNotesWithCurrentPage, jsonPath));
  };
});

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const assignPdfNotes = useSetAtom(atomAssignPdfNotes);

  return async () => {
    assignPdfNotes(undefined);
  };
});

// PDF のロードが終わった時の処理
watchMaps.pdfLoaded.set(id, () => {
  const assignPdfNotes = useSetAtom(atomAssignPdfNotes);
  const read = modelフォルダ.json.useRead();
  const setAlert = modelUI.alert.useSet();
  const setReadOnly = useSetAtom(modelフォルダ.readOnly.atom);
  const title = useAtomValue(modelファイル.pdf.atomTitleValue);
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const totalPages = useAtomValue(modelファイル.pdf.atomTotalPagesValue);

  return async (loaded) => {
    if (!loaded || !jsonPath || !title || totalPages === undefined) return;
    // pdfNotes を読み込む
    const pdfNotes = await read<PdfNotesWithCurrentPage>(jsonPath, false);
    if (pdfNotes && pdfNotes.version !== FORMAT_VERSION) {
      // TODO マイグレーション
      setAlert(
        "error",
        <>
          注釈ファイルのバージョンが異なるため開けません。 <br />
          読み取り専用モードに切り替えました。 <br />
        </>,
      );
      await setReadOnly(true);
      return;
    }
    assignPdfNotes(createOrGetPdfNotes(title, totalPages, pdfNotes));
  };
});

// PDF と pdfNotes のロードが終わった時の処理
watchMaps.pdfFullLoaded.set(id, () => {
  const render = modelファイル.pdf.useRenderPage();

  return async (loaded) => {
    // 初期ページをレンダリングする
    if (!loaded) return;
    await render();
  };
});
