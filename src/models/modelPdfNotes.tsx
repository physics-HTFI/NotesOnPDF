import type PdfNotes from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { watchMaps } from "./Watch/watchMaps";
import { modelファイル } from "./modelファイル";
import { modelフォルダ } from "./modelフォルダ/modelフォルダ";
import { modelUI } from "./modelUI/modelUI";
import {
  createOrGetPdfNotes,
  editPageStyle,
  FORMAT_VERSION,
  getChapterStartPageNum,
  updatePageNum,
  type NoteType,
  type Page,
  type Settings,
} from "@/types/PdfNotes";
import { usePdf } from "./utils/usePdf/usePdf";
import { debounce } from "@mui/material";
import { splitAtom } from "jotai/utils";
import { derivsUI } from "./modelUI/derivsUI";
import { atomsUI } from "./modelUI/atomsUI";

const atomsPdfNotes = {
  title: atom<string>(),
  version: atom<number>(),
  pages: atom<Page[]>([]),
  settings: atom<Settings>(),
  currentPage: atom<number>(0),
};

const atomPreviousPageNum = atom<number>();
const atomInitialPdfNotes = atom<PdfNotes>();
const atomInitialNotes = atom<NoteType[]>();

const atomIsSelectedPage = atom<boolean[]>([]);
const atomisSelectedChapter = atom<boolean[]>([]);
const atomAtomsIsSelectedPage = splitAtom(atomIsSelectedPage);
const atomAtomsIsSelectedChapter = splitAtom(atomisSelectedChapter);
const atomAtomsPage = splitAtom(atomsPdfNotes.pages);

//|
//| 派生 atom
//|

const atomPdfNotes = atom((get) => {
  const title = get(atomsPdfNotes.title);
  const version = get(atomsPdfNotes.version);
  const pages = get(atomsPdfNotes.pages);
  const settings = get(atomsPdfNotes.settings);
  const currentPage = get(atomsPdfNotes.currentPage);
  if (!title || !version || !settings) return undefined;
  return {
    title,
    version,
    currentPage,
    settings,
    pages,
  } satisfies PdfNotes as PdfNotes;
});
const atomPreviousPageNumValue = atom((get) => get(atomPreviousPageNum));
const atomAssignPdfNotes = atom(null, (_, set, pdfNotes?: PdfNotes) => {
  set(atomsPdfNotes.title, pdfNotes?.title);
  set(atomsPdfNotes.version, pdfNotes?.version);
  set(atomsPdfNotes.pages, pdfNotes?.pages ?? []);
  set(atomsPdfNotes.settings, pdfNotes?.settings);
  set(atomsPdfNotes.currentPage, pdfNotes?.currentPage ?? 0);
  set(atomInitialPdfNotes, structuredClone(pdfNotes));
  set(atomInitialNotes, undefined);
  set(atomPreviousPageNum, undefined);
  if (pdfNotes) {
    const flagsPage = Array<boolean>(pdfNotes.pages.length).fill(false);
    const flagsChapter = Array<boolean>(pdfNotes.pages.length).fill(false);
    flagsPage[pdfNotes.currentPage] = true;
    set(atomIsSelectedPage, flagsPage);
    set(atomisSelectedChapter, flagsChapter);
  }
});
const atomAtomPage = atom((get) => {
  const pdfNotes = get(atomPdfNotes);
  if (!pdfNotes) return undefined;
  const pageNum = get(atomsPdfNotes.currentPage);
  return get(atomAtomsPage)[pageNum];
});
const atomPage = atom((get) => {
  const atom = get(atomAtomPage);
  if (!atom) return undefined;
  return get(atom);
});
const atomPageLabelValue = atom((get) => `p. ${get(atomPage)?.num ?? "???"}`);
const atomInvalidValue = atom(
  (get) =>
    !get(atomPdfNotes) ||
    get(atomsUI.openDrawer_pdfSelector) ||
    get(atomsUI.waiting),
);

/** % 単位 */
function useFontScale() {
  const { pageRect } = usePdf();
  const settings = useAtomValue(atomsPdfNotes.settings);
  if (!settings || !pageRect?.rect) return 100;
  return (settings.fontSize * pageRect.rect.width) / 600;
}

const _atomUpdateNotesSnapshot = atom(null, (get, set) => {
  const page = get(atomPage);
  if (!page || get(atomInitialNotes)) return;
  set(atomInitialNotes, structuredClone(page.notes ?? []));
});

/**
 * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
 */
