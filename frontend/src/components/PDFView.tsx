import {
  FC,
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
import SpeedDial, { Mode } from "./PDFView/SpeedDial";
import { Node, NoteType } from "@/types/PdfInfo";
import Palette from "./PDFView/Palette";
import Excluded from "./PDFView/Excluded";
import Items from "./PDFView/Items";
import { MouseContext } from "@/contexts/MouseContext";
import Editor from "./PDFView/Editor";
import { grey } from "@mui/material/colors";
import { MathJaxContext } from "better-react-mathjax";
import Move from "./PDFView/Move";
import { usePdfInfo } from "@/hooks/usePdfInfo";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import IModel from "@/models/IModel";

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
  pdfRatio?: number, // width / height
  viewW?: number,
  viewH?: number
): readonly [number | undefined, number | undefined, number, number] => {
  if (!pdfRatio || !viewW || !viewH) return [undefined, undefined, 0, 0];
  const H = viewH / (1 - offsetTop - offsetBottom);
  const W = pdfRatio * H;
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
  model: IModel;
  openDrawer: boolean;
  onLoadError?: () => void;
  onLoadSuccess?: (pageRatios: number[]) => void;
  onOpenFileTree: () => void;
  onOpenDrawer: () => void;
}

/**
 * PDFを表示するコンポーネント
 */
const PDFView: FC<Props> = ({
  file,
  model,
  openDrawer,
  onLoadError, // 不要では？
  onLoadSuccess, // 不要では？成功失敗にかかわらずドロワーを閉じてしまってもよい気がする。
  onOpenFileTree,
  onOpenDrawer,
}) => {
  const [reading, setReading] = useState(false);
  const [paretteOpen, setParetteOpen] = useState(false);
  const pdfSizes = useRef<{ width: number; height: number }[]>();
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const [refPage, setRefPage] = useState<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>(null);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();
  const [scale, setScale] = useState(100);
  const { appSettings } = useContext(AppSettingsContext);

  const containerRect = refContainer?.getBoundingClientRect();
  const pageRect = refPage?.getBoundingClientRect();
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const { pdfInfo, page, updateNote } = usePdfInfo();
  const [width, height, top, bottom] =
    pdfInfo?.currentPage === undefined
      ? [undefined, undefined]
      : preferredSize(
          pdfInfo.settings.offsetTop,
          pdfInfo.settings.offsetBottom,
          pdfInfo.pages[pdfInfo.currentPage]?.sizeRatio,
          containerRect?.width,
          containerRect?.height
        );
  const pageLabel = `p. ${pdfInfo?.pages[pdfInfo.currentPage]?.num ?? "???"}`;

  const getPageRect = useCallback((ref: HTMLDivElement) => {
    setRefPage(ref);
  }, []);
  const getContainerRect = useCallback((ref: HTMLDivElement) => {
    setRefContainer(ref);
  }, []);

  useEffect(() => {
    if (pdfInfo?.currentPage === undefined) return;
    setReading(true);
  }, [pdfInfo?.currentPage]);

  useEffect(() => {
    if (pdfInfo?.currentPage === undefined) return;
    const pageW = pageRect?.width;
    const pdfW = pdfSizes.current?.[pdfInfo.currentPage]?.width;
    if (!pageW || !pdfW) setScale(100);
    else setScale((pdfInfo.settings.fontSize * pageW) / pdfW);
  }, [pdfInfo?.currentPage, pageRect, pdfSizes, pdfInfo?.settings.fontSize]);

  const base = grey[300];
  const stripe =
    mode === "edit"
      ? "#e0e0f8"
      : mode === "move"
      ? "#e0e5e0"
      : mode === "delete"
      ? "#eae0e0"
      : base;

  return (
    <MouseContext.Provider value={{ mouse, setMouse, pageRect, scale }}>
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
          if (e.button !== 0) return;
          if (!pageRect) return;
          if (appSettings?.cancelModeWithVoidClick) setMode(null);
          if (mode ?? moveNote) return;
          setMouse({ pageX: e.pageX, pageY: e.pageY });
          setParetteOpen(true);
        }}
        onMouseUp={() => {
          setParetteOpen(false);
        }}
        onMouseLeave={() => {
          setParetteOpen(false);
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
            {import.meta.env.VITE_IS_MOCK === "true" ? (
              <Document
                file={
                  file instanceof File
                    ? file
                    : `${import.meta.env.VITE_PDF_ROOT}${file}`
                }
                onLoadSuccess={(doc) => {
                  if (!file) return;
                  const getsizes = async () => {
                    pdfSizes.current = [];
                    for (let i = 0; i < doc.numPages; i++) {
                      const page = await doc.getPage(i + 1);
                      const [width, height] = [
                        page.view[2] ?? 0,
                        page.view[3] ?? 0,
                      ];
                      pdfSizes.current.push({ width, height });
                    }
                  };
                  getsizes()
                    .then(() => {
                      if (!pdfSizes.current) return;
                      onLoadSuccess?.(
                        pdfSizes.current.map((s) => s.width / s.height)
                      );
                    })
                    .catch(() => undefined);
                }}
                onLoadError={onLoadError}
                options={options}
                error={""}
                loading={""}
                noData={""}
              >
                <PDFPage
                  pageIndex={pdfInfo?.currentPage}
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
            ) : (
              typeof file === "string" &&
              pdfInfo &&
              width && (
                <img
                  src={model.getPageImage(file, pdfInfo.currentPage, width)}
                  style={{ width: "100%", height: "100%" }}
                  onLoad={() => {
                    onLoadSuccess?.([]);
                    setReading(false);
                  }}
                  onError={onLoadError}
                />
              )
            )}
            <PageLabelLarge label={pageLabel} shown={reading} />
            <Items
              pageRect={pageRect}
              mode={mode}
              moveNote={moveNote}
              onEdit={setEditNote}
              onMove={setMoveNote}
            />
            <Move
              params={moveNote}
              onClose={(oldNote, newNote, addPolygon) => {
                if (
                  !addPolygon &&
                  newNote?.type === "Polygon" &&
                  !page?.notes?.some((n) => n === oldNote) // `!page`の場合も含んでいる
                ) {
                  // Polygonの追加時は点を追加して変形モードを続ける
                  // TODO ポリゴンを追加が終了したときにマウスカーソルがなぜか消えたままになる（Firefoxだと表示される）
                  const push = newNote.points[newNote.points.length - 1];
                  if (push) newNote.points.push([...push]);
                  setMoveNote({
                    type: "Node",
                    index: newNote.points.length - 1,
                    target: newNote,
                  });
                } else {
                  setMoveNote(undefined);
                  if (!oldNote || !newNote) return;
                  updateNote(oldNote, newNote);
                }
              }}
            />
          </Container>
        </MathJaxContext>

        <Excluded
          excluded={
            (!mode && !moveNote && page?.style?.includes("excluded")) ?? false
          }
        />
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
