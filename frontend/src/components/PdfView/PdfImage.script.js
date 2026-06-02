// 👇を参照した
// https://github.com/mozilla/pdf.js/blob/master/examples/learning/

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist/build/pdf.worker.min.mjs";

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.8;
let canvas = null;
let ctx = null;

function renderPage(pageNum) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(pageNum).then(function (page) {
    var viewport = page.getViewport({ scale: scale });
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
  setCanvasId: (id) => {
    canvas = document.getElementById(id);
    ctx = canvas.getContext("2d");
  },

  /**
   * PDFファイルを読み込む
   */
  setDataAsync: async (arrayBuffer) => {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDoc = await loadingTask.promise;
    console.log("PDF loaded: ", pdfDoc.numPages);
    window.pdf.queueRenderPage(window.pdf.pageNum);
  },

  /**
   * ページのレンダリングをリクエストする。
   * 無駄なレンダリングを抑制する。
   */
  queueRenderPage: (pageNum) => {
    if (pageNum === undefined) return;
    if (pageRendering) {
      pageNumPending = pageNum + 1;
    } else {
      renderPage(pageNum + 1);
    }
  },
};
