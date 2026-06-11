import type { PageRect, Resizer } from "@/types/PageRect";
import {
  ID_PDF_CANVAS_1,
  ID_PDF_CANVAS_2,
  ID_PDF_CONTAINER,
  ID_PDF_PAGE,
} from "@/types/CONSTANTS";
import { useSyncExternalStore } from "react";
import { calPageRect } from "./calPageRect";

export function usePdf() {
  const { pageRect, totalPages } = useSyncExternalStore(
    subscribePdf,
    getSnapshotPdf,
  );
  return {
    pageRect,
    totalPages,
    setPdfHandle,
    queueRenderPage,
  };
}

//|
//| private
//|

let snapshot = {
  totalPages: undefined as undefined | number,
  pageRect: undefined as undefined | PageRect,
};

/**
 * callback の設定。
 * 引数で与えられた callback を実行すると、
 * `useSyncExternalStore` しているコンポーネントでリレンダーが走る。
 */
function subscribePdf(callback: (typeof callbacks)[number]) {
  callbacks.push(callback); // callback を保存しておいて、リレンダーしたいときに呼び出す。
  return () => (callbacks = callbacks.filter((cb) => cb !== callback));
}

let callbacks: (() => void)[] = [];

function emitChange() {
  for (const callback of callbacks) {
    callback();
  }
}

/**
 * callback が呼ばれたときに更新される値
 */
function getSnapshotPdf() {
  return snapshot;
}

/**
 * PDF ファイルを読み込む。
 * ページ数を取得。
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
    snapshot = { ...snapshot, totalPages };
    emitChange();
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
 * 要素のサイズを取得。
 */
async function queueRenderPage(
  pageNum: number,
  offset: { top: number; bottom: number },
) {
  window.pdf.setCanvasId(ID_PDF_CANVAS_1, ID_PDF_CANVAS_2); // main.tsx よりも先に PdfJs.script.js を実行すること（window.pdf が undefined になる）
  const resizer: Resizer = (size) => {
    const container = document.getElementById(ID_PDF_CONTAINER);
    const page = document.getElementById(ID_PDF_PAGE);
    if (!container || !page) return;
    const rect = container.getBoundingClientRect();
    const pageRect = calPageRect(rect, size, offset);
    if (pageRect?.rect) {
      page.style.width = `${pageRect?.rect?.width}px`;
      page.style.height = `${pageRect?.rect?.height}px`;
      page.style.top = `${pageRect?.top}px`;
      page.style.bottom = `${pageRect?.bottom}px`;
    }
    page.style.visibility = pageRect ? "visible" : "collapse";
    return pageRect;
  };
  const pageRect = await window.pdf.queueRenderPageAsync(pageNum, resizer);
  if (!pageRect) return;
  snapshot = { ...snapshot, pageRect };
  emitChange();
}

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
