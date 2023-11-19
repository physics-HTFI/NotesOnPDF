import React, { useMemo, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

/**
 * `PDFView`の引数
 */
interface Props {
  file?: string;
  onLoadError?: () => void;
  onLoadSuccess?: (pdfPath: string, numPages: number) => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: React.FC<Props> = ({ file, onLoadError, onLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const path = useMemo(() => `/PDFs/${file}`, [file]);

  return (
    <Document
      file={path}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages);
        if (!file) return;
        onLoadSuccess?.(file, numPages);
        setCurrentPage(0);
      }}
      onLoadError={onLoadError}
      options={options}
      error={""}
      loading={""}
      noData={""}
      onWheel={(e: WheelEvent) => {
        if (numPages === undefined) return;
        const next = currentPage + (e.deltaY < 0 ? -1 : 1);
        setCurrentPage(Math.max(0, Math.min(numPages - 1, next)));
      }}
    >
      <Page
        pageIndex={currentPage}
        width={400}
        error={""}
        loading={""}
        noData={""}
      />
    </Document>
  );
};

export default PDFView;
