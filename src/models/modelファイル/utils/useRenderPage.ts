import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";
import { useSetAtom } from "jotai";
import { atomsファイル } from "../atomsファイル";
import { pdfUtils } from "@/utils/pdfUtils/pdfUtils";

/**
 * 現在のページを再描画する
 */
export function useRenderPage() {
  const settings = modelPdfNotes.pdfNotes.useSettings();
  const pageNum = modelPdfNotes.pdfNotes.useCurrentPage();
  const setPageRect = useSetAtom(atomsファイル.pdf.pageRect);
  return async () => {
    if (!settings) return;
    const offset = {
      top: settings.offsetTop,
      bottom: settings.offsetBottom,
    };
    const pageRect = await pdfUtils.queueRenderPage(pageNum, offset);
    setPageRect(pageRect);
  };
}
