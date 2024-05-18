import { useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import PageLabelSmall from "./PageLabelSmall";
import SpeedDial, { Mode } from "./SpeedDial";
import { Node, NoteType } from "@/types/PdfNotes";
import Palette from "./Palette/Palette";
import Excluded from "./Excluded";
import Items from "./Items/Items";
import MouseContext from "@/contexts/MouseContext";
import Editor from "./Editor/Editor";
import { grey } from "@mui/material/colors";
import Move from "./Move";
import usePdfNotes from "@/hooks/usePdfNotes";
import AppSettingsContext from "@/contexts/AppSettingsContext";
import PdfImageDesktop from "./PdfImageDesktop";
import PdfImageWeb from "./PdfImageWeb";
import ModelContext from "@/contexts/ModelContext";

/**
 * Pdfを表示するコンポーネント
 */
export default function PdfView() {
  const { modelFlags } = useContext(ModelContext);
  const { appSettings } = useContext(AppSettingsContext);
  const { setMouse, pageRect, top, bottom } = useContext(MouseContext);
  const { page, updateNote, scrollPage, handleKeyDown } = usePdfNotes();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(undefined);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();

  // ショートカットキーに対応する
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ctrl+ホイールでのズームを抑制する
      e.ctrlKey && e.preventDefault();
    };
    const handleKeyDownAll = (e: KeyboardEvent) => {
      if (mode ?? editNote ?? moveNote) {
        if (e.key === "Escape") {
          if (editNote ?? moveNote) {
            setEditNote(undefined);
            setMoveNote(undefined);
          } else {
            setMode(undefined);
          }
          return;
        }
        if (editNote ?? moveNote) return;
        // 矢印キーの場合などの場合は`return`せず`handleKeyDown`まで実行する
      }
      handleKeyDown(e);
    };
    document.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    document.onkeydown = handleKeyDownAll;
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.onkeydown = null;
    };
  }, [editNote, handleKeyDown, mode, moveNote]);

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
        if (appSettings?.cancelModeWithVoidClick) setMode(undefined);
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
        e.getModifierState("Shift");
        scrollPage(
          0 < e.deltaY,
          e.getModifierState("Shift")
            ? "section"
            : e.getModifierState("Control")
            ? "chapter"
            : undefined
        );
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
        {modelFlags.usePdfjs ? <PdfImageWeb /> : <PdfImageDesktop />}
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
      <PageLabelSmall hidden={Boolean(moveNote)} />
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
}

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
