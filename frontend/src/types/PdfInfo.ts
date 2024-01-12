/**
 * 1つのPDFファイルに追加された全ての情報
 */
export interface PdfInfo {
  numPages: number;
  currentPage: number;
  pages: Record<number, Page>;
  settings: Settings;
}

export type NoteType =
  | Rect
  | Polygon
  | Arrow
  | Bracket
  | Marker
  | Note
  | PageLink
  | Chip;
export type Heads = "end" | "start" | "both" | "none";
export interface Arrow {
  type: "Arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  heads?: Heads;
}
export interface Bracket {
  type: "Bracket";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  heads?: Heads;
}
export interface Chip {
  type: "Chip";
  x: number;
  y: number;
  text: string;
  outlined?: boolean;
}
export interface Marker {
  type: "Marker";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export interface Note {
  type: "Note";
  x: number;
  y: number;
  html: string;
}
export interface PageLink {
  type: "PageLink";
  x: number;
  y: number;
  page: number;
}
export interface Polygon {
  type: "Polygon";
  points: [number, number][];
  border?: boolean; // TODO Chipに合わせて"outlined"のほうが良い?
}
export interface Rect {
  type: "Rect";
  x: number;
  y: number;
  width: number;
  height: number;
  border?: boolean; // TODO Chipに合わせて"outlined"のほうが良い?
}
/** ノード位置編集時のマーカー */
export interface Node {
  type: "Node";
  target: Arrow | Bracket | Marker | Polygon | Rect;
  index: number;
}

/**
 * 1つのページに追加された全ての情報
 */
export interface Page {
  /** 本のタイトル */
  book?: string;
  /** 部のタイトル */
  part?: string;
  /** 章のタイトル */
  chapter?: string;
  /** このページの先頭で節が変わる場合`true` */
  sectionBreak?: boolean;
  /** このページの途中で節が変わる場合`true` */
  sectionBreakInner?: boolean;
  /** 新たにページ番号を振りなおす場合に数値を指定する */
  pageNumberRestart?: number;
  /** 無効なページの場合に`true` */
  excluded?: boolean;
  /** PDFビューに表示される注釈 */
  notes?: NoteType[];
}

/**
 * 1つのPDFファイルの設定情報
 */
export interface Settings {
  fontSize: number;
  /** PDFの上側がどれだけ見切れるか[0-1] */
  offsetTop: number;
  /** PDFの下側がどれだけ見切れるか[0-1]*/
  offsetBottom: number;
}

/**
 * `Note`がまだ生成されていないPDFファイル用の初期インスタンスを返す
 */
export const createNewPdfInfo = (title: string, numPages: number): PdfInfo => ({
  numPages,
  currentPage: 0,
  settings: { fontSize: 70, offsetTop: 0, offsetBottom: 0 },
  pages: {
    0: {
      book: title.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? undefined,
      pageNumberRestart: 1,
    },
  },
});

/**
 * `pageNumber`の表示上のページ数を返す。
 * `pageNumber`が省略されている場合は`pdfInfo.currentPage`を対象とする。
 */
export const toDisplayedPage = (
  pdfInfo?: PdfInfo,
  pageNumber?: number
): { pageNum?: number; pageLabel?: string } => {
  if (!pdfInfo) return { pageLabel: "p. ???" };
  pageNumber ??= pdfInfo.currentPage;
  if (pageNumber < 0 || pdfInfo.numPages <= pageNumber)
    return { pageLabel: "p. ???" };
  let retval = 0;
  for (let i = pageNumber; 0 <= i; i--) {
    const restart = pdfInfo.pages[i]?.pageNumberRestart;
    if (restart === undefined) {
      ++retval;
    } else {
      retval += restart;
      break;
    }
  }
  return { pageNum: retval, pageLabel: `p. ${retval}` };
};

/**
 * `displayedPageNumber`を通し番号でのページ数に変換する。
 * できなかった場合は、-1を返す。
 */
export const fromDisplayedPage = (
  pdfInfo: PdfInfo,
  displayedPageNumber: number
): number => {
  const current = toDisplayedPage(pdfInfo).pageNum;
  if (current === undefined) return -1;
  if (displayedPageNumber <= current) {
    // 現在のページより小さい場合は、遡って探す
    for (let i = pdfInfo.currentPage; i >= 0; i--) {
      if (displayedPageNumber === toDisplayedPage(pdfInfo, i).pageNum) {
        return i;
      }
    }
  } else {
    for (let i = pdfInfo.currentPage + 1; i < pdfInfo.numPages; i++) {
      if (displayedPageNumber === toDisplayedPage(pdfInfo, i).pageNum) {
        return i;
      }
    }
  }
  return -1;
};
