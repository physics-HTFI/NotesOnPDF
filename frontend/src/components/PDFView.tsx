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
  onLoadSuccess?: (pdfPath: string, numPages: number) => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: React.FC<Props> = ({ file, onLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number>();
  const path = useMemo(() => `/PDFs/${file}`, [file]);

  return (
    <Document
      file={path}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages);
        if (!file) return;
        onLoadSuccess?.(file, numPages);
      }}
      options={options}
    >
      {Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={800} />
      ))}
    </Document>
  );
};

export default PDFView;
