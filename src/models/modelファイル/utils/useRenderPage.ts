import { modelPdfNotes } from "@/models/modelPdfNotes";
import { usePdf } from "@/models/utils/usePdf/usePdf";
import { useAtomValue } from "jotai";

/**
 * 現在のページを再描画する
 */
export function useRenderPage() {
  const { queueRenderPage } = usePdf();
  const settings = useAtomValue(modelPdfNotes.atoms.settings);
  const pageNum = useAtomValue(modelPdfNotes.atoms.currentPage);
  return async () => {
    if (!settings) return;
    const offset = {
      top: settings.offsetTop,
      bottom: settings.offsetBottom,
    };
    await queueRenderPage(pageNum, offset);
  };
}
