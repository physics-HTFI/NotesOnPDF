import type PdfNotes from "./PdfNotes";

/**
 * 1つのPDFファイルの進捗情報
 */
export interface Coverage {
  /** 総ページ数 */
  allPages: number;
  /** 有効なページ数 */
  enabledPages: number;
  /** 注釈がついているページ数 */
  notedPages: number;
  /** 進捗率 */
  percent: number;
}

/**
 * 開いたことのあるPDFの進捗情報を保持する
 */
export default interface Coverages {
  /** 前回開いたPDFファイルのパス */
  recentPath?: string;
  /** 各PDFの進捗率。keyはパス */
  pdfs: Record<string, Coverage>;
}

/** `coverages.json`がない場合の初期値 */
export const GetCoverages_empty: () => Coverages = () => ({ pdfs: {} });

export const GetCoverage = (pages: PdfNotes["pages"]): Coverage => {
  const enabledPages =
    pages.length - pages.filter((p) => p.style?.includes("excluded")).length;
  const notedPages = pages.filter(
    (p) => !p.style?.includes("excluded") && p.notes?.length,
  ).length;
  return {
    allPages: pages.length,
    enabledPages,
    notedPages,
    percent: Math.min(
      100,
      Math.max(0, Math.round((100 * notedPages) / Math.max(1, enabledPages))),
    ),
  };
};
