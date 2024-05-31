import PdfNotesContext from "@/contexts/PdfNotesContext";
import UiStateContext from "@/contexts/UiStateContext";
import { NoteType, editPageStyle, fromDisplayedPage } from "@/types/PdfNotes";
import { useContext } from "react";

/**
 * Context内の`pdfNotes, setPdfNotes`および更新用関数`update`を返す
 */
export default function usePdfNotes() {
  const { pdfNotes, setPdfNotes, previousPageNum, setPreviousPageNum } =
    useContext(PdfNotesContext);
  const { openFileTreeDrawer, waiting, inert } = useContext(UiStateContext);
  const page = pdfNotes?.pages[pdfNotes.currentPage];
  const invalid = !page || openFileTreeDrawer || waiting || inert;
  const pageLabel = `p. ${page?.num ?? "???"}`;

  /**
   * ページをスクロールする
   */
  function scrollPage(forward: boolean, type?: "section" | "chapter") {
    if (invalid) return;
    let currentPage = pdfNotes.currentPage;
    for (;;) {
      const candidate = Math.max(
        0,
        Math.min(pdfNotes.pages.length - 1, currentPage + (forward ? 1 : -1))
      );
      if (currentPage === candidate) break; // これ以上スクロールできなくなった
      currentPage = candidate;
      if (!type) break;
      const page = pdfNotes.pages[currentPage];
      const sectionBreak =
        page?.style?.some((s) => s.includes("break")) === true;
      const chapterBreak =
        (page?.volume ?? page?.chapter ?? page?.part) !== undefined;
      if (type === "section" && (sectionBreak || chapterBreak)) break;
      if (type === "chapter" && chapterBreak) break;
    }
    if (pdfNotes.currentPage === currentPage) return;
    setPdfNotes({ ...pdfNotes, currentPage });
    setPreviousPageNum(pdfNotes.currentPage);
  }

  /**
   * 特定のページに移動する
   */
  function jumpPage(num: number, isDisplayed?: boolean) {
    if (invalid) return;
    if (isDisplayed) {
      num = fromDisplayedPage(pdfNotes, num);
    }
    if (pdfNotes.currentPage === num) return;
    if (num < 0 || pdfNotes.pages.length <= num) return;
    setPdfNotes({ ...pdfNotes, currentPage: num });
    setPreviousPageNum(pdfNotes.currentPage);
  }

  /**
   * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
   */
  function popNote(note: NoteType) {
    if (invalid) return;
    _popNote(note);
    setPdfNotes({ ...pdfNotes });
  }
  function _popNote(note: NoteType) {
    if (!page) return;
    page.notes = page.notes?.filter((n) => n !== note);
    if (!page.notes) return;
    if (page.notes.length === 0) page.notes = undefined;
  }

  /**
   * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
   */
  function pushNote(note: NoteType) {
    if (invalid) return;
    _pushNote(note);
    setPdfNotes({ ...pdfNotes });
  }
  function _pushNote(note: NoteType) {
    if (!page) return;
    page.notes ??= [];
    page.notes.push(note);
    pdfNotes.pages[pdfNotes.currentPage] = page;
  }

  /**
   * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  function updateNote(pop: NoteType, push: NoteType) {
    // if (JSON.stringify(pop) === JSON.stringify(push)) return; // Polygonの追加時はtrueになるのでまずい
    if (invalid) return;
    _popNote(pop);
    _pushNote(push);
    setPdfNotes({ ...pdfNotes });
  }

  /**
   * キーボードによる操作
   */
  function handleKeyDown(e: KeyboardEvent) {
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
      if (e.ctrlKey) {
        page.notes = undefined;
        setPdfNotes({ ...pdfNotes });
      }
    }
    if (e.key === "Escape") {
      const current = page.style?.some((s) => s === "excluded");
      page.style = editPageStyle(page.style, "excluded", !current);
      setPdfNotes({ ...pdfNotes });
    }
  }

  /**
   * 部名・章名・ページ番号の候補を返す
   */
  function getPreferredLabels() {
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
      if (page.numberRestart) {
        pageNum = 1 + page.numberRestart;
      }
    }
    return {
      volumeLabel:
        pdfNotes.title + (volumeNum === 1 ? "" : ` 第${volumeNum}巻`),
      partLabel: `第${partNum}部`,
      chapterLabel: `第${chapterNum}章`,
      pageNum,
    };
  }

  return {
    pdfNotes,
    setPdfNotes,
    page: pdfNotes?.pages[pdfNotes.currentPage],
    pageLabel,
    /**
     * ページをスクロールする
     */
    scrollPage,
    /**
     * 特定のページに移動する
     */
    jumpPage,
    /**
     * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
     */
    popNote,
    /**
     * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
     */
    pushNote,
    /**
     * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
     * `pop`がない場合は`push`の追加だけが行われる。
     */
    updateNote,
    /**
     * 部名・章名・ページ番号の候補を返す
     */
    getPreferredLabels,
    /**
     * キーボードによる操作
     */
    handleKeyDown,
  };
}
