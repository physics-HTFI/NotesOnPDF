export interface PdfHistoryItem {
  path: string;
  name: string;
  pages: string;
  accessDate: string;
}

export type PdfHistory = PdfHistoryItem[];
