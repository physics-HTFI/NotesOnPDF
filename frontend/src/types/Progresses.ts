/**
 * 1つのPDFファイルの進捗情報
 */
export interface Progress {
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
export interface Progresses {
  /** 前回開いたPDFファイル */
  recentPath?: string;
  /** 各PDFの進捗率 */
  PDFs: Record<string, Progress>;
}

/** 始めて開いたPDFファイル用 */
export const Progresses_empty: Progresses = { PDFs: {} };
