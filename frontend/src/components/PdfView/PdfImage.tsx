import { useContext, useEffect, useState } from "react";
import { readBinaryFromFileAsync } from "./utils/readBinary";
import PdfNotesContext, {
  type PageSize,
} from "@/contexts/PdfNotesContext/PdfNotesContext";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import UiContext from "@/contexts/UiContext";

// PDFjsの読み込みは index.html で行っている

export function PdfImage() {
  const {
    id: path,
    imageNum: pageNum,
    setPageSize,
  } = useContext(PdfNotesContext);
  const { model } = useContext(ModelContext);
  const { setWaiting, setOpenFileTreeDrawer } = useContext(UiContext);
  const [path0, setPath0] = useState<string>();
  const [pageNum0, setPageNum0] = useState<number>();

  const queueRenderPage = (pageNum?: number) => {
    if (pageNum === undefined) return;
    window.pdf.queueRenderPage(pageNum);
    window.pdf.getPageSizeAsync(pageNum).then((size) => {
      setPageSize(size);
    });
  };

  // 描画対象を設定
  const canvasId = "pdf-canvas";
  useEffect(() => window.pdf.setCanvasId(canvasId), []);

  // ファイル読み込み
  if (path && path !== path0) {
    setPath0(path);
    setPageNum0(pageNum);
    const setupPdf = async () => {
      const file = await model.getFileFromPath(path);
      const arrayBuffer = await readBinaryFromFileAsync(file as File);
      await window.pdf.setDataAsync(arrayBuffer);
      queueRenderPage(pageNum);
      setWaiting(false);
      setOpenFileTreeDrawer(false);
    };
    void setupPdf();
  }

  // ページをレンダリング
  if (pageNum !== undefined && pageNum !== pageNum0) {
    setPageNum0(pageNum);
    queueRenderPage(pageNum);
  }

  return <canvas id={canvasId}></canvas>;
}

declare global {
  interface Window {
    pdf: {
      /**
       * レンダリング先の canvas を指定する
       */
      setCanvasId: (id: string) => void;

      /**
       * PDFファイルを読み込む
       */
      setDataAsync: (arrayBuffer: ArrayBuffer) => Promise<void>;

      /**
       * ページのレンダリングをリクエストする。
       * 無駄なレンダリングを抑制する。
       */
      queueRenderPage: (pageNum: number) => void;

      /**
       * ページのサイズを取得する。
       */
      getPageSizeAsync: (pageNum: number) => Promise<PageSize>;
    };
  }
}
