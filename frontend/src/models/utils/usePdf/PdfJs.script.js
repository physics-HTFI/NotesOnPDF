// 👇を参照した
// https://github.com/mozilla/pdf.js/blob/master/examples/learning/

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist/build/pdf.worker.min.mjs";

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let canvases = [null, null];
let ctxs = [null, null];
let currentCanvas = 0;

async function renderPage(pageNum, resizer) {
  pageRendering = true;
  pageNumPending = null;
  const canvas0 = canvases[currentCanvas];
  currentCanvas = (1 + currentCanvas) % 2;
  const canvas = canvases[currentCanvas];
  const ctx = ctxs[currentCanvas];
  canvas0.style.visibility = "visible";
  canvas.style.visibility = "hidden";

  // ページサイズを取得
  const page = await pdfDoc.getPage(pageNum);
  const viewport0 = page.getViewport({ scale: 1 });
  const pageRect = resizer(viewport0);
  const scale = pageRect.rect.height / viewport0.height;
  const viewport = page.getViewport({ scale });

  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1;

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";

  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  // Render PDF page into canvas context
  const renderContext = {
    canvasContext: ctx,
    transform: transform,
    viewport,
  };
  const renderTask = page.render(renderContext);

  // Wait for rendering to finish
  await renderTask.promise;
  canvas.style.visibility = "visible";
  canvas0.style.visibility = "hidden";

  if (pageNumPending !== null) {
    return await renderPage(pageNumPending, resizer);
  }
  pageRendering = false;
  return pageRect;
}

window.pdf = {
  /**
   * レンダリング先の canvas を指定する
   */
  setCanvasId: (id_1, id_2) => {
    canvases = [document.getElementById(id_1), document.getElementById(id_2)];
    ctxs = canvases.map((c) => c.getContext("2d"));
  },

  /**
   * PDFファイルを読み込む
   */
  setDataAsync: async (arrayBuffer) => {
    try {
      if (!arrayBuffer) {
        pdfDoc = undefined; // PDF の選択を解除したときにガベージコレクションの対象になることを期待
        return undefined;
      }
      const loadingTask = pdfjsLib.getDocument({
        // https://mozilla.github.io/pdf.js/api/
        data: arrayBuffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
        standardFontDataUrl: "https://unpkg.com/pdfjs-dist/standard_fonts/",
        wasmUrl: "https://unpkg.com/pdfjs-dist/wasm/", // 画像のデコードが速くなることを期待
      });
      pdfDoc = await loadingTask.promise;
      return { totalPages: pdfDoc.numPages };
    } catch (_) {
      pdfDoc = undefined;
      return undefined;
    }
  },

  /**
   * ページのレンダリングをリクエストする。
   * 無駄なレンダリングを抑制する。
   */
  queueRenderPageAsync: async (pageNum, resizer) => {
    try {
      if (!pdfDoc || pageNum === undefined) return undefined;

      // レンダリング
      if (pageRendering) {
        pageNumPending = pageNum + 1;
        return undefined;
      } else {
        return await renderPage(pageNum + 1, resizer);
      }
    } catch (_) {
      return undefined;
    }
  },
};
