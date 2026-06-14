import { useAtomValue } from "jotai";
import { Watch } from "../Watch/Watch";
import { modelPdfNotes } from "../modelPdfNotes";
import { useEffect } from "react";
import { ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import { useRenderPage } from "./utils/useRenderPage";
import { atomsファイル } from "./atomsファイル";
import { pdfUtils } from "../../utils/pdfUtils/pdfUtils";

/**
 * PDF の描画／再描画を行う
 */
export function Watch_PDF描画() {
  const render = useRenderPage();
  const currentPage = useAtomValue(modelPdfNotes.atoms.currentPage);
  const settings = useAtomValue(modelPdfNotes.atoms.settings);
  const offset = settings
    ? { top: settings.offsetTop, bottom: settings.offsetBottom }
    : undefined;
  const pdfInfo = useAtomValue(atomsファイル.pdf.info);
  const loaded = pdfInfo.status === "loaded" && currentPage !== undefined;

  // PDF 表示ペインのサイズが変更されたら再描画
  useEffect(() => {
    const elem = document.getElementById(ID_PDF_CONTAINER);
    if (!elem) return;
    const observer = new ResizeObserver(() => pdfUtils.queueRenderPage());
    observer.observe(elem);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ページが変わったら再描画 */}
      <Watch
        target={currentPage}
        onChange={() => {
          if (currentPage === undefined) return;
          void render();
        }}
      />

      {/* PDF の読み込みが終わったら再描画 */}
      <Watch
        target={loaded}
        onChange={() => {
          if (!loaded) return;
          void render();
        }}
      />

      {/* PDF 表示位置オフセット設定が変わったら再描画 */}
      <Watch
        target={JSON.stringify(offset)}
        onChange={() => {
          if (!offset) return;
          void render();
        }}
      />
    </>
  );
}
