import { useState } from "react";
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

const PDFView: React.FC = () => {
  const [numPages, setNumPages] = useState<number>();
  const [file] = useState<string>("/PDFs//文書1.pdf");

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages);
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
