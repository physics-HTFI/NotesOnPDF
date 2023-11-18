/**
 * 1つのPDFファイルの進捗情報
 */
export interface PDFInfo {
  allPages: number;
  enabledPages: number;
  notedPages: number;
}

/**
 * 開いたことのあるPDFの進捗情報を保持する
 */
export interface PDFsInfo {
  recentPath?: string;
  PDFs: Record<string, PDFInfo>;
}

export const PDFsInfo_empty: PDFsInfo = { PDFs: {} };
