import type { PdfHistoryItem } from "@/types/History";

export function createPdfHistoryItem(
  path: string,
  totalPages: number,
): PdfHistoryItem {
  return {
    path,
    name: path.split("/").pop() ?? "",
    pages: String(totalPages ?? "??"),
    accessDate: nowToString(),
  };
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
