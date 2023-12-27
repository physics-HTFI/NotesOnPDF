import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Container } from "@mui/material";
import { pdfjs, Document, Page as PDFPage } from "react-pdf";
import PageLabelSmall from "./PDFView/PageLabelSmall";
import PageLabelLarge from "./PDFView/PageLabelLarge";
import Control from "./PDFView/Control";
import { toDisplayedPage } from "@/types/Notes";
import Palette from "./PDFView/Palette";
import Excluded from "./PDFView/Excluded";
import Overlay from "./PDFView/Overlay";
import { NotesContext } from "@/contexts/NotesContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

/** [width, height, deltaY（＝view中心とPDF中心の差）] */
const preferredSize = (
  offsetTop: number,
  offsetBottom: number,
  pdfW?: number,
  pdfH?: number,
  viewW?: number,
  viewH?: number
): readonly [number | undefined, number | undefined, number, number] => {
  if (!pdfW || !pdfH || !viewW || !viewH) return [undefined, undefined, 0, 0];
  const H = viewH / (1 - offsetTop - offsetBottom);
  const W = (pdfW * H) / pdfH;
  const ratio = Math.min(1, viewW / W);
  const top = H * offsetTop;
  const bottom = H * offsetBottom;
  const calTB = (tb: number) => {
    if (ratio === 1) return tb;
    if (top === 0 && bottom === 0) return 0;
    if (ratio * H < viewH) return 0;
    // ratio==1の時に tb, ratio*H==viewH(==H-top-bottom) の時に 0 になる
    return (1 - ((1 - ratio) * H) / (top + bottom)) * tb;
  };
  return [ratio * W, ratio * H, -calTB(top), -calTB(bottom)];
};

/**
 * `PDFView`の引数
 */
interface Props {
  file?: string | File;
  openDrawer: boolean;
  onLoadError?: () => void;
  onLoadSuccess?: (numPages: number) => void;
  onOpenFileTree: () => void;
  onOpenDrawer: () => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: React.FC<Props> = ({
  file,
  onLoadError,
  onLoadSuccess,
  onOpenFileTree,
  onOpenDrawer,
}) => {
  const [reading, setReading] = useState(false);
  const [paretteOpen, setParetteOpen] = useState(false);
  const [paretteX, setParetteX] = useState(0);
  const [paretteY, setParetteY] = useState(0);
  const sizes = useRef<{ width: number; height: number }[]>();
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const [refPage, setRefPage] = useState<HTMLDivElement>();
  const containerRect = refContainer?.getBoundingClientRect();
  const pageRect = refPage?.getBoundingClientRect();
  const { notes } = useContext(NotesContext);
  const [width, height, top, bottom] =
    notes?.currentPage === undefined
      ? [undefined, undefined]
      : preferredSize(
          notes.settings.offsetTop,
          notes.settings.offsetBottom,
          sizes.current?.[notes.currentPage]?.width,
          sizes.current?.[notes.currentPage]?.height,
          containerRect?.width,
          containerRect?.height
        );
  const page = notes ? notes.pages[notes.currentPage] : undefined;
  const { pageLabel } = toDisplayedPage(notes);

  const getPageRect = useCallback((ref: HTMLDivElement) => {
    setRefPage(ref);
  }, []);
  const getContainerRect = useCallback((ref: HTMLDivElement) => {
    setRefContainer(ref);
  }, []);

  useEffect(() => {
    if (notes?.currentPage === undefined) return;
    setReading(true);
  }, [notes?.currentPage]);

  return (
    <Box
      sx={{
        background: "gainsboro",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      ref={getContainerRect}
      onMouseDown={(e) => {
        if (!pageRect) return;
        setParetteX(e.pageX - pageRect.left);
        setParetteY(e.pageY - pageRect.top);
        setParetteOpen(true);
        e.preventDefault();
      }}
      onMouseUp={() => {
        setParetteOpen(false);
      }}
      onMouseLeave={() => {
        setParetteOpen(false);
      }}
    >
      <Container
        sx={{
          width,
          height,
          position: "absolute",
          top,
          bottom,
          left: 0,
          right: 0,
          margin: "auto",
          containerType: "size",
        }}
        disableGutters
        ref={getPageRect}
      >
        <Document
          file={
            file instanceof File
              ? file
              : `${import.meta.env.VITE_PDF_ROOT}${file}`
          }
          onLoadSuccess={(doc) => {
            if (!file) return;
            onLoadSuccess?.(doc.numPages);
            const getsizes = async () => {
              sizes.current = [];
              for (let i = 0; i < doc.numPages; i++) {
                const page = await doc.getPage(i + 1);
                const [width, height] = [page.view[2] ?? 0, page.view[3] ?? 0];
                sizes.current.push({ width, height });
              }
            };
            getsizes().catch(() => undefined);
          }}
          onLoadError={onLoadError}
          options={options}
          error={""}
          loading={""}
          noData={""}
        >
          <PDFPage
            pageIndex={notes?.currentPage}
            width={width}
            error={""}
            loading={""}
            noData={""}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onRenderSuccess={() => {
              setReading(false);
            }}
          />
        </Document>
        <PageLabelLarge label={pageLabel} shown={reading} />
        <Overlay pageRect={pageRect} />
        <Palette
          open={paretteOpen}
          x={(100 * paretteX) / (width ?? 1)}
          y={(100 * paretteY) / (height ?? 1)}
        />
      </Container>
      <Excluded excluded={page?.excluded ?? false} />
      <PageLabelSmall label={pageLabel} />
      <Control onOpenFileTree={onOpenFileTree} onOpenSettings={onOpenDrawer} />
    </Box>
  );
};

export default PDFView;
