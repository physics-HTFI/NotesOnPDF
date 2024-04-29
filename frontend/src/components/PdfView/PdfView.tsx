import { FC, useCallback, useContext, useState } from "react";
import { Box, Container } from "@mui/material";
import PageLabelSmall from "./PageLabelSmall";
import PageLabelLarge from "./PageLabelLarge";
import SpeedDial, { Mode } from "./SpeedDial";
import { Node, NoteType, PdfNotes } from "@/types/PdfNotes";
import Palette from "./Palette";
import Excluded from "./Excluded";
import Items from "./Items";
import { MouseContext } from "@/contexts/MouseContext";
import Editor from "./Editor";
import { grey } from "@mui/material/colors";
import Move from "./Move";
import usePdfNotes from "@/hooks/usePdfNotes";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import PdfImage from "./PdfImage";
import PdfImageMock from "./PdfImageMock";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";

/**
 * モードに応じた背景色を返す
 */
function getBackground(mode: Mode): string {
  const base = grey[300];
  const stripe =
    mode === "edit"
      ? "#e0e0f8"
      : mode === "move"
      ? "#e0e5e0"
      : mode === "delete"
      ? "#eae0e0"
      : base;
  return `repeating-linear-gradient(-60deg, ${stripe}, ${stripe} 5px, ${base} 5px, ${base} 10px)`;
}

/**
 * 注釈の倍率を返す
 */
function getScale(pdfNotes?: PdfNotes, pageRect?: DOMRect) {
  if (!pdfNotes || !pageRect) return 100;
  return (pdfNotes.settings.fontSize * pageRect.width) / 500;
}

/**
 * ページのサイズと位置を返す
 */
function getRect(
  pdfNotes?: PdfNotes,
  containerRect?: DOMRect
): { pageRect?: DOMRect; top?: number; bottom?: number } {
  const pdfRatio = pdfNotes?.pages[pdfNotes.currentPage]?.sizeRatio;
  if (!pdfNotes || !pdfRatio || !containerRect) return {};
  return preferredSize(
    pdfNotes.settings.offsetTop,
    pdfNotes.settings.offsetBottom,
    pdfRatio,
    containerRect.width,
    containerRect.height,
    containerRect.x
  );

  /**
   * [width, height, deltaY（＝view中心とPdf中心の差）]
   */
  function preferredSize(
    offsetTop: number,
    offsetBottom: number,
    pdfRatio: number, // width / height
    viewW: number,
    viewH: number,
    viewX: number
  ) {
    const H = viewH / (1 - offsetTop - offsetBottom);
    const W = pdfRatio * H;
    const ratio = Math.min(1, viewW / W); // 画像が横にはみ出しそうな場合にこの係数をかけて収める
    const top = H * offsetTop;
    const bottom = H * offsetBottom;
    const tbRatio =
      ratio * H < viewH
        ? 0 // ページ内に収まる場合は中央に配置する
        : 1 - ((1 - ratio) * H) / (top + bottom); // ratio==1の時に 1, ratio*H==viewH(==H-top-bottom) の時（ページサイズ＝画像サイズ）に 0 になる
    const x = viewX + (viewW + ratio * W) / 2;
    return {
      pageRect: new DOMRect(x, -tbRatio * top, ratio * W, ratio * H),
      top: -tbRatio * top,
      bottom: -tbRatio * bottom,
    };
  }
}

/**
 * 読み込み中かどうかを返すカスタムフック
 */
function useReading() {
  const [prev, setPrev] = useState<{
    idOrFile: string | File;
    page: number;
  }>();
  const { id, file, pdfNotes } = useContext(PdfNotesContext);

  const isReading = () => {
    const idOrFile = id ?? file;
    if (pdfNotes && idOrFile) {
      if (prev?.idOrFile !== idOrFile || prev.page !== pdfNotes.currentPage) {
        setPrev({
          idOrFile: idOrFile,
          page: pdfNotes.currentPage,
        });
        return true;
      }
    }
  };
  return { isReading };
}

/**
 * Pdfを表示するコンポーネント
 */
const PdfView: FC = () => {
  const { appSettings } = useContext(AppSettingsContext);
  const { pdfNotes, page, updateNote, changePage } = usePdfNotes();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>(null);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();

  const containerRect = refContainer?.getBoundingClientRect();
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const { pageRect, top, bottom } = getRect(pdfNotes, containerRect);
  const pageLabel = `p. ${pdfNotes?.pages[pdfNotes.currentPage]?.num ?? "???"}`;
  const scale = getScale(pdfNotes, pageRect);

  const getContainerRect = useCallback((ref: HTMLDivElement) => {
    setRefContainer(ref);
  }, []);

  // ページ読み込み時にページ番号を出す
  const [reading, setReading] = useState(false);
  const { isReading } = useReading();
  if (isReading()) {
    setReading(true);
  }

  return (
    <MouseContext.Provider value={{ mouse, setMouse, pageRect, scale }}>
      <Box
        sx={{
          background: getBackground(mode),
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
          setPaletteOpen(true);
        }}
        onMouseUp={() => {
          setPaletteOpen(false);
        }}
        onMouseLeave={() => {
          setPaletteOpen(false);
        }}
        onWheel={(e) => {
          changePage(e.deltaY < 0 ? -1 : 1);
        }}
      >
        {/* PDF画像がある要素 */}
        <Container
          sx={{
            width: pageRect?.width,
            height: pageRect?.height,
            position: "absolute",
            top,
            bottom,
            left: 0,
            right: 0,
            margin: "auto",
            containerType: "size",
          }}
          disableGutters
        >
          {import.meta.env.VITE_IS_MOCK === "true" ? (
            <PdfImageMock
              width={pageRect?.width}
              onEndRead={() => {
                setReading(false);
              }}
            />
          ) : (
            <PdfImage
              width={pageRect?.width}
              onEndRead={() => {
                setReading(false);
              }}
            />
          )}
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

        <Excluded
          excluded={
            (!mode && !moveNote && page?.style?.includes("excluded")) ?? false
          }
        />
        <PageLabelLarge label={pageLabel} shown={reading} />
        <PageLabelSmall label={pageLabel} hidden={Boolean(moveNote)} />
        <SpeedDial mode={mode} setMode={setMode} hidden={Boolean(moveNote)} />
        <Palette
          open={paletteOpen}
          onClose={(note) => {
            setPaletteOpen(false);
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

export default PdfView;
