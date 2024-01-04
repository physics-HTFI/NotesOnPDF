import { FC } from "react";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import Svg from "./Overlay/Svg";
import Chip from "./Overlay/Chip";
import { Mode } from "./SpeedDial";
import { useNotes } from "@/hooks/useNotes";
import { Node as NodeType, NoteType } from "@/types/Notes";
import SvgDefs from "./Overlay/SvgDefs";

/**
 * `Overlay`の引数
 */
interface Props {
  mode: Mode;
  pageRect?: DOMRect;
  moveNote?: NoteType | NodeType;
  onEdit: (note: NoteType) => void;
  onMove: (note: NoteType | NodeType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: FC<Props> = ({ mode, pageRect, moveNote, onEdit, onMove }) => {
  const { page, setNotes, popNote } = useNotes();
  if (!page?.notes || !setNotes || !pageRect) return <SvgDefs />;

  const props = <T extends NoteType | NodeType>(params: T) => ({
    key: JSON.stringify(params),
    mode,
    pageRect,
    params,
    onMouseDown: (p: NoteType | NodeType) => {
      if (mode === "move") onMove(p);
      if (p.type !== "Node") {
        if (mode === "edit") onEdit(p);
        if (mode === "delete") popNote(p);
      }
    },
  });

  const notes: NoteType[] = page.notes.filter((n) =>
    moveNote?.type === "Node" ? n !== moveNote.target : n !== moveNote
  );
  return (
    <>
      <SvgDefs />
      <Svg pageRect={pageRect}>
        {notes.map((p) => {
          return p.type === "Polygon" ? <Polygon {...props(p)} /> : undefined;
        })}
        {notes.map((p) => {
          return p.type === "Rect" ? <Rect {...props(p)} /> : undefined;
        })}
        {notes.map((p) => {
          return p.type === "Marker" ? <Marker {...props(p)} /> : undefined;
        })}
        {notes.map((p) => {
          return p.type === "Bracket" ? <Bracket {...props(p)} /> : undefined;
        })}
        {notes.map((p) => {
          return p.type === "Arrow" ? <Arrow {...props(p)} /> : undefined;
        })}
      </Svg>
      {notes.map((p) => {
        return p.type === "Note" ? <Note {...props(p)} /> : undefined;
      })}
      {notes.map((p) => {
        return p.type === "Chip" ? <Chip {...props(p)} /> : undefined;
      })}
      {notes.map((p) => {
        return p.type === "PageLink" ? <PageLink {...props(p)} /> : undefined;
      })}
    </>
  );
};

export default Overlay;
