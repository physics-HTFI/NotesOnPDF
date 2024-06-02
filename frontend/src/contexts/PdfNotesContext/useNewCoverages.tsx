import PdfNotes from "@/types/PdfNotes";
import { useContext } from "react";
import ModelContext from "../ModelContext/ModelContext";
import Coverages, { GetCoverage } from "@/types/Coverages";

export default function useNewCoverages() {
  const { fileTree, coverages } = useContext(ModelContext);

  /**
   * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
   */
  function getNewCoveragesOrUndefined(id?: string, pdfNotes?: PdfNotes) {
    if (!id || !pdfNotes || !coverages || !fileTree) return undefined;
    if (!fileTree.find((f) => f.id === id)) return undefined;

    const oldCov = coverages.pdfs[id];
    const newCov = GetCoverage(pdfNotes);
    const unchanged =
      coverages.recentId === id &&
      oldCov?.allPages === newCov.allPages &&
      oldCov.enabledPages === newCov.enabledPages &&
      oldCov.notedPages === newCov.notedPages;
    if (unchanged) return undefined;
    const newCoverages: Coverages = { ...coverages, recentId: id };
    newCoverages.pdfs[id] = newCov;
    return newCoverages;
  }

  return {
    /**
     * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
     */
    getNewCoveragesOrUndefined,
  };
}
