export interface HistoryEntry {
  path: string;
  name: string;
  pages: string;
  origin: string;
  accessDate: string;
}

export type History = HistoryEntry[];

export function updateHistory(
  history: History,
  path: string,
  pages: number,
): History {
  const entry: HistoryEntry = {
    path,
    name: path.split("/").pop() ?? "",
    pages: String(pages),
    origin: "ツリー内",
    accessDate: nowToString(),
  };
  history = history.filter((e) => e.path !== entry.path);
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
