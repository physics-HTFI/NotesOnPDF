import type { PageRect, Resizer } from "@/types/PageRect";
import { readBinaryAsync } from "./readBinary";
import { ID_PDF_CANVAS } from "@/types/CONSTANTS";
import { useSyncExternalStore } from "react";

export function usePdf() {
  return useSyncExternalStore(subscribePdf, getSnapshotPdf);
}

//|
//| private
//|

let snapshot = {
  totalPages: undefined as undefined | number,
  pageRect: undefined as undefined | PageRect,
  setPdfHandle,
  queueRenderPage,
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
    const arrayBuffer = await readBinaryAsync(pdfHandle);
    const result = await window.pdf.setDataAsync(arrayBuffer);
    const totalPages = result?.totalPages;
    onFinish(totalPages);
    snapshot = { ...snapshot, totalPages };
    emitChange();
  };
  void read();
}

/**
 * 表示するページ数を設定。
 * 要素のサイズを取得。
 */
function queueRenderPage(pageNum: number, resizer: Resizer) {
  window.pdf.setCanvasId(ID_PDF_CANVAS); // main.tsx よりも先に PdfJs.script.js を実行すること（window.pdf が undefined になる）
  void window.pdf.queueRenderPageAsync(pageNum, resizer).then((result) => {
    snapshot = { ...snapshot, pageRect: result?.pageRect };
    emitChange();
  });
}

//|
//| 型
//|

declare global {
  interface Window {
    pdf: {
      /**
       * レンダリング先の canvas を指定する
       */
      setCanvasId: (canvasId: string) => void;

      /**
       * PDFファイルを読み込む
       */
      setDataAsync: (
        arrayBuffer?: ArrayBuffer,
      ) => Promise<{ totalPages: number } | undefined>;

      /**
       * ページのレンダリングをリクエストする。
       * 無駄なレンダリングを抑制する。
       * @param resizer PDF ページのサイズ => 画面上で表示すべきサイズ
       */
      queueRenderPageAsync: (
        pageNum: number,
        resizer: Resizer,
      ) => Promise<{ pageRect: PageRect } | undefined>;
    };
  }
}
