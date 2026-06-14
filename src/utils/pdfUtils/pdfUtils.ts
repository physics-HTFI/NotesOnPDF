import type { PageRect, Resizer } from "@/types/PageRect";
import {
  ID_PDF_CANVAS_1,
  ID_PDF_CANVAS_2,
  ID_PDF_CONTAINER,
  ID_PDF_PAGE,
} from "@/types/CONSTANTS";
import { calPageRect } from "./calPageRect";
import { consoleDev } from "../consoleDebug";

//|
//| export
//|

export const pdfUtils = {
  setPdfHandle,
  queueRenderPage,
};

//|
//| private
//|

/**
 * PDF ファイルを読み込む。
 * `onFinish` を通じてページ数を取得できる。
 */
function setPdfHandle(
  pdfHandle: FileSystemFileHandle | undefined,
  onFinish: (totalPages?: number) => void,
) {
  const read = async () => {
    const file = await pdfHandle?.getFile();
    const url = file ? URL.createObjectURL(file) : undefined;
    if (currentUrl && url && currentUrl !== url) {
      URL.revokeObjectURL(currentUrl);
      currentUrl = url;
    }
    const result = await window.pdf.setUrlAsync(url);
    const totalPages = result?.totalPages;
    onFinish(totalPages);
  };
  if (!pdfHandle) {
    const canvas1 = document.getElementById(ID_PDF_CANVAS_1);
    const canvas2 = document.getElementById(ID_PDF_CANVAS_2);
    (canvas1 as HTMLCanvasElement).width = 0;
    (canvas2 as HTMLCanvasElement).width = 0;
  }
  void read();
}
let currentUrl: string | undefined = undefined;

/**
 * 表示するページ数を設定。
 * 引数がない場合は、前回の値を使用する。
 * 戻り値：要素のサイズ。
 */
async function queueRenderPage(
  pageNum?: number,
  offset?: { top: number; bottom: number },
) {
  window.pdf.setCanvasId(ID_PDF_CANVAS_1, ID_PDF_CANVAS_2); // main.tsx よりも先に PdfJs.script.js を実行すること（window.pdf が undefined になる）
  if (pageNum !== undefined) pageNumPrev = pageNum;
  if (offset !== undefined) offsetPrev = offset;
  if (pageNumPrev === undefined) return undefined;
  if (offsetPrev === undefined) return undefined;
  const resizer: Resizer = (size) => {
    const container = document.getElementById(ID_PDF_CONTAINER);
    const page = document.getElementById(ID_PDF_PAGE);
    if (!container || !page) return;
    const rect = container.getBoundingClientRect();
    const pageRect = calPageRect(rect, size, offsetPrev);
    if (pageRect?.rect) {
      page.style.width = `${pageRect?.rect?.width}px`;
      page.style.height = `${pageRect?.rect?.height}px`;
      page.style.top = `${pageRect?.top}px`;
      page.style.bottom = `${pageRect?.bottom}px`;
    }
    page.style.visibility = pageRect ? "visible" : "collapse";
    return pageRect;
  };
  consoleDev(`queueRenderPage: p. ${pageNumPrev}`);
  const pageRect = await window.pdf.queueRenderPageAsync(pageNumPrev, resizer);
  return pageRect;
}
let pageNumPrev: number | undefined = undefined;
let offsetPrev: Parameters<typeof queueRenderPage>[1] | undefined = undefined;

//|
//| 型
//|

declare global {
  interface Window {
    pdf: {
      /**
       * レンダリング先の canvas を指定する。
       * ダブルバッファリングを行うので 2 つ指定する。
       */
      setCanvasId: (canvasId_1: string, canvasId_2: string) => void;

      /**
       * PDFファイルを読み込む
       */
      setUrlAsync: (
        url?: string,
      ) => Promise<{ totalPages: number } | undefined>;

      /**
       * ページのレンダリングをリクエストする。
       * 無駄なレンダリングを抑制する。
       * @param resizer PDF ページのサイズ => 画面上で表示すべきサイズ
       */
      queueRenderPageAsync: (
        pageNum: number,
        resizer: Resizer,
      ) => Promise<PageRect | undefined>;
    };
  }
}
