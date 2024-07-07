import ModelContext from "@/contexts/ModelContext/ModelContext";
import UiContext from "@/contexts/UiContext";
import PdfNotes, {
  NoteType,
  Page,
  Settings as PdfSettings,
  editPageStyle,
  updatePageNum,
} from "@/types/PdfNotes";
import { useCallback, useContext, useRef, useState } from "react";

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
   * 特定のページへの移動処理を開始する。
   * ウェブ版はこれを呼ぶだけで移動処理が終わる。
   * デスクトップ版は画像読み込みだけ行うので、読み込み後に`jumpPageEnd`を実行して移動処理を行う。
   */
  jumpPageStart(num: number): void;

  /**
   * 特定のページへの移動処理の後半（デスクトップ版のみ）
   */
  jumpPageEnd(num: number): void;

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
    pageNum?: number
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
  const { inert } = useContext(ModelContext);
  const { openFileTreeDrawer, waiting, setAlert } = useContext(UiContext);
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [imageNum, setImageNum] = useState<number>();
  const pdfNotesSnapshot = useRef<PdfNotes>();
  const notesSnapshot = useRef<NoteType[]>();
  const previousPageNum = useRef<number>();
  const page = pdfNotes?.pages[pdfNotes.currentPage];
  const invalid =
    !page || openFileTreeDrawer || waiting || inert || imageNum === undefined;
  const pageLabel = `p. ${page?.num ?? "???"}`;

  const updateNotesSnapshot = useCallback(() => {
    if (notesSnapshot.current) return;
    notesSnapshot.current = structuredClone(page?.notes ?? []);
  }, [page?.notes]);

  /**
   * 読み込み時の`PdfNotes`設定処理を行う
   */
  const assignPdfNotes = useCallback((pdfNotes?: PdfNotes) => {
    setPdfNotes(pdfNotes);
    setImageNum(pdfNotes?.currentPage);
    pdfNotesSnapshot.current = structuredClone(pdfNotes);
    notesSnapshot.current = undefined;
    previousPageNum.current = undefined;
  }, []);

  /**
   * 実際の移動処理
   */
  const jumpPageEnd = useCallback(
    (num: number) => {
      if (invalid) return;
      setPdfNotes({ ...pdfNotes, currentPage: num });
      previousPageNum.current = pdfNotes.currentPage;
      notesSnapshot.current = undefined;
    },
    [invalid, pdfNotes]
  );

  /**
   * 特定のページに移動する（ページ移動処理を行うのはここだけ）
   */
  const jumpPageStart = useCallback(
    (num: number) => {
      if (invalid) return;
      setAlert();
      if (imageNum === num) return;
      if (num < 0 || pdfNotes.pages.length <= num) return;
      if (import.meta.env.MODE === "web") {
        setImageNum(num);
        jumpPageEnd(num); // ウェブ版ではすぐに更新する
      } else {
        setImageNum(num);
        // デスクトップ版では、画像読み込み後にjumpPageEndを呼ぶ
      }
    },
    [invalid, imageNum, pdfNotes?.pages.length, setAlert, jumpPageEnd]
  );

  /**
   * ページをスクロールする
   */
  const scrollPage = useCallback(
    (forward: boolean, type?: "section" | "chapter") => {
      if (invalid) return;
      let nextPage = imageNum;
      for (;;) {
        const candidate = Math.max(
          0,
          Math.min(pdfNotes.pages.length - 1, nextPage + (forward ? 1 : -1))
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
      jumpPageStart(nextPage);
    },
    [invalid, jumpPageStart, imageNum, pdfNotes?.pages]
  );

  const _popNote = useCallback(
    (note: NoteType) => {
      if (!page) return;
      updateNotesSnapshot();
      page.notes = page.notes?.filter((n) => n !== note);
      if (!page.notes) return;
      if (page.notes.length === 0) page.notes = undefined;
    },
    [page, updateNotesSnapshot]
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
    [_popNote, invalid, pdfNotes, setPdfNotes]
  );

  const _pushNote = useCallback(
    (note: NoteType) => {
      if (!page) return;
      updateNotesSnapshot();
      page.notes ??= [];
      page.notes.push(note);
      pdfNotes.pages[pdfNotes.currentPage] = page;
    },
    [page, pdfNotes?.currentPage, pdfNotes?.pages, updateNotesSnapshot]
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
    [_pushNote, invalid, pdfNotes, setPdfNotes]
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
    [_popNote, _pushNote, invalid, pdfNotes, setPdfNotes]
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
    [pdfNotes, setPdfNotes]
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
    [pdfNotes, setPdfNotes]
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
        if (previousPageNum.current === undefined) return;
        jumpPageStart(previousPageNum.current);
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
              "このページの注釈を、ページ表示直後の状態にリセットしました"
            );
          } else {
            setAlert("info", "未変更のため、リセットする必要はありません");
          }
        } else if (e.altKey) {
          // 注釈・設定の全リセット
          if (pdfNotesSnapshot.current) {
            if (
              window.confirm(
                "このPDF中の全ての注釈・設定を、PDF読み込み直後の状態にリセットします"
              )
            ) {
              assignPdfNotes(pdfNotesSnapshot.current);
              setAlert(
                "info",
                "全ての注釈・設定を、PDF読み込み直後の状態にリセットしました"
              );
            }
          } else {
            setAlert("info", "リセットできません");
          }
        }
      }
      if (e.key === "Escape") {
        const current = page.style?.some((s) => s === "excluded");
        page.style = editPageStyle(page.style, "excluded", !current);
        setPdfNotes({ ...pdfNotes });
      }
    },
    [
      assignPdfNotes,
      getPreferredLabels,
      invalid,
      jumpPageStart,
      page,
      pdfNotes,
      previousPageNum,
      scrollPage,
      setAlert,
      updateNotesSnapshot,
    ]
  );

  return {
    pdfNotes, // この4つは関数ではないのでUpdatersの定義に含めていない
    page, //
    imageNum, //
    previousPageNum: previousPageNum.current,
    assignPdfNotes,
    pageLabel,
    scrollPage,
    jumpPageStart,
    jumpPageEnd,
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
