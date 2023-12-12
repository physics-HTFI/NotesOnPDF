import React, { useEffect, useRef, useState } from "react";
import { Box, BoxProps, Container } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import PageLabelSmall from "./PDFView/PageLabelSmall";
import PageLabelLarge from "./PDFView/PageLabelLarge";
import Control from "./PDFView/Control";
import { Settings } from "@/types/Notes";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

/** [width, height, deltaY（＝view中心とPDF中心の差）] */
const preferredSize = (
  top: number,
  bottom: number,
  pdfW?: number,
  pdfH?: number,
  viewW?: number,
  viewH?: number
): readonly [number | undefined, number | undefined, number] => {
  if (!pdfW || !pdfH || !viewW || !viewH) return [undefined, undefined, 0];
  const H = viewH * 0.01 * (100 + top + bottom);
  const W = (pdfW * H) / pdfH;
  const deltaY = -0.5 * viewH * 0.01 * (top - bottom);
  const ratio = Math.min(1, viewW / W);
  return [ratio * W, ratio * H, ratio * deltaY];
};

/**
 * `PDFView`の引数
 */
interface Props extends BoxProps {
  file?: string | File;
  currentPage?: number;
  pageLabel?: string;
  settings?: Settings;
  openDrawer: boolean;
  onLoadError?: () => void;
  onLoadSuccess?: (numPages: number) => void;
  onOpenFileTree: () => void;
  onOpenDrawer: () => void;
}

/**
 * PDFを表示するコンポーネント
 */
// TODO 除外したページを暗くする
const PDFView: React.FC<Props> = ({
  file,
  currentPage,
  pageLabel,
  settings,
  onLoadError,
  onLoadSuccess,
  onOpenFileTree,
  onOpenDrawer,
  sx,
}) => {
  const [reading, setReading] = useState(false);
  const sizes = useRef<{ width: number; height: number }[]>();
  const outer = useRef<HTMLDivElement>(null);
  const [width, height, deltaY] =
    currentPage === undefined
      ? [undefined, undefined]
      : preferredSize(
          settings?.offsetTop ?? 0,
          settings?.offsetBottom ?? 0,
          sizes.current?.[currentPage]?.width,
          sizes.current?.[currentPage]?.height,
          outer.current?.clientWidth,
          outer.current?.clientHeight
        );

  useEffect(() => {
    if (currentPage === undefined) return;
    setReading(true);
  }, [currentPage]);

  return (
    <Box
      sx={{
        ...sx,
        background: "gainsboro",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      ref={outer}
    >
      <Container
        sx={{
          width,
          height,
          transform: `translate(0, ${deltaY}px)`,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
        }}
        disableGutters
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
          <Page
            pageIndex={currentPage}
            width={width}
            error={""}
            loading={""}
            noData={""}
            onRenderSuccess={() => {
              setReading(false);
            }}
          />
        </Document>
        <PageLabelLarge label={pageLabel} shown={reading} />
      </Container>
      <PageLabelSmall label={pageLabel} />
      <Control onOpenFileTree={onOpenFileTree} onOpenSettings={onOpenDrawer} />
    </Box>
  );
};

export default PDFView;
