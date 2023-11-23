import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, BoxProps, Container } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  // cMapUrl: `./node_modules/pdfjs-dist/cmaps/`,
  // これだとbuild時にこれをコピーする必要がある
};

const preferredWidth = (
  pdfW?: number,
  pdfH?: number,
  viewW?: number,
  viewH?: number
) => {
  if (!pdfW || !pdfH || !viewW || !viewH) return [undefined, undefined];
  return pdfW / pdfH <= viewW / viewH
    ? [(pdfW * viewH) / pdfH, viewH]
    : [viewW, (pdfH * viewW) / pdfW];
};

/**
 * `PDFView`の引数
 */
interface Props extends BoxProps {
  file?: string;
  onLoadError?: () => void;
  onLoadSuccess?: (pdfPath: string, numPages: number) => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: React.FC<Props> = ({ file, onLoadError, onLoadSuccess, sx }) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const path = useMemo(() => `/PDFs/${file}`, [file]);
  const sizes = useRef<{ width: number; height: number }[]>();
  const outer = useRef<HTMLDivElement>(null);

  if (outer.current) {
    outer.current.onwheel = (e) => {
      if (numPages === undefined) return;
      const next = currentPage + (e.deltaY < 0 ? -1 : 1);
      setCurrentPage(Math.max(0, Math.min(numPages - 1, next)));
    };
  }

  const [width, height] = preferredWidth(
    sizes.current?.[currentPage]?.width,
    sizes.current?.[currentPage]?.height,
    outer.current?.clientWidth,
    outer.current?.clientHeight
  );
  const deltaX = 0;
  const deltaY = 0;

  useEffect(() => {
    // これがないと（同じサイズのPDFの場合に）ビューがリサイズされない
    setCurrentPage(-1);
  }, [file]);

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
          transform: `translate(${deltaX}, ${deltaY})`,
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
          file={path}
          onLoadSuccess={(doc) => {
            setNumPages(doc.numPages);
            if (!file) return;
            onLoadSuccess?.(file, doc.numPages);
            const getsizes = async () => {
              sizes.current = [];
              for (let i = 0; i < doc.numPages; i++) {
                const page = await doc.getPage(i + 1);
                const [width, height] = [page.view[2] ?? 0, page.view[3] ?? 0];
                sizes.current.push({ width, height });
              }
              setCurrentPage(0);
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
          />
        </Document>
      </Container>
    </Box>
  );
};

export default PDFView;
