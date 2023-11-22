/**
 * 1つのPDFファイルの進捗情報
 */
export interface Progress {
  allPages: number;
  enabledPages: number;
  notedPages: number;
}

/**
 * 開いたことのあるPDFの進捗情報を保持する
 */
export interface Progresses {
  recentPath?: string;
  PDFs: Record<string, Progress>;
}

export const Progresses_empty: Progresses = { PDFs: {} };
