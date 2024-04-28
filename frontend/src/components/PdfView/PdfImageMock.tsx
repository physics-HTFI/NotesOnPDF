import { FC, useContext } from "react";
import { pdfjs, Document, Page as PdfPage } from "react-pdf";
import { sampleId2Path } from "@/models/Model.Mock";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { UiStateContext } from "@/contexts/UiStateContext";
import { createPdfNotesMock } from "@/types/PdfNotes";

if (import.meta.env.VITE_IS_MOCK === "true") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

interface Props {
  width?: number;
  onEndRead: () => void;
}

/**
 * PDF画像を表示するコンポーネント
 */
const PdfImageMock: FC<Props> = ({ width, onEndRead }) => {
  const { id, file, setIdOrFile, setPdfNotes, pdfNotes } =
    useContext(PdfNotesContext);
  const { setWaiting, setOpenFileTreeDrawer } = useContext(UiStateContext);

  return (
    <Document
      file={file ?? `${import.meta.env.VITE_Pdf_ROOT}${sampleId2Path(id)}`}
      onLoadSuccess={(doc) => {
        setSizes().catch(() => undefined);
        setWaiting(false);
        setOpenFileTreeDrawer(false);

        async function setSizes() {
          if (!file) return;
          const pdfSizes: { width: number; height: number }[] = [];
          for (let i = 0; i < doc.numPages; i++) {
            const page = await doc.getPage(i + 1);
            pdfSizes.push({
              width: page.view[2] ?? 0,
              height: page.view[3] ?? 0,
            });
          }
          setPdfNotes(createPdfNotesMock(file, pdfSizes));
        }
      }}
      onLoadError={() => {
        setIdOrFile(undefined);
        setWaiting(false);
        setOpenFileTreeDrawer(true);
      }}
      options={options}
      error={""}
      loading={""}
      noData={""}
    >
      <PdfPage
        pageIndex={pdfNotes?.currentPage}
        width={width}
        error={""}
        loading={""}
        noData={""}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onRenderSuccess={() => {
          onEndRead();
        }}
      />
    </Document>
  );
};

export default PdfImageMock;
