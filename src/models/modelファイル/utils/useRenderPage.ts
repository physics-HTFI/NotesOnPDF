import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";
import { useSetAtom } from "jotai";
import { atomsファイル } from "../atomsファイル";
import { pdfUtils } from "@/utils/pdfUtils/pdfUtils";
import { useCallback } from "react";
import { debounce } from "@mui/material";

const setPageRectDebounced = debounce((set: () => void) => set(), 200);

/**
 * 現在のページを再描画する
 */
export function useRenderPage() {
  const settings = modelPdfNotes.pdfNotes.useSettings();
  const pageNum = modelPdfNotes.pdfNotes.useCurrentPage();
  const setPageRect = useSetAtom(atomsファイル.pdf.pageRect);

  return {
    render: async (debounced: boolean) => {
      if (!settings) return;
      const offset = {
        top: settings.offsetTop,
        bottom: settings.offsetBottom,
      };
      const pageRect = await pdfUtils.queueRenderPage(pageNum, offset);

      if (debounced) setPageRectDebounced(() => setPageRect(pageRect));
      else setPageRect(pageRect);
      // 👆が実行されると注釈が再表示され、リサイズ時にちらつく。これを防ぐためにデバウンスする。
    },

    // useEffect 内から使う。
    // useEffect が走るのを防ぐため依存を減らしている。
    rerenderWithCallback: useCallback(async () => {
      const pageRect = await pdfUtils.queueRenderPage();
      setPageRectDebounced(() => setPageRect(pageRect));
    }, [setPageRect]),
  };
}
