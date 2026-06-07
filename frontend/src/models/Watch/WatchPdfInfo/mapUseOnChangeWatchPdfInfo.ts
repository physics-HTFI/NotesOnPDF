import type { PdfInfo } from "@/types/PdfInfo";

/**
 * `pdfInfo` が変更されたときの処理をここに追加する
 */
export const mapUseOnChangeWatchPdfInfo: Map<
  string,
  () => (info?: PdfInfo) => void
> = new Map();
