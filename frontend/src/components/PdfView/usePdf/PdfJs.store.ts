import type { PageRect, Resizer } from "@/types/PageRect";
import { readBinaryAsync } from "./readBinary";

let snapshot = {
  totalPages: undefined as undefined | number,
  pageRect: undefined as undefined | PageRect,
  setCanvasId: window.pdf.setCanvasId, // main.tsx よりも先に PdfJs.script.js を実行すること（window.pdf が undefined になる）
  setPdfHandle,
  queueRenderPage,
};

/**
 * _callback の設定。
 * この _callback が呼ばれると、再描画が走る。
 */
//|
export function subscribePdf(callback: typeof _callback) {
  _callback = callback;
  return () => (_callback = undefined);
}
let _callback: (() => void) | undefined;

/**
 * _callback が呼ばれたときに更新される値
 */
export function getSnapshotPdf() {
  return snapshot;
}

/**
 * PDF ファイルを読み込む。
 * ページ数を取得。
 */
function setPdfHandle(pdfHandle: FileSystemFileHandle, onFinish: () => void) {
  const read = async () => {
    const arrayBuffer = await readBinaryAsync(pdfHandle);
    const result = await window.pdf.setDataAsync(arrayBuffer);
    onFinish();
    snapshot = { ...snapshot, totalPages: result?.totalPages };
    _callback?.();
  };
  void read();
}

/**
 * 表示するページ数を設定。
 * 要素のサイズを取得。
 */
function queueRenderPage(pageNum: number, resizer: Resizer) {
  window.pdf.queueRenderPageAsync(pageNum, resizer).then((result) => {
    snapshot = { ...snapshot, pageRect: result?.pageRect };
    _callback?.();
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
        arrayBuffer: ArrayBuffer,
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
