import type { PdfHistory } from "@/types/History";
import { atom } from "jotai";
import { atomsPDF履歴 } from "./atomsPDF履歴";
import { createPdfHistoryItem } from "./utils/createPdfHistoryItem";

const atomHistory = atomsPDF履歴.history;

const filterRemove = (history: PdfHistory, path: string) =>
  history.filter((e) => e.path !== path);

//|
//| export
//|

export const derivsPDF履歴 = {
  /** 履歴を編集する atom 群 */
  history: {
    add: atom(null, (get, set, item: { path: string; totalPages: number }) => {
      const newItem = createPdfHistoryItem(item.path, item.totalPages);
      const oldItems = filterRemove(get(atomHistory), item.path);
      set(atomHistory, [newItem, ...oldItems]);
    }),

    deleteByPath: atom(null, (get, set, path: string) => {
      const history = filterRemove(get(atomHistory), path);
      set(atomHistory, history);
    }),

    deleteAll: atom(null, (_, set) => set(atomHistory, [])),
  },
};
