import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, Container } from "@mui/material";
import { pdfjs, Document, Page as PDFPage } from "react-pdf";
import PageLabelSmall from "./PDFView/PageLabelSmall";
import PageLabelLarge from "./PDFView/PageLabelLarge";
import SpeedDial, { Mode } from "./PDFView/SpeedDial";
import { Node, NoteType, toDisplayedPage } from "@/types/Notes";
import Palette from "./PDFView/Palette";
import Excluded from "./PDFView/Excluded";
import Overlay from "./PDFView/Overlay";
import { MouseContext } from "@/contexts/MouseContext";
import Editor from "./PDFView/Editor";
import { grey } from "@mui/material/colors";
import { MathJaxContext } from "better-react-mathjax";
import Move from "./PDFView/Move";
import { useNotes } from "@/hooks/useNotes";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

/**
 * 数式表示のコンフィグ
 */
const mathjaxConfig = {
  loader: {
    load: [
      "[tex]/html",
      "[tex]/boldsymbol",
      "[tex]/ams",
      "[tex]/braket",
      "[tex]/cancel",
      "[tex]/cases",
      "[tex]/color",
      //"[tex]/physics", // Mathjaxは対応していないが、physics2というのがあるらしい: https://qiita.com/Yarakashi_Kikohshi/items/131e2324f401c3effb84
    ],
  },
  tex: {
    packages: {
      "[+]": [
        "html",
        "boldsymbol",
        "ams",
        "braket",
        "cancel",
        "cases",
        "color",
        //"physics",
      ],
    },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  options: {
    enableMenu: false,
  },
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
const PDFView: FC<Props> = ({
  file,
  openDrawer,
  onLoadError,
  onLoadSuccess,
  onOpenFileTree,
  onOpenDrawer,
}) => {
  const [reading, setReading] = useState(false);
  const [paretteOpen, setParetteOpen] = useState(false);
  const sizes = useRef<{ width: number; height: number }[]>();
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const [refPage, setRefPage] = useState<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>(null);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();

  const containerRect = refContainer?.getBoundingClientRect();
  const pageRect = refPage?.getBoundingClientRect();
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const { notes, updateNote } = useNotes();
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

  const base = grey[300];
  const stripe = !mode
    ? base
    : mode === "edit"
    ? "#e0e0f8"
    : mode === "move"
    ? "#e0e5e0"
    : "#eae0e0";

  return (
    <MouseContext.Provider value={{ mouse, setMouse, pageRect }}>
      <Box
        sx={{
          background: `repeating-linear-gradient(-60deg, ${stripe}, ${stripe} 5px, ${base} 5px, ${base} 10px)`,
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          cursor: !mode ? "default" : "not-allowed",
        }}
        ref={getContainerRect}
        onMouseDown={(e) => {
          e.preventDefault();
          if (e.button !== 0) return;
          if (!pageRect) return;
          setMode(null);
          if (mode) return;
          setMouse({ pageX: e.pageX, pageY: e.pageY });
          setParetteOpen(true);
        }}
        onMouseUp={() => {
          setParetteOpen(false);
        }}
        onMouseLeave={() => {
          setParetteOpen(false);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <MathJaxContext version={3} config={mathjaxConfig}>
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
                    const [width, height] = [
                      page.view[2] ?? 0,
                      page.view[3] ?? 0,
                    ];
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
            <Overlay
              pageRect={pageRect}
              mode={mode}
              moveNote={moveNote}
              onEdit={setEditNote}
              onMove={setMoveNote}
            />
            <Move
              params={moveNote}
              mouse={mouse}
              pageRect={pageRect}
              onClose={(oldNote, newNote) => {
                setMoveNote(undefined);
                if (!oldNote || !newNote) return;
                updateNote(oldNote, newNote);
              }}
            />
          </Container>
        </MathJaxContext>

        <Excluded excluded={(!mode && page?.excluded) ?? false} />
        <PageLabelSmall label={pageLabel} hidden={Boolean(moveNote)} />
        <SpeedDial
          mode={mode}
          setMode={setMode}
          hidden={Boolean(moveNote)}
          openDrawer={openDrawer}
          onOpenSettings={onOpenDrawer}
          onOpenFileTree={onOpenFileTree}
        />
        <Palette
          open={paretteOpen}
          onClose={(note) => {
            setParetteOpen(false);
            if (note.type === "Node") setMoveNote(note);
            else setEditNote(note);
          }}
        />
        <Editor
          open={Boolean(editNote)}
          params={editNote}
          onClose={() => {
            setEditNote(undefined);
          }}
        />
      </Box>
    </MouseContext.Provider>
  );
};

export default PDFView;
