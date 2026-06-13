import type { PdfHistory } from "@/types/History";
import { atom } from "jotai";

// atom を含むファイルを編集すると、
// Hot Module Replacement の際に atom がリセットされて状態が変わってしまうので、
// atom 専用のファイルに隔離している。

export const atomsPDF履歴 = {
  history: atom<PdfHistory>([]),
};