const atomPushNote = atom(null, (get, set, note: NoteType) => {
  const atomPage = get(atomAtomPage);
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
  const atomPage = get(atomAtomPage);
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
const atomUpdateNote = atom(null, (get, set, pop: NoteType, push: NoteType) => {
  const atomPage = get(atomAtomPage);
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
const atomUpdatePageSettings = atom(
  null,
  (get, set, settings: Partial<Omit<Page, "notes">>, pageNum?: number) => {
    const pages = get(atomsPdfNotes.pages);
    pageNum ??= get(atomsPdfNotes.currentPage);
    pages[pageNum] = { ...pages[pageNum], ...settings };
    if (Object.keys(settings).includes("numRestart")) {
      updatePageNum(pages);
    }
    set(atomsPdfNotes.pages, [...pages]);
  },
);

/**
 * PDFファイルの設定を更新する
 */
const atomUpdateFileSettings = atom(
  null,
  (get, set, settings: Partial<Settings>) => {
    const settings0 = get(atomsPdfNotes.settings);
    if (!settings0) return;
    set(atomsPdfNotes.settings, { ...settings0, ...settings });
  },
);

/**
 * 今いる章の開始ページの番号を返す
 */
const atomChapterStartPageNumValue = atom((get) => {
  if (get(atomInvalidValue)) return;
  const pages = get(atomsPdfNotes.pages);
  const currentPage = get(atomsPdfNotes.currentPage);
  return getChapterStartPageNum(currentPage, pages);
});

/**
 * 部名・章名・ページ番号の候補を返す
 */
const atomPreferredLabelsValue = atom((get) => {
  const title = get(atomsPdfNotes.title);
  const pages = get(atomsPdfNotes.pages);
  const currentPage = get(atomsPdfNotes.currentPage);
  if (get(atomInvalidValue) || title === undefined)
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
  const pages = get(atomsPdfNotes.pages);
  const pageNum = get(atomsPdfNotes.currentPage);
  const currentPage = get(atomsPdfNotes.currentPage);
  if (get(atomInvalidValue) || !pages) return;
  set(derivsUI.clearAlert);
  if (num < 0 || pages.length <= num) return;
  set(atomsPdfNotes.currentPage, num);
  set(atomPreviousPageNum, pageNum);
  set(atomInitialNotes, undefined);
  // 目次のハイライト用変数の更新
  set(get(atomAtomsIsSelectedPage)[pageNum], false);
  set(get(atomAtomsIsSelectedPage)[num], true);
  const chapterPageNum0 = getChapterStartPageNum(currentPage, pages);
  const chapterPageNum1 = getChapterStartPageNum(num, pages);
  if (chapterPageNum0 !== undefined)
    set(get(atomAtomsIsSelectedChapter)[chapterPageNum0], false);
  if (chapterPageNum1 !== undefined)
    set(get(atomAtomsIsSelectedChapter)[chapterPageNum1], true);
});

/**
 * ページをスクロールする
 */
const atomScrollPage = atom(
  null,
  (get, set, forward: boolean, type?: "section" | "chapter") => {
    const pages = get(atomsPdfNotes.pages);
    let nextPage = get(atomsPdfNotes.currentPage);
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
    const previousPageNum = get(atomPreviousPageNum);
    if (previousPageNum !== undefined) set(atomJumpPage, previousPageNum);
  } else {
    done = false;
  }
  if (done) return;

  // 編集
  const atomPage = get(atomAtomPage);
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
      const initialNotes = get(atomInitialNotes);
      if (!initialNotes) {
        setAlert("未変更のため、リセットする必要はありません");
        return;
      }
      page.notes = initialNotes.length === 0 ? undefined : initialNotes;
      set(atomInitialNotes, undefined);
      setAlert("このページの注釈を、ページ表示直後の状態にリセットしました");
    } else if (e.altKey) {
      // 注釈・設定の全リセット
      const initialPdfNotes = get(atomInitialPdfNotes);
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

//|
//| export
//|

export const modelPdfNotes = {
  atoms: atomsPdfNotes,
  pdfNotes: { atom: atomPdfNotes },
  fontScale: { use: useFontScale },

  page: { atomValue: atomPage },
  pageLabel: { atomValue: atomPageLabelValue },
  chapterStartPageNum: { atomValue: atomChapterStartPageNumValue },
  preferredLabels: { atomValue: atomPreferredLabelsValue },
  previousPageNum: { atomValue: atomPreviousPageNumValue },

  atomAtomsIsSelected: {
    page: atomAtomsIsSelectedPage,
    chapter: atomAtomsIsSelectedChapter,
  },

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
  return async (currentPage) => {
    if (currentPage === undefined) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(currentPage))
      ?.scrollIntoView({ block: "nearest" });
  };
});

// pdfNotes 変更時の処理
watchMaps.pdfNotes.set(id, () => {
  const save = modelフォルダ.json.useSave();
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const pageNum = useAtomValue(modelPdfNotes.atoms.currentPage);

  return (pdfNotes) => {
    if (!pdfNotes || !jsonPath || pageNum === undefined) return;
    // 注釈ファイル保存
    void putPdfNotesDebounced(() => save(pdfNotes, jsonPath));
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
  const setReadOnly = modelフォルダ.readOnly.useSet();
  const title = useAtomValue(modelファイル.pdf.atomTitleValue);
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const totalPages = useAtomValue(modelファイル.pdf.atomTotalPagesValue);

  return async (loaded) => {
    if (!loaded || !jsonPath || !title || totalPages === undefined) return;
    // pdfNotes を読み込む
    const pdfNotes = await read<PdfNotes>(jsonPath, false);
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
