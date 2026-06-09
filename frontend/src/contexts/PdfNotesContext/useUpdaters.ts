import { modelPdfNotes } from "@/models/modelPdfNotes";
import { modelUI } from "@/models/modelUI";
import type PdfNotes from "@/types/PdfNotes";
import {
  type NoteType,
  type Page,
  type Settings as PdfSettings,
  editPageStyle,
  updatePageNum,
} from "@/types/PdfNotes";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";

/**
 * `pdfNotes`の更新用関数群
 */
export interface Updaters {
  /**
   * 読み込み時の`PdfNotes`設定処理を行う
   */
  assignPdfNotes: (pdfNotes?: PdfNotes) => void;

  /**
   * ページをスクロールする
   */
  scrollPage(forward: boolean, type?: "section" | "chapter"): void;

  /**
   * 特定のページへの移動する。
   */
  jumpPage(num: number): void;

  /**
   * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
   */
  popNote(note: NoteType): void;

  /**
   * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
   */
  pushNote(note: NoteType): void;

  /**
   * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  updateNote(pop: NoteType, push: NoteType): void;

  /**
   * PDFファイルの設定を更新する
   */
  updateFileSettings(settings: Partial<PdfSettings>): void;

  /**
   * （注釈以外の）ページの設定を更新する
   */
  updatePageSettings(
    settings: Partial<Omit<Page, "notes">>,
    pageNum?: number,
  ): void;

  /**
   * キーボードによる操作
   */
  handleKeyDown(e: KeyboardEvent): void;

  /**
   * 今いる章の開始ページの番号を返す
   */
  getChpapterStartPageNum(): number;

  /**
   * 部名・章名・ページ番号の候補を返す
   */
  getPreferredLabels(): {
    volumeLabel: string;
    partLabel: string;
    chapterLabel: string;
    pageNum: number;
  };
}

/**
 * `pdfNotes`の更新用関数群を返す
 */
