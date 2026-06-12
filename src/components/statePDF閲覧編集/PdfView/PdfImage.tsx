import { ID_PDF_CANVAS_1, ID_PDF_CANVAS_2 } from "@/types/CONSTANTS";

// PDFjsの読み込みは index.html で行っている

export function PdfImage() {
  return (
    <>
      <canvas id={ID_PDF_CANVAS_1} style={{ position: "absolute" }}></canvas>
      <canvas id={ID_PDF_CANVAS_2} style={{ position: "absolute" }}></canvas>
    </>
  );
}
