/**
 * 1つのPDFファイルに追加された全ての情報
 */
export interface Notes {
  numPages: number;
  currentPage: number;
  pages: Record<number, Page>;
  settings: Settings;
}

interface Rect {
  type: "Rect";
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Polygon {
  type: "Polygon";
  points: [number, number][];
}
interface Arrow {
  type: "Arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface Bracket {
  type: "Bracket";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface Marker {
  type: "Marker";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface Note {
  type: "Note";
  x: number;
  y: number;
  html: string;
}
interface PageLink {
  type: "PageLink";
  x: number;
  y: number;
  page: number;
}
interface Chip {
  type: "Chip";
  x: number;
  y: number;
  label: string;
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
  notes?: (
    | Rect
    | Polygon
    | Arrow
    | Bracket
    | Marker
    | Note
    | PageLink
    | Chip
  )[];
}

/**
 * 1つのPDFファイルの設定情報
 */
export interface Settings {
  colorPrimary?: string;
  colorSecondary?: string;
  fontSizeSmall?: number;
  fontSizeMiddle?: number;
  fontSizeLarge?: number;
  /** PDFの上側がどれだけ見切れるか[0-1] */
  offsetTop: number;
  /** PDFの下側がどれだけ見切れるか[0-1]*/
  offsetBottom: number;
}

/**
 * `Note`がまだ生成されていないPDFファイル用の初期インスタンスを返す
 */
export const createNewNotes = (title: string, numPages: number): Notes => ({
  numPages,
  currentPage: 0,
  settings: { offsetTop: 0, offsetBottom: 0 },
  pages: {
    0: {
      book: title.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? undefined,
      pageNumberRestart: 1,
    },
  },
});

/**
 * `pageNumber`の表示上のページ数を返す。
 * `pageNumber`が省略されている場合は`notes.currentPage`を対象とする。
 */
export const getPageLabel = (notes: Notes, pageNumber?: number): string => {
  pageNumber ??= notes.currentPage;
  if (notes.numPages <= pageNumber) return "p. ???";
  let retval = 0;
  for (let i = pageNumber; 0 <= i; i--) {
    const restart = notes.pages[i]?.pageNumberRestart;
    if (restart === undefined) {
      ++retval;
    } else {
      retval += restart;
      break;
    }
  }
  return `p. ${retval}`;
};
