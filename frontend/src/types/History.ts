export interface HistoryItem {
  path: string;
  name: string;
  pages: string;
  accessDate: string;
}

export type History = HistoryItem[];
