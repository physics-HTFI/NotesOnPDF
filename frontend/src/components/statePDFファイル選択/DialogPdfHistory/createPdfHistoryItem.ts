import type { PdfInfo } from "@/types/PdfInfo";
import type { PdfHistoryItem } from "@/types/History";

export function createPdfHistoryItem(
  pdfInfo: PdfInfo,
): PdfHistoryItem | undefined {
  if (!pdfInfo.path) return undefined;
  return {
    path: pdfInfo.path,
    name: pdfInfo.path.split("/").pop() ?? "",
    pages: String(pdfInfo.totalPages ?? "??"),
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
