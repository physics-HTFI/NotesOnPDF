// 👇を参照した
// https://github.com/mozilla/pdf.js/blob/master/examples/learning/

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist/build/pdf.worker.min.mjs";

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1;
let canvasId = null;
let canvas = null;
let ctx = null;

function renderPage(pageNum) {
  pageRendering = true;
  canvas ??= document.getElementById(canvasId);
  ctx ??= canvas?.getContext("2d");

  // Using promise to fetch the page
  pdfDoc.getPage(pageNum).then(function (page) {
    var viewport = page.getViewport({ scale });
    // Support HiDPI-screens.
    var outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    var transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      transform: transform,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
}

window.pdf = {
  /**
   * レンダリング先の canvas を指定する
   */
  setCanvasId: (id) => (canvasId = id),

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

      // ページサイズを取得
      const page = await pdfDoc.getPage(pageNum + 1);
      const viewport = page.getViewport({ scale: 1 });
      const pageRect = resizer(viewport);
      scale = pageRect.rect.height / viewport.height;

      // レンダリング
      if (pageRendering) {
        pageNumPending = pageNum + 1;
      } else {
        renderPage(pageNum + 1);
      }

      return { pageRect };
    } catch (_) {
      return undefined;
    }
  },
};
