import { useContext, useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import UiContext from "@/contexts/UiContext";
import { createOrGetPdfNotes } from "@/types/PdfNotes";
import MouseContext from "@/contexts/MouseContext";
import PageLabelLarge from "./PageLabelLarge";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext, {
  PageSize,
} from "@/contexts/PdfNotesContext/PdfNotesContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

/**
 * PDF画像を表示するコンポーネント
 */
export default function PdfImageWeb() {
  const { model } = useContext(ModelContext);
  const {
    id,
    pdfNotes,
    setId,
    setPdfNotes,
    setPageSizes,
    updaters: { pageLabel },
  } = useContext(PdfNotesContext);
  const { pageRect } = useContext(MouseContext);
  const { readOnly, setWaiting, setOpenFileTreeDrawer, setAlert } =
    useContext(UiContext);

  const [file, setFile] = useState<string | File>();
  const [reading, setReading] = useState(false);
  const { isReading } = useReading();
  if (isReading()) {
    setReading(true);
  }

  useEffect(() => {
    setFile(undefined);
    if (!id) return;
    // ここに来た時点でpdfNotesの取得は終わっている @OpenFileDrawer
    model
      .getFileFromId(id)
      .then((file) => {
        setFile(file);
      })
      .catch(() => {
        setAlert("error", "PDFファイルの取得に失敗しました");
        setId(undefined);
        setWaiting(false);
        setOpenFileTreeDrawer(true);
      });
  }, [id, model, setWaiting, setAlert, setId, setOpenFileTreeDrawer]);

  return (
    <Document
      file={file}
      onLoadSuccess={(doc) => {
        setSizes().catch(() => undefined); // 読み込みは成功しているのでエラーにはならないはず
        // ウェブ版では↓の処理はPdfNotesの取得時には行っていない
        setWaiting(false);
        setOpenFileTreeDrawer(false);
        return;

        async function setSizes() {
          const pageSizes: PageSize[] = [];
          for (let i = 0; i < doc.numPages; i++) {
            const page = await doc.getPage(i + 1);
            pageSizes.push({
              width: page.view[2] ?? 0,
              height: page.view[3] ?? 0,
            });
          }
          setPageSizes(pageSizes);
          if (id && !readOnly) {
            await model.updateHistory(id, pageSizes.length);
          }

          // ページ数を調節する
          if (!file) return;
          const name = file instanceof File ? file.name : file;
          setPdfNotes(createOrGetPdfNotes({ name, pdfNotes, pageSizes }));
        }
      }}
      onLoadError={() => {
        setId(undefined);
        setWaiting(false);
        setOpenFileTreeDrawer(true);
      }}
      options={options}
      error={""}
      loading={""}
      noData={""}
    >
      <Page
        pageIndex={pdfNotes?.currentPage}
        width={pageRect?.width}
        error={""}
        loading={""}
        noData={""}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onRenderSuccess={() => {
          setReading(false);
        }}
      />
      <PageLabelLarge label={pageLabel} shown={reading} />
    </Document>
  );
}

/**
 * 読み込み中かどうかを返すカスタムフック
 */
function useReading() {
  const [prev, setPrev] = useState<{
    id: string;
    page: number;
  }>();
  const { id, pdfNotes } = useContext(PdfNotesContext);

  const isReading = () => {
    if (pdfNotes && id) {
      if (prev?.id !== id || prev.page !== pdfNotes.currentPage) {
        setPrev({
          id,
          page: pdfNotes.currentPage,
        });
        return true;
      }
    }
  };
  return { isReading };
}
