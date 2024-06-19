import { useContext, useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import UiContext from "@/contexts/UiContext";
import { VERSION, createOrGetPdfNotes } from "@/types/PdfNotes";
import MouseContext from "@/contexts/MouseContext";
import PageLabelLarge from "./PageLabelLarge";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext, {
  PageSize,
} from "@/contexts/PdfNotesContext/PdfNotesContext";

if (import.meta.env.MODE === "web") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}
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
    pageSizes,
    setId,
    setPdfNotes,
    setPageSizes,
    updaters: { pageLabel },
  } = useContext(PdfNotesContext);
  const { pageRect } = useContext(MouseContext);
  const { readOnly, waiting, setWaiting, setOpenFileTreeDrawer, setAlert } =
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
    setWaiting(true);
    model
      .getFileFromId(id)
      .then((file) => {
        setFile(file);
      })
      .catch(() => {
        setAlert("error", "PDFファイルの取得に失敗しました");
      });
  }, [id, model, setWaiting, setAlert]);

  useEffect(() => {
    // 読み込み終了時の処理
    if (file && waiting && pageSizes && pdfNotes) {
      if (pdfNotes.version > VERSION) {
        setAlert(
          "error",
          <span>
            NotesOnPDFのバージョンが古すぎます。
            <br />
            新しいNotesOnPDFを使用してください。
          </span>
        );
        setId(undefined);
        setFile(undefined);
        setWaiting(false);
        return;
      }
      const name = file instanceof File ? file.name : file;
      setPdfNotes(createOrGetPdfNotes({ name, pdfNotes, pageSizes }));
      setWaiting(false);
      setOpenFileTreeDrawer(false);
    }
  }, [
    file,
    pageSizes,
    pdfNotes,
    setOpenFileTreeDrawer,
    setPdfNotes,
    setWaiting,
    waiting,
    setAlert,
    setId,
  ]);

  return (
    <Document
      file={file}
      onLoadSuccess={(doc) => {
        setSizes().catch(() => undefined); // 読み込みは成功しているのでエラーにはならないはず

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
