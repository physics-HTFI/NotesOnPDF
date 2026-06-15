import { useAtomValue } from "jotai";
import { Watch } from "../Watch/Watch";
import { modelPdfNotes } from "../modelPdfNotes/modelPdfNotes";
import { useEffect } from "react";
import { ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import { useRenderPage } from "./utils/useRenderPage";
import { atomsファイル } from "./atomsファイル";

/**
 * PDF の描画／再描画を行う
 */
export function Watch_PDF描画() {
  const { render, rerenderWithCallback } = useRenderPage();
  const currentPage = modelPdfNotes.pdfNotes.useCurrentPage();
  const settings = modelPdfNotes.pdfNotes.useSettings();
  const offset = settings
    ? { top: settings.offsetTop, bottom: settings.offsetBottom }
    : undefined;
  const pdfInfo = useAtomValue(atomsファイル.pdf.info);
  const loaded = pdfInfo.status === "loaded" && currentPage !== undefined;

  // PDF 表示ペインのサイズが変更されたら再描画
  useEffect(() => {
    const elem = document.getElementById(ID_PDF_CONTAINER);
    if (!elem) return;
    const observer = new ResizeObserver(rerenderWithCallback);
    observer.observe(elem); // ここを通過しただけで callback が一度実行されるので、依存引数がなるべく更新されないようにすること
    return () => observer.disconnect();
  }, [rerenderWithCallback]);

  return (
    <>
      {/* ページが変わったら再描画 */}
      <Watch
        target={currentPage}
        onChange={(pre) => {
          if (pre === undefined || currentPage === undefined) return; // PDF 読み込み直後は何もしない
          void render(false);
        }}
      />

      {/* PDF の読み込みが終わったら再描画 */}
      <Watch
        target={loaded}
        onChange={() => {
          if (!loaded) return;
          void render(false);
        }}
      />

      {/* PDF 表示位置オフセット設定が変わったら再描画 */}
      <Watch
        target={JSON.stringify(offset)}
        onChange={(pre) => {
          if (!offset || !pre) return; // PDF 読み込み直後は何もしない
          void render(true);
        }}
      />
    </>
  );
}
