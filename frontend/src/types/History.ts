export interface HistoryEntry {
  id: string;
  name: string;
  pages: string;
  origin: string;
  accessDate: string;
}

type History = HistoryEntry[];

export default History;

export function updateHistory(
  history: History,
  id: string,
  path: string,
  pages: number
): History {
  const entry: HistoryEntry = {
    id,
    name: path.split("/").pop() ?? "",
    pages: String(pages),
    origin: "ツリー内",
    accessDate: nowToString(),
  };
  history = history.filter((e) => e.id !== entry.id);
  history = [entry, ...history];
  return history;
}

function nowToString(): string {
  return new Date()
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
}
