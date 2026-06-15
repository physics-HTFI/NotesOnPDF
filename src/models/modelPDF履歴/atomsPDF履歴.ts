import type { PdfHistory } from "@/types/History";
import { atom } from "jotai";

export const atomsPDF履歴 = {
  history: atom<PdfHistory>([]),
};
