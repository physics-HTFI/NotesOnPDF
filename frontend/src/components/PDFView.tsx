import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, BoxProps, Container } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import PageLabelSmall from "./PDFView/PageLabelSmall";
import PageLabelLarge from "./PDFView/PageLabelLarge";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
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
  currentPage?: number;
  pageLabel?: string;
  onPageChange?: (pageNum: number) => void;
  onLoadError?: () => void;
  onLoadSuccess?: (pdfPath: string, numPages: number) => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: React.FC<Props> = ({
  file,
  currentPage,
  pageLabel,
  onPageChange,
  onLoadError,
  onLoadSuccess,
  sx,
}) => {
  const [reading, setReading] = useState(true);
  const path = useMemo(
    () => (file ? `${import.meta.env.VITE_PDF_ROOT}${file}` : undefined),
    [file]
  );
  const sizes = useRef<{ width: number; height: number }[]>();
  const outer = useRef<HTMLDivElement>(null);

  const [width, height] =
    currentPage === undefined
      ? [undefined, undefined]
      : preferredWidth(
          sizes.current?.[currentPage]?.width,
          sizes.current?.[currentPage]?.height,
          outer.current?.clientWidth,
          outer.current?.clientHeight
        );

  const deltaX = 0;
  const deltaY = 0;

  useEffect(() => {
    setReading(true);
  }, [currentPage]);

  /*
  useEffect(() => {
    // これがないと（同じサイズのPDFの場合に）ビューがリサイズされない
    onPageChange?.(-1); // TODO リファクタリングで動かなくなっているので要確認
  }, [onPageChange]);
  */

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
      onWheel={(e) => {
        if (currentPage === undefined) return;
        onPageChange?.(currentPage + (e.deltaY < 0 ? -1 : 1));
      }}
    >
      <PageLabelSmall label={pageLabel} />
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
            if (!file) return;
            onLoadSuccess?.(file, doc.numPages);
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
            onLoadSuccess={() => {
              setReading(false);
            }}
          />
        </Document>
        <PageLabelLarge label={pageLabel} shown={reading} />
      </Container>
    </Box>
  );
};

export default PDFView;
