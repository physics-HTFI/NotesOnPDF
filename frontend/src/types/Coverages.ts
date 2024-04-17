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
}

/**
 * 開いたことのあるPDFの進捗情報を保持する
 */
export interface Coverages {
  /** 前回開いたPDFファイルのパス */
  recentPath?: string;
  /** 各PDFの進捗率。keyはパス */
  PDFs: Record<string, Coverage>;
}

/** 始めて開いたPDFファイル用 */
export const GetCoverages_empty: () => Coverages = () => ({ PDFs: {} });
