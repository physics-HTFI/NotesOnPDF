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
import Node from "./Overlay/Node";

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

  const props = <T extends NoteType | NodeType>(p: T) => ({
    key: JSON.stringify(p),
    mode,
    pageRect,
    onMouseDown: () => {
      if (mode === "move") onMove(p);
      if (p.type !== "Node") {
        if (mode === "edit") onEdit(p);
        if (mode === "delete") popNote(p);
      }
    },
    params: p,
  });

  const notes: (NoteType | NodeType)[] = page.notes.filter(
    (n) => n !== moveNote
  );
  if (mode === "move" && !moveNote) {
    for (const n of notes) {
      switch (n.type) {
        case "Arrow":
        case "Bracket":
        case "Marker":
          notes.push({ type: "Node", target: n, index: 0 });
          notes.push({ type: "Node", target: n, index: 1 });
          break;
        case "Rect":
          notes.push({ type: "Node", target: n, index: 0 });
          notes.push({ type: "Node", target: n, index: 1 });
          notes.push({ type: "Node", target: n, index: 3 });
          notes.push({ type: "Node", target: n, index: 4 });
          break;
        case "Polygon":
          for (let i = 0; i < n.points.length; i++) {
            notes.push({ type: "Node", target: n, index: i });
          }
          break;
      }
    }
  }
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
        {notes.map((p) => {
          return p.type === "Node" ? <Node {...props(p)} /> : undefined;
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
