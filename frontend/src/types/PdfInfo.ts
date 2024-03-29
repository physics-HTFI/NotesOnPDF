/**
 * 1つのPDFファイルに追加された全ての情報
 */
export interface PdfInfo {
  currentPage: number;
  pages: Page[];
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
  heads: ("start" | "end")[];
}
export interface Bracket {
  type: "Bracket";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  heads: ("start" | "end")[];
}
export interface Chip {
  type: "Chip";
  x: number;
  y: number;
  text: string;
  style: "filled" | "outlined";
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
  style: "filled" | "outlined";
}
export interface Rect {
  type: "Rect";
  x: number;
  y: number;
  width: number;
  height: number;
  style: "filled" | "outlined";
}
/** ノード位置編集時のマーカー */
export interface Node {
  type: "Node";
  target: Arrow | Bracket | Marker | Polygon | Rect;
  index: number;
}

export type PageStyle = "break-before" | "break-middle" | "excluded";

/**
 * 1つのページに追加された全ての情報
 */
export interface Page {
  /** ページ番号 */
  num: number;
  /** 本のタイトル */
  book?: string;
  /** 部のタイトル */
  part?: string;
  /** 章のタイトル */
  chapter?: string;
  /** 新たにページ番号を振りなおす */
  pageNumberRestart?: number;
  /** `break-before`:ページ前節区切り、"break-middle":ページ途中節区切り、"excluded":ページ除外 */
  style?: PageStyle[];
  /** PDFビューに表示される注釈 */
  notes?: NoteType[];
}

/**
 * 1つのPDFファイルの設定情報
 */
export interface Settings {
  /** 注釈・チップ・ページリンクの文字サイズ */
  fontSize: number;
  /** PDFの上側がどれだけ見切れるか[0-1] */
  offsetTop: number;
  /** PDFの下側がどれだけ見切れるか[0-1]*/
  offsetBottom: number;
}

/**
 * `Note`がまだ生成されていないPDFファイル用の初期インスタンスを返す
 */
export const createNewPdfInfo = (title: string, numPages: number): PdfInfo => {
  const pages: Page[] = [];
  for (let i = 0; i < numPages; i++) {
    if (i === 0) {
      pages.push({
        num: i + 1,
        book: title.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? undefined,
      });
    } else {
      pages.push({ num: i + 1 });
    }
  }
  const retval: PdfInfo = {
    currentPage: 0,
    settings: { fontSize: 70, offsetTop: 0, offsetBottom: 0 },
    pages,
  };
  return retval;
};

/**
 * ページ番号を更新する
 */
export function updatePageNum(pdfInfo: PdfInfo) {
  let num = 0;
  for (const p of pdfInfo.pages) {
    num = p.pageNumberRestart ?? num + 1;
    p.num = num;
  }
}

/**
 * `displayedPageNumber`を通し番号でのページ数に変換する。
 * できなかった場合は、-1を返す。
 */
export const fromDisplayedPage = (
  pdfInfo: PdfInfo,
  displayedPageNumber: number
): number => {
  const current = pdfInfo.pages[pdfInfo.currentPage]?.num;
  if (current === undefined) return -1;
  if (displayedPageNumber <= current) {
    // 現在のページより小さい場合は、遡って探す
    for (let i = pdfInfo.currentPage; i >= 0; i--) {
      if (displayedPageNumber === pdfInfo.pages[i]?.num) {
        return i;
      }
    }
  } else {
    for (let i = pdfInfo.currentPage + 1; i < pdfInfo.pages.length; i++) {
      if (displayedPageNumber === pdfInfo.pages[i]?.num) {
        return i;
      }
    }
  }
  return -1;
};
