import { useAtomValue, useSetAtom } from "jotai";
import { atomsPDF履歴 } from "./atomsPDF履歴";
import { derivsPDF履歴 } from "./derivsPDF履歴";

/**
 * 📁models の外から利用する、履歴関連の機能
 */
export const modelPDF履歴 = {
  history: {
    useValue: () => useAtomValue(atomsPDF履歴.history),
    useDeleteByPath: () => useSetAtom(derivsPDF履歴.history.deleteByPath),
    useDeleteAll: () => useSetAtom(derivsPDF履歴.history.deleteAll),
  },
};
