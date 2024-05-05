import { FC, useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import PageLabelSmall from "./PageLabelSmall";
import PageLabelLarge from "./PageLabelLarge";
import SpeedDial, { Mode } from "./SpeedDial";
import { Node, NoteType } from "@/types/PdfNotes";
import Palette from "./Palette/Palette";
import Excluded from "./Excluded";
import Items from "./Items/Items";
import { MouseContext } from "@/contexts/MouseContext";
import Editor from "./Editor/Editor";
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
  const { setMouse, pageRect, top, bottom } = useContext(MouseContext);
  const { pdfNotes, page, updateNote, changePage } = usePdfNotes();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();

  const pageLabel = `p. ${pdfNotes?.pages[pdfNotes.currentPage]?.num ?? "???"}`;

  // ページ読み込み時にページ番号を出す
  const [reading, setReading] = useState(false);
  const { isReading } = useReading();
  if (isReading()) {
    setReading(true);
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      console.log(e.key);
    };
    return () => {
      document.onkeydown = null;
    };
  }, []);

  return (
    <Box
      sx={{
        background: getBackground(mode),
        height: "100vh",
        position: "relative",
        cursor: !mode ? "default" : "not-allowed",
      }}
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
            onEndRead={() => {
              setReading(false);
            }}
          />
        ) : (
          <PdfImage
            onEndRead={() => {
              setReading(false);
            }}
          />
        )}
        <Items
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
  );
};

export default PdfView;
