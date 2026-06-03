import { ID_PDF_CANVAS } from "@/types/CONSTANTS";

// PDFjsの読み込みは index.html で行っている

export function PdfImage() {
  return <canvas id={ID_PDF_CANVAS}></canvas>;
}
