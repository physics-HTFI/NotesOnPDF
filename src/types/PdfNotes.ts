/**
 * 1つのPDFファイルに追加された全ての情報。
 */
export default interface PdfNotes {
  title: string;
  version: number;
  pages: Page[];
  settings: Settings;
  currentPage: number;
}

export const FORMAT_VERSION = 1;

export type NoteType =
  | Rect
  | Polygon
  | Arrow
  | Bracket
  | Marker
  | Memo
  | PageLink
  | Chip;
export interface Arrow {
  type: "Arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style: "normal" | "inverted" | "both" | "single" | "double";
}
export interface Bracket {
  type: "Bracket";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style: "normal" | "start" | "middle" | "end";
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
  style: "normal" | "fold";
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
  style: "filled" | "outlined" | "colorize";
}
export interface Rect {
  type: "Rect";
  x: number;
  y: number;
  width: number;
  height: number;
  style: "filled" | "outlined" | "colorize";
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
  adds: boolean,
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
export const createOrGetPdfNotes = (
  name: string,
  totalPages: number,
  pdfNotes?: PdfNotes,
) => {
  if (pdfNotes && totalPages <= pdfNotes.pages.length) {
    pdfNotes.pages = pdfNotes.pages.slice(0, totalPages);
    return pdfNotes;
  }
  const addsTitle = !pdfNotes || pdfNotes.pages.length === 0; // pages===0は、ウェブ版で始めて開くPDFのタイトルを追加するために必要
  const notes: PdfNotes = pdfNotes ?? {
    title: name,
    version: FORMAT_VERSION,
    currentPage: 0,
    settings: { fontSize: 100, offsetTop: 0, offsetBottom: 0 },
    pages: [],
  };
  // ページ数を `totalPages` に合わせる
  const pages = notes.pages;
  for (let i = 0; totalPages && i < totalPages; i++) {
    if (i < pages.length) continue;
    pages.push({ num: i + 1 });
  }
  updatePageNum(pages);
  if (addsTitle && pages[0]) {
    pages[0].volume = name;
  }
  return notes;
};

/**
 * ページ番号を更新する
 */
export function updatePageNum(pages: PdfNotes["pages"]) {
  let num = 0;
  for (const p of pages) {
    num = p.numRestart ?? num + 1;
    p.num = num;
  }
}

/**
 * `displayedPageNumber`を通し番号でのページ数に変換する。
 * できなかった場合は、-1を返す。
 */
export const fromDisplayedPage = (
  displayedPageNumber: number,
  pages: PdfNotes["pages"],
  currentPage: PdfNotes["currentPage"],
): number => {
  const current = pages[currentPage]?.num;
  if (current === undefined) return -1;
  if (displayedPageNumber <= current) {
    // 現在のページより小さい場合は、遡って探す
    for (let i = currentPage; i >= 0; i--) {
      if (displayedPageNumber === pages[i]?.num) {
        return i;
      }
    }
  } else {
    for (let i = currentPage + 1; i < pages.length; i++) {
      if (displayedPageNumber === pages[i]?.num) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * 今いる章の開始ページの番号を返す
 */
export function getChapterStartPageNum(
  currentPage: number,
  pages: PdfNotes["pages"],
) {
  let pageNum = 0;
  let isChapter = false;
  for (let i = 0; i <= currentPage; i++) {
    if (pages[i].chapter === undefined) {
      if (pages[i].volume !== undefined || pages[i].part !== undefined) {
        isChapter = false;
      }
      continue;
    }
    isChapter = true;
    pageNum = i;
  }
  return isChapter ? pageNum : undefined;
}
