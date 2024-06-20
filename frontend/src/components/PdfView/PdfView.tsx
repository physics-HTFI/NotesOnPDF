import { lazy, useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import PageLabelSmall from "./PageLabelSmall";
import SpeedDial, { Mode } from "./SpeedDial";
import { Node, NoteType } from "@/types/PdfNotes";
import AddNotePalette from "./AddNotePalette/AddNotePalette";
import Excluded from "./Excluded";
import Items from "./Items/Items";
import MouseContext from "@/contexts/MouseContext";
import Editor from "./Editor/Editor";
import { grey } from "@mui/material/colors";
import Move from "./Move";
import PdfImageDesktop from "./PdfImageDesktop";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

const PdfImageWeb = lazy(() => import("./PdfImageWeb"));

/**
 * Pdfを表示するコンポーネント
 */
export default function PdfView() {
  const { modelFlags, appSettings } = useContext(ModelContext);
  const { setMouse, pageRect, top, bottom } = useContext(MouseContext);
  const {
    updaters: { page, updateNote, scrollPage, handleKeyDown },
  } = useContext(PdfNotesContext);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(undefined);
  const [editNote, setEditNote] = useState<NoteType>();
  const [moveNote, setMoveNote] = useState<NoteType | Node>();

  // ショートカットキーに対応する
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ctrl+ホイールでのズームを抑制する
      if (e.ctrlKey) {
        e.preventDefault();
      }
      e.getModifierState("Shift");
      scrollPage(
        0 < e.deltaY,
        e.getModifierState("Shift")
          ? "section"
          : e.getModifierState("Control")
          ? "chapter"
          : undefined
      );
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
  }, [editNote, handleKeyDown, mode, moveNote, scrollPage]);

  return (
    <Box
      sx={{
        background: getBackground(mode),
        height: "100vh",
        position: "relative",
        cursor:
          !mode ||
          (moveNote?.type === "Node" && moveNote.target.type === "Marker")
            ? "default"
            : "not-allowed",
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        if (!pageRect) return;
        if (appSettings?.cancelModeWithVoidClick) setMode(undefined);
        if (mode ?? moveNote) return;
        setMouse({ pageX: e.pageX, pageY: e.pageY });
        setPaletteOpen(true);
      }}
    >
      {/* PDF画像がある要素 */}
      <Container
        sx={{
          width: pageRect?.width,
          height: pageRect?.height,
          visibility: pageRect ? "visible" : "collapse",
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
        {/* 画像 */}
        {modelFlags.isWeb ? <PdfImageWeb /> : <PdfImageDesktop />}

        {/* 注釈アイテム */}
        <Items
          mode={mode}
          moveNote={moveNote}
          onEdit={setEditNote}
          onMove={setMoveNote}
        />

        {/* 移動中のアイテム */}
        <Move
          params={moveNote}
          onClose={(oldNote, newNote, addPolygon) => {
            if (
              !addPolygon &&
              newNote?.type === "Polygon" &&
              !page?.notes?.some((n) => n === oldNote) // `!page`の場合も含んでいる
            ) {
              // Polygonの追加時（点を追加して変形モードを続ける）
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
              if (editNote) {
                setEditNote(newNote);
              } else {
                updateNote(oldNote, newNote);
              }
            }
          }}
        />
      </Container>
      <Excluded
        excluded={
          (!mode &&
            !moveNote &&
            !editNote &&
            page?.style?.includes("excluded")) ??
          false
        }
      />
      <PageLabelSmall hidden={Boolean(moveNote)} />
      <SpeedDial mode={mode} setMode={setMode} hidden={Boolean(moveNote)} />
      <AddNotePalette
        open={paletteOpen}
        onClose={(note) => {
          setPaletteOpen(false);
          setMoveNote(note);
          setEditNote(note?.type === "Node" ? undefined : note);
        }}
      />
      <Editor
        open={Boolean(!moveNote && editNote)}
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
