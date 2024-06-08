import { ResultGetPdfNotes } from "@/models/IModel";

/**
 * 1つのPDFファイルに追加された全ての情報
 */
export default interface PdfNotes {
  title: string;
  version: string;
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
  | Memo
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
export interface Memo {
  type: "Memo";
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
  /** 巻のタイトル */
  volume?: string;
  /** 部のタイトル */
  part?: string;
  /** 章のタイトル */
  chapter?: string;
  /** 新たにページ番号を振りなおす。`null`は未記入の状態。 */
  numRestart?: number | null;
  /** `break-before`:ページ前節区切り、"break-middle":ページ途中節区切り、"excluded":ページ除外 */
  style?: PageStyle[];
  /** PDFビューに表示される注釈 */
  notes?: NoteType[];
}

/**
 * `page.style`を編集したものを返す
 */
export const editPageStyle = (
  style: PageStyle[] | undefined,
  item: PageStyle,
  adds: boolean
) => {
  const set = new Set(style);
  if (adds) set.add(item);
  else set.delete(item);
  const retval = Array.from(set);
  return retval.length === 0 ? undefined : retval;
};

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
 * `PdfNotes`がまだ生成されていないファイルの場合、新規作成して返す。
 * 既存の場合はそのまま返す。
 */
export const createOrGetPdfNotes = (result: ResultGetPdfNotes) => {
  if (
    result.pdfNotes &&
    (!result.pageSizes ||
      result.pageSizes.length <= result.pdfNotes.pages.length)
  ) {
    return result.pdfNotes;
  }
  const notes: PdfNotes = result.pdfNotes ?? {
    title: result.name,
    version: "1.0",
    currentPage: 0,
    settings: { fontSize: 100, offsetTop: 0, offsetBottom: 0 },
    pages: [],
  };
  // ページ数を`result.sizes`に合わせる
  for (let i = 0; result.pageSizes && i < result.pageSizes.length; i++) {
    if (i < notes.pages.length) continue;
    notes.pages.push({ num: i + 1 });
  }
  updatePageNum(notes);
  if (!result.pdfNotes && notes.pages[0]) {
    notes.pages[0].volume = result.name;
  }
  return notes;
};

/**
 * ページ番号を更新する
 */
export function updatePageNum(pdfNotes: PdfNotes) {
  let num = 0;
  for (const p of pdfNotes.pages) {
    num = p.numRestart ?? num + 1;
    p.num = num;
  }
}

/**
 * `displayedPageNumber`を通し番号でのページ数に変換する。
 * できなかった場合は、-1を返す。
 */
export const fromDisplayedPage = (
  pdfNotes: PdfNotes,
  displayedPageNumber: number
): number => {
  const current = pdfNotes.pages[pdfNotes.currentPage]?.num;
  if (current === undefined) return -1;
  if (displayedPageNumber <= current) {
    // 現在のページより小さい場合は、遡って探す
    for (let i = pdfNotes.currentPage; i >= 0; i--) {
      if (displayedPageNumber === pdfNotes.pages[i]?.num) {
        return i;
      }
    }
  } else {
    for (let i = pdfNotes.currentPage + 1; i < pdfNotes.pages.length; i++) {
      if (displayedPageNumber === pdfNotes.pages[i]?.num) {
        return i;
      }
    }
  }
  return -1;
};
