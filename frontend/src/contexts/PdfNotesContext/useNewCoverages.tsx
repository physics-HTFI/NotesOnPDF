import type PdfNotes from "@/types/PdfNotes";
import { useCallback } from "react";
import type Coverages from "@/types/Coverages";
import { GetCoverage } from "@/types/Coverages";
import { findTreeItem } from "@/types/FileTree";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "@/components/statePDFファイル選択/modelPDFファイル";

export default function useNewCoverages() {
  const fileTree = useAtomValue(modelPDFファイル.fileTree.atomValue);
  const coverages = useAtomValue(modelPDFファイル.coverages.atom);

  /**
   * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
   */
  const getNewCoveragesOrUndefined = useCallback(
    (path?: string, pdfNotes?: PdfNotes) => {
      if (!path || !pdfNotes || !coverages || !fileTree) return undefined;
      if (!findTreeItem(fileTree, path)) return undefined;

      const oldCov = coverages.pdfs[path];
      const newCov = GetCoverage(pdfNotes);
      const unchanged =
        coverages.recentPath === path &&
        oldCov?.allPages === newCov.allPages &&
        oldCov.enabledPages === newCov.enabledPages &&
        oldCov.notedPages === newCov.notedPages;
      if (unchanged) return undefined;
      const newCoverages: Coverages = { ...coverages, recentPath: path };
      newCoverages.pdfs[path] = newCov;
      return newCoverages;
    },
    [coverages, fileTree],
  );

  return {
    /**
     * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
     */
    getNewCoveragesOrUndefined,
  };
}
