export interface HistoryEntry {
  id: string;
  name: string;
  pages: string;
  origin: string;
  accessDate: string;
}

type History = HistoryEntry[];

export default History;
