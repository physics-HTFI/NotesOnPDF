import type PdfNotes from "@/types/PdfNotes";
import { useCallback, useContext } from "react";
import ModelContext from "../ModelContext/ModelContext";
import type Coverages from "@/types/Coverages";
import { GetCoverage } from "@/types/Coverages";
import { findTreeItem } from "@/types/FileTree";

export default function useNewCoverages() {
  const { fileTree, coverages } = useContext(ModelContext);

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