export default function useUpdaters() {
  const openDrawer = useSetAtom(modelUI.openDrawer.pdfFileTree.atom);
  const waiting = useAtomValue(modelUI.waiting.atom);
  const setAlert = modelUI.alert.useSet();
  const clearAlert = useSetAtom(modelUI.alert.atomClear);
  const [pdfNotes, setPdfNotes] = useAtom(modelPdfNotes.pdfNotes.atom);
  const pdfNotesSnapshot = useRef<PdfNotes>(undefined);
  const notesSnapshot = useRef<NoteType[]>(undefined);
  const page = useAtomValue(modelPdfNotes.page.atomValue);
  const pageNum = useAtomValue(modelPdfNotes.pageNum.atomValue);
  const [previousPageNum, setPreviousPageNum] = useAtom(
    modelPdfNotes.previousPageNum.atom,
  );
  const invalid =
    !pdfNotes || !page || openDrawer || waiting || pageNum === undefined;

  const updateNotesSnapshot = useCallback(() => {
    if (notesSnapshot.current) return;
    notesSnapshot.current = structuredClone(page?.notes ?? []);
  }, [page?.notes]);

  /**
   * 読み込み時の`PdfNotes`設定処理を行う
   */
  const assignPdfNotes = useCallback(
    (pdfNotes?: PdfNotes) => {
      setPdfNotes(pdfNotes);
      pdfNotesSnapshot.current = structuredClone(pdfNotes);
      notesSnapshot.current = undefined;
      setPreviousPageNum(undefined);
    },
    [setPdfNotes, setPreviousPageNum],
  );

  /**
   * 特定のページに移動する（ページ移動処理を行うのはここだけ）
   */
  const jumpPage = useCallback(
    (num: number) => {
      if (invalid) return;
      clearAlert();
      if (num < 0 || pdfNotes.pages.length <= num) return;
      setPdfNotes({ ...pdfNotes, currentPage: num });
      setPreviousPageNum(pdfNotes.currentPage);
      notesSnapshot.current = undefined;
    },
    [clearAlert, invalid, pdfNotes, setPdfNotes, setPreviousPageNum],
  );

  /**
   * ページをスクロールする
   */
  const scrollPage = useCallback(
    (forward: boolean, type?: "section" | "chapter") => {
      if (invalid) return;
      let nextPage = pageNum;
      for (;;) {
        const candidate = Math.max(
          0,
          Math.min(pdfNotes.pages.length - 1, nextPage + (forward ? 1 : -1)),
        );
        if (nextPage === candidate) break; // これ以上スクロールできなくなった
        nextPage = candidate;
        if (!type) break;
        const page = pdfNotes.pages[nextPage];
        const sectionBreak =
          page?.style?.some((s) => s.includes("break")) === true;
        const chapterBreak =
          (page?.volume ?? page?.chapter ?? page?.part) !== undefined;
        if (type === "section" && (sectionBreak || chapterBreak)) break;
        if (type === "chapter" && chapterBreak) break;
      }
      jumpPage(nextPage);
    },
    [invalid, jumpPage, pageNum, pdfNotes?.pages],
  );

  const _popNote = useCallback(
    (note: NoteType) => {
      if (!page) return;
      updateNotesSnapshot();
      page.notes = page.notes?.filter((n) => n !== note);
      if (!page.notes) return;
      if (page.notes.length === 0) page.notes = undefined;
    },
    [page, updateNotesSnapshot],
  );
  /**
   * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
   */
  const popNote = useCallback(
    (note: NoteType) => {
      if (invalid) return;
      _popNote(note);
      setPdfNotes({ ...pdfNotes });
    },
    [_popNote, invalid, pdfNotes, setPdfNotes],
  );

  const _pushNote = useCallback(
    (note: NoteType) => {
      if (!pdfNotes || !page) return;
      updateNotesSnapshot();
      page.notes ??= [];
      page.notes.push(note);
      pdfNotes.pages[pdfNotes.currentPage] = page;
    },
    [page, pdfNotes, updateNotesSnapshot],
  );
  /**
   * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
   */
  const pushNote = useCallback(
    (note: NoteType) => {
      if (invalid) return;
      _pushNote(note);
      setPdfNotes({ ...pdfNotes });
    },
    [_pushNote, invalid, pdfNotes, setPdfNotes],
  );

  /**
   * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  const updateNote = useCallback(
    (pop: NoteType, push: NoteType) => {
      // if (JSON.stringify(pop) === JSON.stringify(push)) return; // Polygonの追加時はtrueになるのでまずい
      if (invalid) return;
      _popNote(pop);
      _pushNote(push);
      setPdfNotes({ ...pdfNotes });
    },
    [_popNote, _pushNote, invalid, pdfNotes, setPdfNotes],
  );

  /**
   * （注釈以外の）ページの設定を更新する
   */
  const updatePageSettings = useCallback(
    (settings: Partial<Omit<Page, "notes">>, pageNum?: number) => {
      if (!pdfNotes) return;
      pageNum ??= pdfNotes.currentPage;
      const page = pdfNotes.pages[pageNum];
      if (!page) return;
      pdfNotes.pages[pageNum] = { ...page, ...settings };
      if (Object.keys(settings).includes("numRestart")) {
        updatePageNum(pdfNotes);
      }
      setPdfNotes({ ...pdfNotes });
    },
    [pdfNotes, setPdfNotes],
  );

  /**
   * PDFファイルの設定を更新する
   */
  const updateFileSettings = useCallback(
    (settings: Partial<PdfSettings>) => {
      if (!pdfNotes) return;
      setPdfNotes({
        ...pdfNotes,
        settings: { ...pdfNotes.settings, ...settings },
      });
    },
    [pdfNotes, setPdfNotes],
  );

  /**
   * 今いる章の開始ページの番号を返す
   */
  const getChpapterStartPageNum = useCallback(() => {
    if (invalid) return 0;
    let pageNum = 0;
    for (let i = 1; i <= pdfNotes.currentPage; i++) {
      if (pdfNotes.pages[i]?.chapter === undefined) continue;
      pageNum = i;
    }
    return pageNum;
  }, [invalid, pdfNotes?.currentPage, pdfNotes?.pages]);

  /**
   * 部名・章名・ページ番号の候補を返す
   */
  const getPreferredLabels = useCallback(() => {
    if (invalid)
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
    for (let i = 0; i < pdfNotes.currentPage; i++) {
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
      volumeLabel:
        pdfNotes.title + (volumeNum === 1 ? "" : ` 第${volumeNum}巻`),
      partLabel: `第${partNum}部`,
      chapterLabel: `第${chapterNum}章`,
      pageNum,
    };
  }, [invalid, pdfNotes?.currentPage, pdfNotes?.pages, pdfNotes?.title]);

  /**
   * キーボードによる操作
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (invalid) return;
      if (e.target instanceof HTMLInputElement) return; // テキストフィールドの場合は何もしない

      if (e.key === "ArrowLeft") {
        scrollPage(false, e.shiftKey ? "section" : undefined);
      }
      if (e.key === "ArrowRight") {
        scrollPage(true, e.shiftKey ? "section" : undefined);
      }
      if (e.key === "ArrowUp") {
        scrollPage(false, "chapter");
      }
      if (e.key === "ArrowDown") {
        scrollPage(true, "chapter");
      }
      if (e.key === "Enter") {
        const { volumeLabel, partLabel, chapterLabel } = getPreferredLabels();
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
        setPdfNotes({ ...pdfNotes });
      }
      if (e.key === " ") {
        if (previousPageNum === undefined) return;
        jumpPage(previousPageNum);
      }
      if (e.key === "Delete") {
        if (e.shiftKey) {
          // ページ内注釈の全削除
          if (!page.notes || page.notes.length === 0) {
            setAlert("info", "削除する注釈がありません");
          } else {
            updateNotesSnapshot();
            page.notes = undefined;
            setPdfNotes({ ...pdfNotes });
            setAlert("info", "このページの注釈を全て削除しました");
          }
        } else if (e.ctrlKey) {
          // ページ内注釈のリセット
          if (notesSnapshot.current) {
            page.notes =
              notesSnapshot.current.length === 0
                ? undefined
                : notesSnapshot.current;
            setPdfNotes({ ...pdfNotes });
            notesSnapshot.current = undefined;
            setAlert(
              "info",
              "このページの注釈を、ページ表示直後の状態にリセットしました",
            );
          } else {
            setAlert("info", "未変更のため、リセットする必要はありません");
          }
        } else if (e.altKey) {
          // 注釈・設定の全リセット
          if (pdfNotesSnapshot.current) {
            if (
              window.confirm(
                "このPDF中の全ての注釈・設定を、PDF読み込み直後の状態にリセットします",
              )
            ) {
              assignPdfNotes(pdfNotesSnapshot.current);
              setAlert(
                "info",
                "全ての注釈・設定を、PDF読み込み直後の状態にリセットしました",
              );
            }
          } else {
            setAlert("info", "リセットできません");
          }
        }
      }
      if (e.key === "Escape") {
        if (!page) return;
        const current = page.style?.some((s) => s === "excluded");
        page.style = editPageStyle(page.style, "excluded", !current);
        setPdfNotes({ ...pdfNotes });
      }
    },
    [
      assignPdfNotes,
      getPreferredLabels,
      invalid,
      jumpPage,
      page,
      pdfNotes,
      previousPageNum,
      scrollPage,
      setAlert,
      setPdfNotes,
      updateNotesSnapshot,
    ],
  );

  return {
    assignPdfNotes,
    scrollPage,
    jumpPage,
    popNote,
    pushNote,
    updateNote,
    updateFileSettings,
    updatePageSettings,
    getChpapterStartPageNum,
    getPreferredLabels,
    handleKeyDown,
  };
}
